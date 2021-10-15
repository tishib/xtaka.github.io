'use strict';
/**
 * IMPROVE
 * - Rename for pl, bpm, lm easy to understand
 * TODO
 * - Error with Permissions-Policy header: Unrecognized feature: 'interest-cohort'.
 * - データダンプAPI (/v4/RDF_TYPE.json?
*/

// import test from "./mock.js"; // todo CORS


// pole
const pl = []; // pole list
function getPoles() {
  const r1 = new XMLHttpRequest();
  return new Promise(resolve => {
    r1.addEventListener("load", e => {
      if (e.target.status == 200 && e.target.responseText) {
        const json = JSON.parse(e.target.responseText);
        for (let i = 0; i < json.length; i++) {
          pl.push({
            id: json[i]["owl:sameAs"],
            lat: json[i]["geo:lat"],
            lng: json[i]["geo:long"],
            name: json[i]["title"],
          });
        }
        return resolve(pl);
      }
    });
    r1.open("GET", "https://api-tokyochallenge.odpt.org/api/v4/odpt:BusstopPole?odpt:operator=odpt.Operator:Toei&acl:consumerKey=8a65991fa76f15df8f4410b4a823c5cee45a5faa64a291d5194d4891f629d793", true);
    r1.send();
  });
}

// bus
const bpm = new Map(); // bus of pole map
function getBuss(){
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
    r2.open("GET", "https://api-tokyochallenge.odpt.org/api/v4/odpt:Bus?odpt:operator=odpt.Operator:Toei&acl:consumerKey=8a65991fa76f15df8f4410b4a823c5cee45a5faa64a291d5194d4891f629d793", true);
    r2.send();
  });
}

// calendar
const cl = []; // calendar id list
function getCalendars() {
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
    r3.open("GET", "https://api-tokyochallenge.odpt.org/api/v4/odpt:Calendar?odpt:operator=odpt.Operator:Toei&acl:consumerKey=8a65991fa76f15df8f4410b4a823c5cee45a5faa64a291d5194d4891f629d793", true);
    r3.send();
  });
}

function compareLatLng(v1, v2) {
  return (Math.floor((v1 * 100)) / 100 == Math.floor((v2 * 100)) / 100 ? true : false);
}

// time tables
const ttm = new Map();
function getTimetables(pos) {
  return new Promise(resolve => {
    // init map
    for (let i = 0; i < pl.length; i++) {
      if (compareLatLng(pos.lat, pl[i]["lat"])) {
        if (compareLatLng(pos.lng, pl[i]["lng"])) {
          let buss = bpm.get(pl[i]["id"]);
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
    ttm.set("odpt.BusroutePattern:Toei.T01.8501.1"); // [temp]
    let rr = [], i = 0;
    ttm.forEach((v, k, m) => {
      rr[i] = new XMLHttpRequest();
      rr[i].open("GET", `https://api-tokyochallenge.odpt.org/api/v4/odpt:BusTimetable?odpt:operator=odpt.Operator:Toei&odpt:busroutePattern=${k}&acl:consumerKey=8a65991fa76f15df8f4410b4a823c5cee45a5faa64a291d5194d4891f629d793`, true);
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
  return (getRTofTimetable(ttm, busData) - getRTofCurrent(busData));
}

var openFlag = false;
function openFooterMenu() {
  if (!openFlag) {
    document.getElementById("footer-menu").style.height = "300px";
    openFlag = true;
  }
}

function closeFooterMenu() {
  if (openFlag) {
    document.getElementById("footer-menu").style.height = "0px";
    openFlag = false;
  }
}

function drawPoles(pos, map) {
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
  for (let i = 0; i < pl.length; i++) {
    if (crrLat == Math.floor((pl[i]["lat"] * 100)) / 100) {
      if (crrLng == Math.floor((pl[i]["lng"] * 100)) / 100) {
        let m = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          clickable: true,
          cursor: (usrLang == "ja") ? pl[i]["name"]["ja"] : pl[i]["name"]["en"],
          label: labels[ind++ % labels.length],
          map: map,
          position: {lat: pl[i]["lat"], lng: pl[i]["lng"]},
          title: (usrLang == "ja") ? pl[i]["name"]["ja"] : pl[i]["name"]["en"],
          visible: true,
          // icon: svg, // [todo] wrong a position of label
        });

        m.addListener("click", () => {
          const poleName = `[${m.getLabel()}] ${lm.get(m.getLabel())["pole"]["name"]}`;
          const busDatas = lm.get(m.getLabel())["bus"];

          document.getElementById("pole").innerText = poleName;

          if (busDatas) {
            let parent = document.getElementById("list-bus");
            while (parent.firstChild) {
              parent.removeChild(parent.firstChild);
            }

            // [todo] sort fot busDatas

            busDatas.forEach(item => {
              let li = document.createElement("li");
              let img = document.createElement("img");
              let p = document.createElement("p");
              let span = document.createElement("span");
              let t = calRemainingTime(ttm, item, poleName);

              li.setAttribute("class", "list-group-item");
              img.setAttribute("src", "./icon_bus_18.svg");
              img.setAttribute("alt", "busIcon");
              img.setAttribute("width", "32");
              img.setAttribute("height", "32");
              p.setAttribute("class", "h6 text-wrap");
              p.innerText = item["nameJa"];
              p.id = `${PREFIX}-${item["id"]}`;
              span.setAttribute("class", (t > 1 ? "badge bg-primary" : "badge bg-danger"));
              span.innerText = `あと${t}分`;

              parent.appendChild(li);
              li.appendChild(img);
              li.appendChild(p);
              p.appendChild(span);
            });

            openFooterMenu();

            // [todo] animate a pole icon
            // if (m.getAnimation() != null) {
            //   m.setAnimation(null);
            // } else {
            //   m.setAnimation(google.maps.Animation.BOUNCE);
            // }
          }
        });

        lm.set(m.getLabel(), {
          // bus: bpm.get(pl[i]["id"]) || null, // [todo] no data in out of service
          bus: bpm.get(pl[i]["id"]) || [
            {
              endPole: "odpt.BusstopPole:Toei.ShibuyaStation.636.8",
              fromPole: "odpt.BusstopPole:Toei.EXTheaterRoppongi.1613.3",
              fromPoleTime: `2021-09-15T14:${new Date(Date.now()).getMinutes() - 2}:25+09:00`,
              id: "odpt.Bus:Toei.T01.8501.2.F557",
              nameJa: "都０１（Ｔ０１） 新橋駅前→渋谷駅前 虎ノ門",
              occupancyStatus: undefined,
              routePattern: "odpt.BusroutePattern:Toei.T01.8501.1",
              toPole: "odpt.BusstopPole:Toei.RoppongiStation.1609.3",
            },
            {
              endPole: "odpt.BusstopPole:Toei.ShibuyaStation.636.8",
              fromPole: "odpt.BusstopPole:Toei.EXTheaterRoppongi.1613.3",
              fromPoleTime: `2021-09-15T14:${new Date(Date.now()).getMinutes()}:25+09:00`,
              id: "odpt.Bus:Toei.T01.8501.2.F557",
              nameJa: "都０１（Ｔ０１） 新橋駅前→渋谷駅前 虎ノ門",
              occupancyStatus: undefined,
              routePattern: "odpt.BusroutePattern:Toei.T01.8501.1",
              toPole: "odpt.BusstopPole:Toei.RoppongiStation.1609.3",
            },
            {
              endPole: "odpt.BusstopPole:Toei.ShibuyaStation.636.8",
              fromPole: "odpt.BusstopPole:Toei.EXTheaterRoppongi.1613.3",
              fromPoleTime: `2021-09-15T14:${new Date(Date.now()).getMinutes()}:25+09:00`,
              id: "odpt.Bus:Toei.T01.8501.2.F557",
              nameJa: "都０１（Ｔ０１） 新橋駅前→渋谷駅前 虎ノ門",
              occupancyStatus: undefined,
              routePattern: "odpt.BusroutePattern:Toei.T01.8501.1",
              toPole: "odpt.BusstopPole:Toei.RoppongiStation.1609.3",
            },
            {
              endPole: "odpt.BusstopPole:Toei.ShibuyaStation.636.8",
              fromPole: "odpt.BusstopPole:Toei.EXTheaterRoppongi.1613.3",
              fromPoleTime: `2021-09-15T14:${new Date(Date.now()).getMinutes()}:25+09:00`,
              id: "odpt.Bus:Toei.T01.8501.2.F557",
              nameJa: "都０１（Ｔ０１） 新橋駅前→渋谷駅前 虎ノ門",
              occupancyStatus: undefined,
              routePattern: "odpt.BusroutePattern:Toei.T01.8501.1",
              toPole: "odpt.BusstopPole:Toei.RoppongiStation.1609.3",
            },
          ], // [temp] test data
          pole: {
            id: pl[i]["id"],
            name: (usrLang == "ja") ? pl[i]["name"]["ja"] : pl[i]["name"]["en"],
          },
        });
      }
    }
  }

  // marker of my location
  let image = {
    url: "./icon_loc_20px_250ms.gif",
  };
  new google.maps.Marker({
    position: {lat: pos.lat, lng: pos.lng},
    map,
    icon: image,
  });

  // close button
  document.getElementById("btn-close").addEventListener("click", closeFooterMenu); // xxx
}

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"),{
    center: {lat: 35.6812, lng: 139.7671}, // tokyo station
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

  locationButton.textContent = "近くのバス停を検索";
  locationButton.setAttribute("class", "btn btn-light shadow-sm p-3 mb-5 bg-white rounded");
  locationButton.classList.add("custom-map-control-button");
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          pos.lat = 35.6812; pos.lng = 139.7671; // [temp] set to the location of tokyo station.
          map.setCenter(pos);
          map.setZoom(16);
        
          await getTimetables(pos);
          await drawPoles(pos, map);
        },
        () => {}
      );
    } else {
      // doesn't support Geolocation
    }
  });
  
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
}

async function init() {
  await getPoles();
  await getBuss();
  await getCalendars();
}

function main() {
  try {
    init();
  } catch (err) {
    // todo
  }
}

main();