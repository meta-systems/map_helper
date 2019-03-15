
function content_helper() {

    var lat = localStorage.getItem("centerLatitude");
    var lon = localStorage.getItem("centerLongitude");
	var zoom = localStorage.getItem("zoom");

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
