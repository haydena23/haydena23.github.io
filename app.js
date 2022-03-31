var url = "https://api.spotify.com/v1/search?q={name}&type=artist";
var relatedArtist = "https://api.spotify.com/v1/artists/{id}/related-artists"
var client_id = '8d2bba2a92db40bd8b107fbe226957b9';
var client_secret = '53dcaf963d5348798fc5e3fce02117f6';
var redirect_uri = "https://haydena23.github.io";
var scopes = 'user-read-private user-read-email';
var token = 'BQA6i8CKmnfcyCizkGAxpT63_iEs-tSZHk3PMwX4DHy1sQYoziMUjDuCvmHDMBUNci5ir1jTuuHm1W9XQpM';

var nodes = [{
	name: '',
	id: '',
	followers: 0,
	genres: [''],
	imageHeight: 0,
	imageUrl: '',
	imageWidth: 0,
	popularity: 0,
	uri: ''
}];

var edges = [{
	name: '',
	source: '',
	target: ''
}];

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
	userZoomingEnabled: true,
	userPanningEnabled: true,
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
async function getNameFromId(id, callback) {
	var request = new XMLHttpRequest();
	var searchUrl = "https://api.spotify.com/v1/artists/{id}";
	searchUrl = searchUrl.replace("{id}", id);
	request.open("GET", searchUrl, true);
	request.setRequestHeader('Authorization', 'Bearer ' + token);
	request.setRequestHeader('Content-Type', 'application/json');
	request.onload = function() {
		var data = JSON.parse(request.responseText);
		console.log(data);
		callback(data);		
	}
	request.send(null);
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
		artistFollowersOne = data.followers.total;
		artistGenresOne = data.genres;
		artistImageHeightOne = data.images[1].height;
		artistImageUrlOne = data.images[1].url;
		artistImageWidthOne = data.images[1].width;
		artistPopularityOne = data.popularity;
		artistUriOne = data.uri;

		if(!nodes.includes({name: artistNameOne, id: artistIdOne})) {
			nodes.push({
				name: artistNameOne, 
				id: artistIdOne,
				followers: artistFollowersOne,
				genres: artistGenresOne,
				imageHeight: artistImageHeightOne,
				imageUrl: artistImageUrlOne,
				imageWidth: artistImageWidthOne,
				popularity: artistPopularityOne,
				uri: artistUriOne
			});
		}
		await getRelatedArtists(artistIdOne, async function(data) {
			artistdata = data;
			for(var i = 0; i < 20; i++) {
				if(!nodes.includes({name: data[i].name, id: data[i].id})) {
					nodes.push({
						name: data[i].name,
						id: data[i].id,
						followers: data[i].followers.total,
						genres: data[i].genres,
						imageHeight: data[i].images[1].height,
						imageUrl: data[i].images[1].url,
						imageWidth: data[i].images[1].width,
						popularity: data[i].popularity,
						uri: data[i].uri
					});
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

			for(var i = 0; i < nodes.length; i++) {
				cy.add([
					{group: "nodes", style: {
						height: nodes[i].popularity,
						width: nodes[i].popularity,
					}, data: {
						val: nodes[i].id,
						id: nodes[i].name,
						followers: nodes[i].followers,
						genres: nodes[i].genres,
						imgHeight: nodes[i].imageHeight,
						imgUrl: nodes[i].imageUrl,
						imgWidth: nodes[i].imageWidth,
						pop: nodes[i].popularity,
						uri: nodes[i].uri
					}},
				]);
				console.log("Adding node: " + nodes[i].name);
			};
			for(var i = 1; i < nodes.length; i++) {
				cy.add([
					{group: "edges", data: {id: nodes[0].name+nodes[i].name, source: nodes[0].name, target: nodes[i].name}}
				]);
			}
			cy.remove('node[id="a"]');
			cy.remove('node[id="b"]');
			cy.layout({
				name: 'circle',
		
				animate: true,
				animationDuration: 1000,
				fit: true,
			});
			console.log("AFTER");
		}, 10);
	}, 10);
});

cy.on('click', 'node', async function(evt){
	console.log( 'clicked ' + this.data('val'));
	console.log( 'clicked ' + this.data('id'));
	document.getElementById("artist").innerText = this.data('id');
	document.getElementById("artist").style.textDecoration = "underline";
	document.getElementById("foll").innerText = this.data('followers').toLocaleString("en-US");
	document.getElementById("genr").innerText = this.data('genres');
	document.getElementById("pop").innerText = this.data('pop');
	document.getElementById("uri").href = this.data('uri');

	document.getElementById("img").src = this.data('imgUrl');
	document.getElementById("img").width = 320;
	document.getElementById("img").height = 320;

	await getNameFromId(this.data('val'), async function(data) {
		artistNameRef = data.name;
		artistIdRef = data.id;

		await getRelatedArtists(artistIdRef, async function(data) {
			artistdata = data;
			for(var i = 0; i < 20; i++) {
				if(!(nodes.some(item => item.id === data[i].id))) {
					nodes.push({
						name: data[i].name,
						id: data[i].id,
						followers: data[i].followers.total,
						genres: data[i].genres,
						imageHeight: data[i].images[1].height,
						imageUrl: data[i].images[1].url,
						imageWidth: data[i].images[1].width,
						popularity: data[i].popularity,
						uri: data[i].uri
					});
					edges.push({
						name: artistNameRef + data[i].name,
						source: artistNameRef,
						target: data[i].name
					})
					cy.add([
						{group: "nodes", style: {
							height: nodes[nodes.length-1].popularity,
							width: nodes[nodes.length-1].popularity,
						}, data: {
							val: nodes[nodes.length-1].id,
							id: nodes[nodes.length-1].name,
							followers: nodes[nodes.length-1].followers,
							genres: nodes[nodes.length-1].genres,
							imgHeight: nodes[nodes.length-1].imageHeight,
							imgUrl: nodes[nodes.length-1].imageUrl,
							imgWidth: nodes[nodes.length-1].imageWidth,
							pop: nodes[nodes.length-1].popularity,
							uri: nodes[nodes.length-1].uri
						}},
					]);
					cy.add([
						{group: "edges", data: {id: artistNameRef+nodes[nodes.length-1].name, source: artistNameRef, target: nodes[nodes.length-1].name}}
					]);
					cy.layout({
						name: 'cose',
				
						animate: true,
						animationDuration: 1000,
						fit: true,
						nodeRepulsion: 5
					});
					console.log("Added node: " + data[i].name);
				}
			}
		}, 10);
	}, 10);
	console.log(nodes);
	console.log(edges);
});