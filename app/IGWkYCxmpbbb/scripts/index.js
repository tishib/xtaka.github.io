'use strict';
/**
 * IMPROVE
 * - Rename for pl, bpm, lm easy to understand
 * TODO
 * - Error with Permissions-Policy header: Unrecognized feature: 'interest-cohort'.
 * - データダンプAPI (/v4/RDF_TYPE.json?
*/

// import test from "./mock.js"; // todo CORS

const X_ACL_CONSUMERKEY = '8a65991fa76f15df8f4410b4a823c5cee45a5faa64a291d5194d4891f629d793';
const TOKYO_STATION = {'lat': 35.6812, 'lng': 139.7671};


// bus
const bpm = new Map(); // bus of pole map
function fetchBusData(){
  const r2 = new XMLHttpRequest();
  return new Promise(resolve => {
    r2.addEventListener("load", e => {
      if (e.target.status == 200 && e.target.responseText) {
        const json = JSON.parse(e.target.responseText);
        for (let i = 0; i < json.length; i++) {
          if (bpm.has(json[i]["odpt:toBusstopPole"])) { // pole id
            let arr = bpm.get(json[i]["odpt:toBusstopPole"]);
            arr.push({
              endPole: json[i]["odpt:terminalBusstopPole"],
              occupancyStatus: json[i]["odpt:occupancyStatus"],
              fromPole: json[i]["odpt:fromBusstopPole"],
              fromPoleTime: json[i]["odpt:fromBusstopPoleTime"],
              id: json[i]["owl:sameAs"], // bus id
              nameJa: json[i]["odpt:note"],
              routePattern: json[i]["odpt:busroutePattern"],
              toPole: json[i]["odpt:toBusstopPole"],
            });
            bpm.set(json[i]["odpt:toBusstopPole"], arr);
          } else {
            bpm.set(json[i]["odpt:toBusstopPole"], [{
              endPole: json[i]["odpt:terminalBusstopPole"],
              occupancyStatus: json[i]["odpt:occupancyStatus"],
              fromPole: json[i]["odpt:fromBusstopPole"],
              fromPoleTime: json[i]["odpt:fromBusstopPoleTime"],
              id: json[i]["owl:sameAs"],
              nameJa: json[i]["odpt:note"],
              routePattern: json[i]["odpt:busroutePattern"],
              toPole: json[i]["odpt:toBusstopPole"],
            }]);
          }
        }
        return resolve(bpm);
      }
    });
    r2.open("GET", `https://api-tokyochallenge.odpt.org/api/v4/odpt:Bus?odpt:operator=odpt.Operator:Toei&acl:consumerKey=${X_ACL_CONSUMERKEY}`, true);
    r2.send();
  });
}

// calendar
const cl = []; // calendar id list
function fetchCalendarData() {
  const r3 = new XMLHttpRequest();
  return new Promise(resolve => {
    r3.addEventListener("load", e => {
      if (e.target.status == 200 && e.target.responseText) {
        const json = JSON.parse(e.target.responseText);
        const today = `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart("2", 0)}-${(new Date().getDate()).toString().padStart("2", 0)}`; // format iso8601
        for (let i = 0; i < json.length; i++) {
          let arr = json[i]["odpt:day"];
          for (let j = 0; j < arr.length; j++) {
            if (today == arr[j]) {
              cl.push(json[i]["owl:sameAs"])
            }
          }
        }
        return resolve(cl);
      }
    });
    r3.open("GET", `https://api-tokyochallenge.odpt.org/api/v4/odpt:Calendar?odpt:operator=odpt.Operator:Toei&acl:consumerKey=${X_ACL_CONSUMERKEY}`, true);
    r3.send();
  });
}

function compLatLng(v1, v2) {
  return (Math.floor((v1 * 100)) / 100 == Math.floor((v2 * 100)) / 100 ? true : false);
}

// time tables
const ttm = new Map();
function fetchTimeTableData(pos, bpm, ttm, pl2) {
  return new Promise(resolve => {
    // init map
    for (let i = 0; i < pl2.length; i++) { // TODO
      if (compLatLng(pos.lat, pl2[i]["lat"])) {
        if (compLatLng(pos.lng, pl2[i]["lng"])) {
          let buss = bpm.get(pl2[i]["id"]);
          if (buss) { // xxx
            for (let j = 0; j < buss.length; j++) {
              ttm.set(buss[j]["routePattern"]);
            }
          } else {
            // todo
          }
        }
      }
    }

    // put data to map
    let rr = [], i = 0;
    ttm.forEach((v, k, m) => {
      rr[i] = new XMLHttpRequest();
      rr[i].open("GET", `https://api-tokyochallenge.odpt.org/api/v4/odpt:BusTimetable?odpt:operator=odpt.Operator:Toei&odpt:busroutePattern=${k}&acl:consumerKey=${X_ACL_CONSUMERKEY}`, true);
      rr[i].addEventListener("load", e => {
        if (e.target.status == 200 && e.target.responseText) {
          const json = JSON.parse(e.target.responseText);
          cl.forEach(calendar => {
            json.forEach(timetable => {
              if (calendar == timetable["odpt:calendar"]){
                ttm.set(k, [timetable]);
                return;
              }
            });
          });
        }
      });
      rr[i].send();
      i++;
    });
    return resolve(ttm);
  });
}

// pole2
const pl2 = [];
function fetchPoleData2(pos) {
  return new Promise(resolve => {
    let r = new XMLHttpRequest();
    r.open("GET", `https://api-tokyochallenge.odpt.org/api/v4/places/odpt:BusstopPole?lon=${pos['lng']}&lat=${pos['lat']}&radius=300&odpt:operator=odpt.Operator:Toei&acl:consumerKey=${X_ACL_CONSUMERKEY}`, true);
    r.addEventListener('load', evt => {
      if (evt.target.status == 200 && evt.target.responseText) {
        let json = JSON.parse(evt.target.responseText);
        for (let i = 0; i < json.length; i++) {
          pl2.push({
            id: json[i]["owl:sameAs"],
            lat: json[i]["geo:lat"],
            lng: json[i]["geo:long"],
            name: json[i]["title"],
          });
        }
        return resolve(pl2);
      }
    });
    r.send();
  });
}

// other
var usrLang = "";
if (navigator.language) {
  usrLang = navigator.language;
}

function getRTofTimetable(ttm, busData) {
  let d = 0; // departure time
  let a = 0; // arrival time
  let timetable = ttm.get(busData["routePattern"]);

  if (timetable[0]) {
    timetable[0]["odpt:busTimetableObject"].forEach(item => {
      if (item["odpt:busstopPole"] == busData["fromPole"]) d = item["odpt:departureTime"];
      if (item["odpt:busstopPole"] == busData["toPole"]) a = item["odpt:arrivalTime"];
      if (d && a) return;
    });
  }
  return (new Date(`01 Jan 1970 ${a}:00 GMT`).getMinutes() - new Date(`01 Jan 1970 ${d}:00 GMT`).getMinutes()) || -1;
}

function getRTofCurrent(busData) {
  let diff = (Date.now() - new Date(busData["fromPoleTime"]));
  return new Date(diff).getMinutes();
}

const lut = new Map(); // todo
function calRemainingTime(ttm, busData) {
  const adjust = 1; // one minutes
  return (getRTofTimetable(ttm, busData) - getRTofCurrent(busData) - adjust);
}

var openFlag = false;
function openFooterMenu() {
  if (!openFlag) {
    document.getElementById("footer-menu").style.height = "300px";
    openFlag = true;
  }
}

function closeFooterMenu(evt) {
  evt.preventDefault();
  if (openFlag) {
    document.getElementById("footer-menu").style.height = "0px";
    openFlag = false;
  }
}

var prevLocMarker = null;
function drawLocMarker(pos, map, prev) {
  let image = {
    url: "./assets/icon_loc_20px_250ms.gif",
  };

  if (prev) prev.visible = false;

  prevLocMarker = new google.maps.Marker({
    position: {lat: pos.lat, lng: pos.lng},
    map,
    icon: image,
    optimized: false, // for gif icon
  });
}

function drawPoleMarkers(pos, map, ttm, bpm) {
  const crrLat = Math.floor((pos.lat * 100)) / 100; // xxx
  const crrLng = Math.floor((pos.lng * 100)) / 100;
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lm = new Map(); // label map
  const PREFIX = "xxx"; // todo
  let ind = 0;
  let svg = {
    path: "M192 0C85.97 0 0 85.97 0 192c0 77.41 26.97 99.03 172.3 309.7c9.531 13.77 29.91 13.77 39.44 0C357 291 384 269.4 384 192C384 85.97 298 0 192 0zM192 271.1c-44.13 0-80-35.88-80-80S147.9 111.1 192 111.1s80 35.88 80 80S236.1 271.1 192 271.1z",
    fillColor: "blue",
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 0.075,
    anchor: new google.maps.Point(-1, -1),
  };

  // marker of pole
  for (let i = 0; i < pl2.length; i++) {
    if (crrLat == Math.floor((pl2[i]["lat"] * 100)) / 100) {
      if (crrLng == Math.floor((pl2[i]["lng"] * 100)) / 100) {
        let m = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          clickable: true,
          cursor: (usrLang == "ja") ? pl2[i]["name"]["ja"] : pl2[i]["name"]["en"],
          label: labels[ind++ % labels.length],
          map: map,
          position: {lat: pl2[i]["lat"], lng: pl2[i]["lng"]},
          title: (usrLang == "ja") ? pl2[i]["name"]["ja"] : pl2[i]["name"]["en"],
          visible: true,
          // icon: svg, // [todo] wrong a position of label
        });

        m.addListener("click", () => {
          let poleName = `[${m.getLabel()}] ${lm.get(m.getLabel())["pole"]["name"]}`;
          let parent = document.getElementById("list-bus");
          let busDatas = lm.get(m.getLabel())["bus"];

          document.getElementById("pole").innerText = poleName;

          while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
          }

          if (busDatas) {
            // [todo] sort fot busDatas
            busDatas.forEach(item => {
              let li = document.createElement("li");
              let img = document.createElement("img");
              let p = document.createElement("p");
              let span = document.createElement("span");
              let t = calRemainingTime(ttm, item, poleName);

              li.setAttribute("class", "list-group-item");
              img.setAttribute("src", "./assets/icon_bus_18.svg");
              img.setAttribute("alt", "busIcon");
              img.setAttribute("width", "32");
              img.setAttribute("height", "32");
              p.setAttribute("class", "h6 text-wrap");
              p.innerText = item["nameJa"];
              p.id = `${PREFIX}-${item["id"]}`;
              if (t > 1) {
                span.setAttribute("class", "badge bg-primary");
              } else if (t < 0) {
                span.setAttribute("class", "badge bg-secondary");
              } else {
                span.setAttribute("class", "badge bg-danger");
              }
              span.innerText = `あと${t}分`;

              parent.appendChild(li);
              li.appendChild(img);
              li.appendChild(p);
              p.appendChild(span);
            });

            // [todo] animate a pole icon
            // if (m.getAnimation() != null) {
            //   m.setAnimation(null);
            // } else {
            //   m.setAnimation(google.maps.Animation.BOUNCE);
            // }
          }
          openFooterMenu();
        });

        lm.set(m.getLabel(), {
          // bus: bpm.get(pl2[i]["id"]) || null, // [todo] no data in out of service
          bus: bpm.get(pl2[i]["id"]),
          pole: {
            id: pl2[i]["id"],
            name: (usrLang == "ja") ? pl2[i]["name"]["ja"] : pl2[i]["name"]["en"],
          },
        });
      }
    }
  }

  // draw current location marker
  drawLocMarker(pos, map, prevLocMarker);

  // close button
  document.getElementById("btn-close").addEventListener("click", closeFooterMenu, false); // xxx

  // info as of
  let now = Date.now();
  document.getElementById("info-as-of").innerText = `${new Date(now).getHours()}:${new Date(now).getMinutes()} 時点`; // todo
}

function initLocBtn(locationButton, map) {
  locationButton.textContent = "近くのバス停を検索";
  locationButton.setAttribute("class", "btn btn-light shadow-sm p-3 mb-5 bg-white rounded");
  locationButton.classList.add("custom-map-control-button");
  locationButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          pos.lat = TOKYO_STATION['lat']; pos.lng = TOKYO_STATION['lng']; // [debug] tokyo station.
          map.setCenter(pos);
          map.setZoom(17);
        
          await fetchPoleData2(pos);
          await fetchTimeTableData(pos, bpm, ttm, pl2);
          await drawPoleMarkers(pos, map, ttm, bpm);
        },
        () => {}
      );
    } else {
      // doesn't support Geolocation
    }
  }, false);
}

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"),{
    center: {lat: TOKYO_STATION['lat'], lng: TOKYO_STATION['lng']},
    zoom: 11,
    streetViewControl: false, // map control
    rotateControl: false,
    fullscreenControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,
    },
    disableDefaultUI: true,
  });
  const locationButton = document.createElement("button");

  initLocBtn(locationButton, map);
  
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationButton);
}

function openSideNav(evt) {
  evt.preventDefault();
  document.getElementById("side-nav").style.width = "130px";
}

function closeSideNav(evt) {
  evt.preventDefault();
  document.getElementById("side-nav").style.width = "0px";
}

function initListener() {
  // open side nav
  document.getElementById("open-side-nav").addEventListener("click", openSideNav, false);

  // close side nav
  document.getElementById("side-nav").addEventListener("click", closeSideNav, false);
  document.getElementById("side-nav").addEventListener("touchmove", closeSideNav, false);
}

async function init() {
  await fetchBusData();
  await fetchCalendarData();

  initListener();  
}

function main() {
  try {
    init();
  } catch (err) {
    // todo
  }
}

main();