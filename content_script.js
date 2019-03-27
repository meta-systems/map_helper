
function content_helper() {

    var lat, lon, zoom;

    var parseLink = function (linkParent) {
        var fChild = linkParent.firstElementChild;
        if(!fChild) {
            return;
        }
        var olLink = fChild.href;
        var q_str = olLink.split('?')[1];

        q_str.split('&').forEach(function (value) {
            var pair = value.split('=');
            if(pair[0] === 'zoom') {
                zoom = pair[1];
            }
            else if(pair[0] === 'lat') {
                lat = pair[1];
            }
            else if(pair[0] === 'lon') {
                lon = pair[1];
            }
        });
    };

    /*
     * Loadmap: getting coords from GoogleAPI logo
     */
    var gmEl = document.getElementsByClassName("gm-style");
    var waze = document.getElementsByClassName("wm-permalink-control");
    var openLayersEl = document.getElementsByClassName("olControlPermalink");
    var navitelPermalink = document.getElementById("permalink");

    if(gmEl.length) {
        var gmLink = gmEl[0].children[2].children[0];
        var gmUrl = gmLink.href;
        var q_str = gmUrl.split('?')[1];

        q_str.split('&').forEach(function (value) {
            var pair = value.split('=');
            if(pair[0] === 'z') {
                zoom = pair[1];
            }
            else if(pair[0] === 'll') {
                var gcoord = pair[1].split(',');
                lat = gcoord[0];
                lon = gcoord[1];
            }
        });
    }

    // Chepetsk OpenLayers permalink
    else if(openLayersEl.length) {
        parseLink(openLayersEl[0]);
    }

    // Navitel
    else if(navitelPermalink) {
        parseLink(navitelPermalink);
    }

    // waze
    else if(waze.length) {
        parseLink(waze[0]);
    }
    
    // Bing: getting coords from LocalStorage
    else {
        lat = localStorage.getItem("centerLatitude");
        lon = localStorage.getItem("centerLongitude");
        zoom = localStorage.getItem("zoom");
    }

    return {
        lat: lat,
        lon: lon,
        zoom: zoom
    };
}


chrome.runtime.sendMessage({
	action: "coords",
    coords: content_helper()
});


// добавляем перекрестие на openstreetmap.org
// setTimeout(function(){
    
//     var div=document.createElement("div"); 
//     div.classList.add('icross');
//     div.classList.add('icross_osm');
//     div.innerHTML += '<img src="chrome-extension://plagppklljkoeblkoknfpmljklplpdol/img/cross.svg" />'; 

//     // OSM
//     document.getElementById('content').appendChild(div); 
//     // div.innerText="test123";

// }, 1000);
