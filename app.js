var url = "https://api.spotify.com/v1/search?q={name}&type=artist";
var relatedArtist = "https://api.spotify.com/v1/artists/{id}/related-artists"
var clientID = "8d2bba2a92db40bd8b107fbe226957b9";
var clientSecret = "53dcaf963d5348798fc5e3fce02117f6";
var redirect_uri = "https://haydena23.github.io";
var scopes = 'user-read-private user-read-email';

var artistName;
//document="index.html";


function getIdFromName(name, callback) {
	console.log("finding name");
	var request = new XMLHttpRequest();
	var searchUrl = "https://api.spotify.com/v1/search?q={name}&type=artist";
	searchUrl = searchUrl.replace("{name}", name);
	request.open("GET", searchUrl, true);
	request.send(null);
	request.onload = function() {
		var data = JSON.parse(request.responseText).artists.items[0].id;
		console.log(data);
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

document.getElementById("searchButton").addEventListener("click", function(){
	// artistName = document.getElementById("artistInput").value;

	// getIdFromName(artistName, function(data) {
		
	// }, 100);
	console.log("button pressed");
	var name = document.getElementById("searchField").value;
	console.log(name);
	//var data = getIdFromName(name, data);
});