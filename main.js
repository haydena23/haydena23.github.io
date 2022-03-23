var url = "https://api.spotify.com/v1/search?q={name}&type=artist";
var relatedArtist = "https://api.spotify.com/v1/artists/{id}/related-artists"

function getIdFromName(name, callback) {
	var request = new XMLHttpRequest();
	var searchUrl = "https://api.spotify.com/v1/search?q={name}&type=artist";
	searchUrl = searchUrl.replace("{name}", name);
	request.open("GET", searchUrl, true);
	request.send(null);
	request.onload = function() {
		var data = JSON.parse(request.responseText).artists.items[0].id;
		callback(data);
	}
}

function getRelatedArtists(baseArtistId, callback) {
	var request = new XMLHttpRequest();
	if (baseArtistId !== undefined) {
		var relatedArtistUrl = "https://api.spotify.com/v1/artists/{id}/related-artists"
		relatedArtistUrl = relatedArtistUrl.replace("{id}", baseArtistId);
		request.open("GET", relatedArtistUrl, true);
		request.send(null);
		request.onload = function () {
			var data = JSON.parse(request.responseText).artists;
			callback(data);
		}
	}
}

function getNameFromId(id, callback) {
	var request = new XMLHttpRequest();
	var searchUrl = "https://api.spotify.com/v1/artists/{id}";
	searchUrl = searchUrl.replace("{id}", id);
	request.open("GET", searchUrl, true);
	request.send(null);
	request.onload = function () {
		var data = JSON.parse(request.responseText).name;
		callback(data);
	}
}