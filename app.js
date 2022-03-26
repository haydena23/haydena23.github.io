//import { post } from 'request';
//import {Buffer} from 'buffer';

var url = "https://api.spotify.com/v1/search?q={name}&type=artist";
var relatedArtist = "https://api.spotify.com/v1/artists/{id}/related-artists"
var client_id = '8d2bba2a92db40bd8b107fbe226957b9';
var client_secret = '53dcaf963d5348798fc5e3fce02117f6';
var redirect_uri = "https://haydena23.github.io";
var scopes = 'user-read-private user-read-email';

var artistName;
var getOptions;

//document="index.html";

function getIdFromName(name, callback) {
	var request = new XMLHttpRequest();
	var searchUrl = "https://api.spotify.com/v1/search?q={name}&type=artist";
	searchUrl = searchUrl.replace("{name}", name);
	request.open("GET", searchUrl, true);
	request.setRequestHeader('Authorization', 'BQCTcKprybmGi6AFBBrvGNG5zzWNaBt9zcjYV9fQnBeoO7Z5vQPcr54IbeZ2O9d9zIjUryvyU7taUMaog2_buA__VLcVjcEYRyuuV_KnYc1HOVsQgIi0YRIM9EQyFQrZfTlsE0Wb3zd2')
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

document.getElementById("searchButton").addEventListener("click", function(){

	console.log("button pressed");
	var artistIdOne;
	var name = document.getElementById("searchField").value;
	console.log(name);
	getIdFromName(name, function(data) {
		artistIdOne = data;
		}, 100);
	//var data = getIdFromName(name, data);
});