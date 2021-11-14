'use strict';
/**
 * IMPROVE
 * - Rename for pl, bpm, lm easy to understand
 * TODO
 * - Error with Permissions-Policy header: Unrecognized feature: 'interest-cohort'.
*/

// import test from "./mock.js"; // todo CORS

//
// config
//
const X_ACL_CONSUMERKEY = '8a65991fa76f15df8f4410b4a823c5cee45a5faa64a291d5194d4891f629d793';
const TOKYO_MARUNOUCHI = {'lat': 35.6822977, 'lng': 139.7650716};
const SHINJUKU = {'lat': 35.690921, 'lng': 139.7002579};
const SHIBUYA = {'lat': 35.6592341, 'lng': 139.7000584};
const LABEL_ORIGIN = {"x": 8, "y": 4};
const SVG_AFTER = {
  path: "M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z",
  fillColor: (isDark() ? "#f8f9fa" : "#6c757d"),
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: "#343a40",
  rotation: 0,
  scale: 5,
  labelOrigin: null,
  };
const SVG_BEFORE = {
    path: "M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z",
    fillColor: (isDark() ? "#f8f9fa" : "#6c757d"),
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#343a40",
    rotation: 0,
    scale: 3.5,
    labelOrigin: null,
    };
const SVG_AFTER2 = {
  path: "M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z",
  fillColor: "#0d6efd",
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: "#0d6efd",
  rotation: 0,
  scale: 5,
  labelOrigin: null,
  };
const SVG_BEFORE2 = {
    path: "M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z",
    fillColor: "#0d6efd",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#0d6efd",
    rotation: 0,
    scale: 3.5,
    labelOrigin: null,
    };
const PREFIX = "pole";
const ZINDEX_LV = [1000, 2000, 3000, 4000, 5000]; // todo
    
//
// i11l
//
const JAEN = {
  ja: {
    findStation: '近くのバス停を検索',
    crrTime: ' 時点',
    remainTime: ['あと', '分'],
    supportBus: '対応路線',
    supportBusItems: ['都営バス'],
  },
  en: {
    findStation: 'Find Bus Station',
    crrTime: 'As of ',
    remainTime: ['', 'min left'],
    supportBus: 'Support Bus',
    supportBusItems: ['Toei'],
  },
};

//
// util
//
function isDark() {
  if (window.mediaMatch && !window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return false;
  return true;
}

function compLatLng(v1, v2) {
  return (Math.floor((v1 * 100)) / 100 == Math.floor((v2 * 100)) / 100 ? true : false);
}

//
// dummy
//
function dummy1(parent) {
  let li = document.createElement("li");
  let img = document.createElement("img");
  let p = document.createElement("p");
  let span = document.createElement("span");
  let t = 99;

  li.setAttribute("class", "list-group-item");
  img.setAttribute("src", "./assets/icon_bus_18.svg");
  img.setAttribute("alt", "busIcon");
  img.setAttribute("width", "32");
  img.setAttribute("height", "32");
  p.setAttribute("class", "text-truncate mb-0");
  p.innerText = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX→XXXXXXXXXXXXXXXXXXXXX';
  
  if (t > 1) {
    span.setAttribute("class", "badge bg-primary");
  } else if (t < 0) {
    span.setAttribute("class", "badge bg-secondary");
  } else {
    span.setAttribute("class", "badge bg-danger");
  }
  span.innerText = `${(usrLang == 'ja' ? JAEN['ja']['remainTime'][0] : JAEN['en']['remainTime'][0])} \
    ${t} \
    ${(usrLang == 'ja' ? JAEN['ja']['remainTime'][1] : JAEN['en']['remainTime'][1])}`;

  parent.appendChild(li);
  li.appendChild(img);
  li.appendChild(p);
  li.appendChild(span);
}

//
// app
//
function getToeiBusNameEn(json) {
  let startPole = json['odpt:startingBusstopPole'].replaceAll('odpt.BusstopPole:Toei.', '');
  let termPole = json['odpt:terminalBusstopPole'].replaceAll('odpt.BusstopPole:Toei.', '');
  let busRoute = json['odpt:busroute'].replaceAll('odpt.Busroute:Toei.', '');
  return `${busRoute} ${startPole.substring(0, startPole.indexOf('.'))}→${termPole.substring(0, termPole.indexOf('.'))}`;
}

// bus
const bpm = new Map(); // bus of pole map
function fetchBusData(){
  const r2 = new XMLHttpRequest();
  return new Promise(resolve => {
    r2.addEventListener("load", e => {
      if (e.target.status == 200 && e.target.responseText) {
        const json = JSON.parse(e.target.responseText);
        for (let i = 0; i < json.length; i++) {
          let busNameEn = getToeiBusNameEn(json[i]);
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
              nameEn: busNameEn,
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
              nameEn: busNameEn,
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

// time tables
const ttm = new Map();
function fetchTimeTableData(pos, bpm, ttm, pl2) {
  return new Promise(resolve => {
    // init map
    for (let i = 0; i < pl2.length; i++) { // todo
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
    r.open("GET", `https://api-tokyochallenge.odpt.org/api/v4/places/odpt:BusstopPole?lon=${pos['lng']}&lat=${pos['lat']}&radius=200&odpt:operator=odpt.Operator:Toei&acl:consumerKey=${X_ACL_CONSUMERKEY}`, true);
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
  if (timetable) {
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
  const adjust = 1; // for "time lag" between DB update and real world
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
    url: "./assets/icon_loc.gif",
  };

  if (prev) prev.visible = false;

  prevLocMarker = new google.maps.Marker({
    position: {lat: pos.lat, lng: pos.lng},
    map,
    icon: image,
    optimized: false, // for gif icon
  });
}

var prevPoleMarker = null;
function toggleMarker(marker) {
  if (prevPoleMarker != null && prevPoleMarker.get("isSvg2")) {
    prevPoleMarker.setIcon(SVG_BEFORE2);
  } else if (prevPoleMarker != null) {
    prevPoleMarker.setIcon(SVG_BEFORE);
  }

  if (marker.get("isSvg2")) {
    SVG_BEFORE2["labelOrigin"] = new google.maps.Point(LABEL_ORIGIN["x"], LABEL_ORIGIN["y"]); // todo
    SVG_AFTER2["labelOrigin"] = new google.maps.Point(LABEL_ORIGIN["x"], LABEL_ORIGIN["y"]); // todo
    marker.setIcon(SVG_AFTER2);
  } else {
    SVG_BEFORE["labelOrigin"] = new google.maps.Point(LABEL_ORIGIN["x"], LABEL_ORIGIN["y"]); // todo
    SVG_AFTER["labelOrigin"] = new google.maps.Point(LABEL_ORIGIN["x"], LABEL_ORIGIN["y"]); // todo
    marker.setIcon(SVG_AFTER);
  }

  prevPoleMarker = marker;
}

let prevMarkers = [];
function drawPoleMarkers(pos, map, ttm, bpm) {
  const LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lm = new Map(); // label map
  let ind = 0;

  // init marker
  SVG_BEFORE["labelOrigin"] = new google.maps.Point(LABEL_ORIGIN["x"], LABEL_ORIGIN["y"]); // todo
  SVG_BEFORE2["labelOrigin"] = new google.maps.Point(LABEL_ORIGIN["x"], LABEL_ORIGIN["y"]); // todo

  // remove previous markers
  prevMarkers.forEach(m => {
    m.setMap(null);
    console.log("run")
  });
  prevMarkers = [];
  
  for (let i = 0; i < pl2.length; i++) {
    if (compLatLng(pos.lat, pl2[i]["lat"]) || true) {
      if (compLatLng(pos.lng, pl2[i]["lng"]) || true) {
        let m = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          clickable: true,
          cursor: (usrLang == "ja") ? pl2[i]["name"]["ja"] : pl2[i]["name"]["en"],
          label: {
            text: LABELS[ind++ % LABELS.length],
            color: (isDark() ? "#212529" : "#ffffff"),
          },
          map: map,
          position: {lat: pl2[i]["lat"], lng: pl2[i]["lng"]},
          title: (usrLang == "ja") ? pl2[i]["name"]["ja"] : pl2[i]["name"]["en"],
          visible: true,
          icon: (bpm.get(pl2[i]["id"]) ? SVG_BEFORE2 : SVG_BEFORE),
          zIndx: ZINDEX_LV[0],
        });

        m.addListener("click", () => {
          let poleName = `[${m.getLabel().text}] ${lm.get(m.getLabel().text)["pole"]["name"]}`;
          let parent = document.getElementById("list-bus");
          let busDatas = lm.get(m.getLabel().text)["bus"];

          document.getElementById("pole").innerText = poleName;

          while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
          }

          // dummy1(parent);

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
              p.setAttribute("class", "text-truncate mb-0");
              p.innerText = (usrLang == 'ja' ? item["nameJa"] : item["nameEn"]);
              p.id = `${PREFIX}-${item["id"]}`;
              if (t > 1) {
                span.setAttribute("class", "badge bg-primary");
              } else if (t < 0) {
                span.setAttribute("class", "badge bg-secondary");
              } else {
                span.setAttribute("class", "badge bg-danger");
              }
              span.innerText = `${(usrLang == 'ja' ? JAEN['ja']['remainTime'][0] : JAEN['en']['remainTime'][0])} \
                ${t} \
                ${(usrLang == 'ja' ? JAEN['ja']['remainTime'][1] : JAEN['en']['remainTime'][1])}`;

              parent.appendChild(li);
              li.appendChild(img);
              li.appendChild(p);
              li.appendChild(span);
            });
          }
          openFooterMenu();
          toggleMarker(m);
        }, false);

        lm.set(m.getLabel().text, {
          // bus: bpm.get(pl2[i]["id"]) || null, // [todo] no data in out of service
          bus: bpm.get(pl2[i]["id"]),
          pole: {
            id: pl2[i]["id"],
            name: (usrLang == "ja") ? pl2[i]["name"]["ja"] : pl2[i]["name"]["en"],
          },
        });

        if (bpm.get(pl2[i]["id"])) {
          m.set("isSvg2", 1);
        }

        prevMarkers.push(m);
      }
    }
  }

  // draw current location marker
  drawLocMarker(pos, map, prevLocMarker);

  // close button
  document.getElementById("btn-close").addEventListener("click", closeFooterMenu, false); // xxx

  // info as of
  let now = Date.now();
  document.getElementById("info-as-of").innerText = `${(usrLang == 'en-US' ? JAEN['en']['crrTime'] : '')}\
    ${new Date(now).getHours().toString().padStart(2, "0")}:${new Date(now).getMinutes().toString().padStart(2, "0")}\
    ${(usrLang == 'ja' ? JAEN['ja']['crrTime']: '')}`;
}

function initLocBtn(locationButton, map) {
  locationButton.textContent = `${(usrLang == 'ja' ? JAEN['ja']['findStation'] : JAEN['en']['findStation'])}`;
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

          // pos.lat = TOKYO_MARUNOUCHI['lat']; pos.lng = TOKYO_MARUNOUCHI['lng']; // temp
          // pos.lat = SHINJUKU['lat']; pos.lng = SHINJUKU['lng']; // temp
          // pos.lat = SHIBUYA['lat']; pos.lng = SHIBUYA['lng']; // temp
          
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
  const dark = [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ];
  const map = new google.maps.Map(document.getElementById("map"),{
    center: {lat: TOKYO_MARUNOUCHI['lat'], lng: TOKYO_MARUNOUCHI['lng']},
    zoom: 11,
    streetViewControl: false, // map control
    rotateControl: false,
    fullscreenControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,
    },
    disableDefaultUI: true,
    keyboardShortcuts: false,
    styles: (isDark() ? dark : []),
  });
  const locationButton = document.createElement("button");

  initLocBtn(locationButton, map);
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationButton);
}

function openSideNav(evt) {
  evt.preventDefault();
  document.getElementById("side-nav").style.width = "160px";
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

function initSideNav() {
  document.getElementById('support-bus-ope').innerText = (usrLang == 'ja' ? JAEN['ja']['supportBus'] : JAEN['en']['supportBus']);
  document.getElementById('support-bus-toei').innerText = (usrLang == 'ja' ? JAEN['ja']['supportBusItems'][0] : JAEN['en']['supportBusItems'][0]);
  if (isDark()) document.getElementById('open-side-nav').style.color = '#f8f9fa';
}

async function init() {
  await fetchBusData();
  await fetchCalendarData();
  initListener();
  initSideNav();
}

function main() {
  try {
    init();
  } catch (err) {
    // todo
  }
}

main();