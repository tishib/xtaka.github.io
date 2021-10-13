'use strict';
/**
 * IMPROVE
 * - Rename for pl, bpm, lm easy to understand
 * - 
*/

// import test from "mod/mock.js"; // todo CORS


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
              ttm.set(buss[j]["routePattern"], []);
            }
          } else {
            // todo
          }
        }
      }
    }



    // put data to map
    ttm.set("odpt.BusroutePattern:Toei.Ki11Kou.72001.3", []); // [temp]
    let rr = [], i = 0;
    ttm.forEach(k => {
      console.log("run")
      rr[i] = new XMLHttpRequest();
      rr[i].open("GET", `https://api-tokyochallenge.odpt.org/api/v4/odpt:BusTimetable?odpt:operator=odpt.Operator:Toei&odpt:busroutePattern=${k}&acl:consumerKey=8a65991fa76f15df8f4410b4a823c5cee45a5faa64a291d5194d4891f629d793`, true);
      rr[i].addEventListener("load", e => {
        console.log(e)
        if (e.target.status == 200 && e.target.responseText) {
          const json = JSON.parse(e.target.responseText);
          cl.forEach(calendar => {
            json.forEach(timetable => {
              if (calendar == timetable["odpt:calendar"]){
                if (ttm.has(k)) { // xxx
                  let arr = ttm.get(k);
                  arr.push(timetable);
                  ttm.set(k, arr);
                } else {
                  ttm.set(k, [timetable]);
                  return;
                }
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



function drawPoles(pos, map) {
  const crrLat = Math.floor((pos.lat * 100)) / 100; // xxx
  const crrLng = Math.floor((pos.lng * 100)) / 100;
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lm = new Map(); // label map
  let ind = 0;
  
  for (let i = 0; i < pl.length; i++) {
    if (crrLat == Math.floor((pl[i]["lat"] * 100)) / 100) {
      if (crrLng == Math.floor((pl[i]["lng"] * 100)) / 100) {
        let m = new google.maps.Marker({
          clickable: true,
          cursor: (usrLang == "ja") ? pl[i]["name"]["ja"] : pl[i]["name"]["en"],
          label: labels[ind++ % labels.length],
          map: map,
          position: {lat: pl[i]["lat"], lng: pl[i]["lng"]},
          title: (usrLang == "ja") ? pl[i]["name"]["ja"] : pl[i]["name"]["en"],
          visible: true,
        });

        m.addListener("click", () => {
          const poleName = lm.get(m.getLabel())["pole"]["name"];
          const busDatas = lm.get(m.getLabel())["bus"];

          document.getElementById("pole").innerText = poleName;

          if (busDatas) {
            let parent = document.getElementById("bus");
            while (parent.firstChild) {
              parent.removeChild(parent.firstChild);
            }

            for (let i = 0; i < busDatas.length; i++) {
              let li = document.createElement("li");
              let p = document.createElement("p");
              
              li.setAttribute("class", "list-group-item");
              p.setAttribute("class", "h6 text-warp"); // todo
              p.innerText = busDatas[i]["nameJa"];

              li.appendChild(p);
              document.getElementById("bus").appendChild(li);
            }
          }
        });

        lm.set(m.getLabel(), {
          // bus: bpm.get(pl[i]["id"]) || null, // [todo] no data in out of service
          bus: bpm.get(pl[i]["id"]) || [{
            endPole: "odpt.BusstopPole:Toei.ShibuyaStation.636.8",
            fromPole: "odpt.BusstopPole:Toei.Toranomon.1036.2",
            fromPoleTime: "2021-09-15T09:00:25+09:00",
            id: "odpt.Bus:Toei.T01.8501.2.F557",
            nameJa: "都０１（Ｔ０１） 新橋駅前→渋谷駅前 虎ノ門",
            occupancyStatus: undefined,
            routePattern: "odpt.BusroutePattern:Toei.Ki11Kou.72001.3",
          },
          {
            endPole: "odpt.BusstopPole:Toei.ShibuyaStation.636.8",
            fromPole: "odpt.BusstopPole:Toei.Toranomon.1036.2",
            fromPoleTime: "2021-09-15T09:00:25+09:00",
            id: "odpt.Bus:Toei.T01.8501.2.F557",
            nameJa: "都０１（Ｔ０１） 新橋駅前→渋谷駅前 虎ノ門",
            occupancyStatus: undefined,
            routePattern: "odpt.BusroutePattern:Toei.Ki11Kou.72001.3",
          }], // [temp] test data
          pole: {
            id: pl[i]["id"],
            name: (usrLang == "ja") ? pl[i]["name"]["ja"] : pl[i]["name"]["en"],
          },
        });
      }
    }
  }
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
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
  });
  const locationButton = document.createElement("button");

  locationButton.textContent = "Current Location";
  locationButton.classList.add("custom-map-control-button");

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

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
          console.log(ttm)
          // TODO
          await drawPoles(pos, map);
        },
        () => {}
      );
    } else {
      // doesn't support Geolocation
    }
  });
}

async function init() {
  await getPoles();
  await getBuss();
  await getCalendars();
  // await getTimeTable();
}

function main() {
  try {
    init();
  } catch (err) {
    // todo
  }
}
main();