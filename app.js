var url = "https://api.spotify.com/v1/search?q={name}&type=artist";
var relatedArtist = "https://api.spotify.com/v1/artists/{id}/related-artists"
var client_id = '8d2bba2a92db40bd8b107fbe226957b9';
var client_secret = '53dcaf963d5348798fc5e3fce02117f6';
var redirect_uri = "https://haydena23.github.io";
var scopes = 'user-read-private user-read-email';
var token = 'BQA6i8CKmnfcyCizkGAxpT63_iEs-tSZHk3PMwX4DHy1sQYoziMUjDuCvmHDMBUNci5ir1jTuuHm1W9XQpM';

var artistName;

var artistListNames = [];
var artistListId = [];

var nodes = [{
	name: '',
	id: ''
}];

var edges = [{
	name: '',
	source: '',
	target: ''
}];

//var iterations = 0;;

//document="index.html";
var authOptions = {"form":{"grant_type":"client_credentials"}};

function updateToken() {

	var request = new XMLHttpRequest();
	request.open('POST', 'https://accounts.spotify.com/api/token', true);
	request.setRequestHeader('Authorization', 'Basic OGQyYmJhMmE5MmRiNDBiZDhiMTA3ZmJlMjI2OTU3Yjk6NTNkY2FmOTYzZDUzNDg3OThmYzVlM2ZjZTAyMTE3ZjY=');
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var t;
	request.onload = function() {
		console.log(this.responseText);
		token = JSON.parse(request.responseText).access_token;
		console.log(token);
	}
	request.send("grant_type=client_credentials");
}
function resolveAfter2Seconds(x) {
	return new Promise(resolve => {
	  setTimeout(() => {
		resolve(x);
	  }, 30000);
	});
  }

async function getIdFromName(name, callback) {
	updateToken();
	var request = new XMLHttpRequest();
	var searchUrl = "https://api.spotify.com/v1/search?q={name}&type=artist";
	searchUrl = searchUrl.replace("{name}", name);
	request.open("GET", searchUrl, true);
	request.setRequestHeader('Authorization', 'Bearer ' + token);
	request.setRequestHeader('Content-Type', 'application/json');
	request.onload = function() {
		var data = JSON.parse(request.responseText).artists.items[0];
		console.log(data);
		callback(data);		
	}
	request.send(null);
	
}

async function getRelatedArtists(baseArtistId, callback) {
	var request = new XMLHttpRequest();
	console.log("trying to get related artists");
	if (baseArtistId !== undefined) {
		console.log('getting related artists');
		var relatedArtistUrl = "https://api.spotify.com/v1/artists/{id}/related-artists"
		relatedArtistUrl = relatedArtistUrl.replace("{id}", baseArtistId);
		request.open("GET", relatedArtistUrl, true);
		request.setRequestHeader('Authorization', 'Bearer ' + token);
		request.setRequestHeader('Content-Type', 'application/json');
			
		request.onload = function () {
			var data = JSON.parse(request.responseText).artists;
			callback(data);
		}
		request.send(null);
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

updateToken();
document.getElementById("searchButton").addEventListener("click", async function(){
	console.log("button pressed");
	var artistIdOne;
	var name = document.getElementById("searchField").value;
	var artistdata;
	console.log(name);
	/** FIRST PASSTHROUGH **/
	await getIdFromName(name, async function(data) {
		artistIdOne = data.id;
		artistNameOne = data.name;

		if(!nodes.includes({name: artistNameOne, id: artistIdOne})) {
			nodes.push({name: artistNameOne, id: artistIdOne});
		}
		await getRelatedArtists(artistIdOne, function(data) {
			artistdata = data;
			for(var i = 0; i < 20; i++) {
				if(!nodes.includes({name: data[i].name, id: data[i].id})) {
					nodes.push({name: data[i].name, id: data[i].id});
					edges.push({
						name: artistNameOne + data[i].name,
						source: artistNameOne,
						target: data[i].name
					})
				}
			}
			nodes.shift();
			edges.shift();
			console.log(artistdata)
			console.log(nodes);
			console.log(edges);
		}, 10);
	}, 10);
});

function refreshDialer(){
	for(var i = 0; i < nodes.length; i++) {
		cy.add([
			{group: "nodes", data: {id: nodes[i].name}},
			{group: "edges", data: {id: nodes[0].name+nodes[i].name, source: nodes[0].name, target: nodes[i].name}}
		])
	};
	const elsRemoved = cy.elements().remove();
	elsRemoved.restore();
	console.log(cy);
 }

document.getElementById("reload").addEventListener("click", function() {
	refreshDialer();
	console.log("Refreshed");
});

let cy = cytoscape({
	container: document.getElementById('cy'),
  
	elements: {
	  nodes: [
		{
		  data: { id: 'a' }
		},
  
		{
		  data: { id: 'b' }
		}
	  ],
	  edges: [
		{
		  data: { id: 'ab', source: 'a', target: 'b' }
		}
	  ]
	},
	userZoomingEnabled: false,
	userPanningEnabled: false,
	boxSelectionEnabled: false,
	autounselectify: true,
	layout: {
	  name: 'grid',
	  rows: 1
	},
  
	// so we can see the ids
	style: [
	  {
		selector: 'node',
		style: {
		  'label': 'data(id)'
		}
	  }
	]
  });
  