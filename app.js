/**
 * Musical Nodes
 * 
 * A website to search for your favorite Spotify artist, and display artists related to that.
 * Click on a node to see relavant information for that artist, as well as display related artists
 * the newly selected artist.
 * 
 * @author Tony Hayden
 * @author Kai Vickers
 * @author Connor Morgan
 * @author Geryl Vinoya
 * 
 * This project was made for CS445: Computer Networks during the Spring 2022 semester at the University of Portland
 */

// Node structure
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

// Edge structure
var edges = [{
	name: '',
	source: '',
	target: ''
}];

//Currently selected node
var currentNode;

// Initialize the cytoscape graph with initial data
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

	// User interaction settings for the graph
	userZoomingEnabled: true,
	userPanningEnabled: true,
	boxSelectionEnabled: false,
	autounselectify: true,
	wheelSensitivity: .5,
	layout: {
	  name: 'grid',
	  rows: 1
	},
  
	// Allows selection of the nodes when searching by element
	style: [
	  {
		selector: 'node',
		style: {
		  'label': 'data(id)',
		  'background-color': 'black'
		}
	  },
	  {
		selector: 'edge',
		style: {
			'line-color': 'grey'
		}
	  }
	]
  });

// Authentication token 
var token = 'BQA6i8CKmnfcyCizkGAxpT63_iEs-tSZHk3PMwX4DHy1sQYoziMUjDuCvmHDMBUNci5ir1jTuuHm1W9XQpM';
/**
 * Updates the current authentication token for Spotify API
 */
function updateToken() {
	var request = new XMLHttpRequest();
	request.open('POST', 'https://accounts.spotify.com/api/token', true);
	request.setRequestHeader('Authorization', 'Basic OGQyYmJhMmE5MmRiNDBiZDhiMTA3ZmJlMjI2OTU3Yjk6NTNkY2FmOTYzZDUzNDg3OThmYzVlM2ZjZTAyMTE3ZjY=');
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var t;
	request.onload = function() {
		//console.log(this.responseText);
		token = JSON.parse(request.responseText).access_token;
		//console.log(token);
	}
	request.send("grant_type=client_credentials");
}

/**
 * Sends a GET request using a given artist name and returns the Spotify API ID 
 * of that artist
 * 
 * @param {string} name 
 * @param {*} callback 
 */
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

/**
 * Sends a GET request using a given artist ID and returns 20 related artists
 * 
 * @param {string} baseArtistId 
 * @param {*} callback 
 */
async function getRelatedArtists(baseArtistId, callback) {
	var request = new XMLHttpRequest();
	//console.log("Trying to get related artists");
	if (baseArtistId !== undefined) {
		//console.log('Success: Now getting related artists');
		var relatedArtistUrl = "https://api.spotify.com/v1/artists/{id}/related-artists"
		relatedArtistUrl = relatedArtistUrl.replace("{id}", baseArtistId);
		request.open("GET", relatedArtistUrl, true);
		request.setRequestHeader('Authorization', 'Bearer ' + token);
		request.setRequestHeader('Content-Type', 'application/json');
			
		request.onload = function () {
			var data = JSON.parse(request.responseText).artists;
			console.log(data);
			callback(data);
		}
		request.send(null);
	}
}

/**
 * Sends a GET request using a given artist ID and returns the artists name
 * 
 * @param {string} id 
 * @param {*} callback 
 */
async function getNameFromId(id, callback) {
	var request = new XMLHttpRequest();
	var searchUrl = "https://api.spotify.com/v1/artists/{id}";
	searchUrl = searchUrl.replace("{id}", id);
	request.open("GET", searchUrl, true);
	request.setRequestHeader('Authorization', 'Bearer ' + token);
	request.setRequestHeader('Content-Type', 'application/json');
	request.onload = function() {
		var data = JSON.parse(request.responseText);
		//console.log(data);
		callback(data);		
	}
	request.send(null);
}

// Call updateToken() to set a new, valid token for the session. Valid for 1 hour
updateToken();

/**
 * Handles the search button being clicked
 */
document.getElementById("searchButton").addEventListener("click", async function(){
	//console.log("Search button pressed");

	// Remove the search button for further searches
	document.getElementById("searchButton").remove();

	var name = document.getElementById("searchField").value;
	console.log("Initial artist: " + name);

	/** FIRST PASSTHROUGH SETTING INITIAL NODE/RELATED ARTISTS **/
	// Get the ID of the searched artist name
	await getIdFromName(name, async function(data) {

		// Set all variables of the original searched artist
		artistIdOne = data.id;
		artistNameOne = data.name;
		artistFollowersOne = data.followers.total;
		artistGenresOne = data.genres;
		artistImageHeightOne = data.images[1].height;
		artistImageUrlOne = data.images[1].url;
		artistImageWidthOne = data.images[1].width;
		artistPopularityOne = data.popularity;
		artistUriOne = data.uri;

		// Set initial artist data
		document.getElementById("artist").innerText = artistNameOne;
		document.getElementById("artist").style.textDecoration = "underline";
		document.getElementById("foll").innerText = artistFollowersOne.toLocaleString("en-US");
		document.getElementById("genr").innerText = artistGenresOne;
		document.getElementById("pop").innerText = artistPopularityOne;
		document.getElementById("uri").href = artistUriOne;
	
		// Set initial artist image
		document.getElementById("img").src = artistImageUrlOne;
		document.getElementById("img").width = 320;
		document.getElementById("img").height = 320;

		// Create initial artist node
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

		// Retrieve related artists to the original search artist
		await getRelatedArtists(artistIdOne, async function(data) {
			// Store the 20 artist objects in artistdata
			artistdata = data;
			if(data.length == 0) {
				if(confirm("Unable to pull all data from artist. This is often due to the artist being too small, or they don't have any related artists.")) {
					location.reload();
				} else {
					//...
				}
			}
			// Iterate and add nodes 20 times for all related artists
			// Also add an edge between original artist and related artist
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
			// Remove the initial artist node
			// This prevents repeats/looped edges back to the original artist
			nodes.shift();
			edges.shift();

			// Add all stored nodes to the Cytoscape graph
			// Create cytoscape nodes using stored node data
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
				console.log("Added node: " + nodes[i].name);
			};

			// Add all stored edges to the Cytoscape graph
			// Create cytoscape edges using stored edge data
			for(var i = 1; i < nodes.length; i++) {
				cy.add([
					{group: "edges", data: {id: nodes[0].name+nodes[i].name, source: nodes[0].name, target: nodes[i].name}}
				]);
			}

			// Remove the original 'a' and 'b' nodes
			cy.remove('node[id="a"]');
			cy.remove('node[id="b"]');

			// Display all created cyto nodes in a circle, animate their movement and fit it in the viewbox
			cy.layout({
				name: 'circle',
		
				animate: true,
				animationDuration: 1000,
				fit: true,
			});

			// console.log("Nodes after initial passthrough");
			// console.log(nodes);
		}, 10);
	}, 10);
});

// Zoom cytoscape onto the selected node
document.getElementById("locate").addEventListener("click", function(){
	console.log("Zoomed to current node: " + currentNode.id());
	//console.log(currentNode);
	cy.zoom({
		level: 3,
		position: currentNode.position()
	})
});

// Refresh the page to reset everything
document.getElementById("reset").addEventListener("click", function(){
	location.reload();
});

var currentlyRemoved = false;

/**
 * Handles right clicking a node on the cytoscape graph.
 * 
 * It pulls all of the nodes data and sets the description text on the right side
 * It also fetches all related artists for that node. If any newly related artists are already displayed,
 * it gets rid of that artist and goes to the next. Only adds newly seen artists.
 * 
 * NOTE: It can connect all related artists, however this gets messy. See comment block below
 */
cy.on('cxttap', 'node', async function(evt){
	if(!currentlyRemoved) {		
		currentNode = this;
		// console.log( 'clicked ' + this.data('val'));
		console.log( 'Clicked on node: ' + this.data('id'));

		// Set all artist data on sidebar
		document.getElementById("artist").innerText = this.data('id');
		document.getElementById("artist").style.textDecoration = "underline";
		document.getElementById("foll").innerText = this.data('followers').toLocaleString("en-US");
		document.getElementById("genr").innerText = this.data('genres');
		document.getElementById("pop").innerText = this.data('pop');
		document.getElementById("uri").href = this.data('uri');

		// Set artist image
		document.getElementById("img").src = this.data('imgUrl');
		document.getElementById("img").width = 320;
		document.getElementById("img").height = 320;

		// Using selected node as initial node, retrieve related artist
		// Ensure there are no repeat artist nodes, then add them to the
		// node/edge list, then create cytoscape node/edges
		await getNameFromId(this.data('val'), async function(data) {
			artistNameRef = data.name;
			artistIdRef = data.id;

			await getRelatedArtists(artistIdRef, async function(data) {
				artistdata = data;
				// Create nodes/edges, then cytoscape nodes/edges
				for(var i = 0; i < 20; i++) {

					if(!(nodes.some(item => item.id === artistdata[i].id))) {
						// If artist has no associated pictures
						if(artistdata[i].images == undefined || artistdata[i].images.length == 0) {
							nodes.push({
								name: artistdata[i].name,
								id: artistdata[i].id,
								followers: artistdata[i].followers.total,
								genres: artistdata[i].genres,
								imageHeight: 320,
								imageUrl: "https://www.carnival.com/_ui/responsive/ccl/assets/images/notfound_placeholder.svg",
								imageWidth: 320,
								popularity: artistdata[i].popularity,
								uri: artistdata[i].uri
							});
						} 
						// If artist has associated pictures
						else {
							nodes.push({
								name: artistdata[i].name,
								id: artistdata[i].id,
								followers: artistdata[i].followers.total,
								genres: artistdata[i].genres,
								imageHeight: artistdata[i].images[0].height,
								imageUrl: artistdata[i].images[0].url,
								imageWidth: artistdata[i].images[0].width,
								popularity: artistdata[i].popularity,
								uri: artistdata[i].uri
							});
						}
						edges.push({
							name: artistNameRef + artistdata[i].name,
							source: artistNameRef,
							target: artistdata[i].name
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
						console.log("Added node: " + data[i].name);
					}
					/**
					* UNCOMMENT BELOW TO CONNECT ALL RELATED NODES
					* This loop takes all of the selected nodes related artists, an searches through entire node list for matching relations
					* If found, it adds an edge between the two. Makes graph very hard to read, very fast
					*/
					for(var h = 0; h < nodes.length; h++) {
						if(nodes[h].name === data[i].name) {
							cy.add([
								{group: "edges", data: {id: artistNameRef+nodes[h].name, source: artistNameRef, target: nodes[h].name}}
							]);
						}
					}
				}
				// Refresh graph with 'cose' layout
				cy.layout({
					name: 'cose',
			
					animate: false,
					animationDuration: 500,
					fit: true,
					nodeRepulsion: 5
				});

			}, 10);
		}, 10);
		// Checks to see newly updated nodes and edges
		console.log(nodes);
		console.log(edges);
	}
});

// Handles left click to update artist data. 
cy.on('click', 'node', async function(evt){
	currentNode = this;
	// console.log( 'clicked ' + this.data('val'));
	console.log( 'Clicked on node: ' + this.data('id'));

	// Set all artist data on sidebar
	document.getElementById("artist").innerText = this.data('id');
	document.getElementById("artist").style.textDecoration = "underline";
	document.getElementById("foll").innerText = this.data('followers').toLocaleString("en-US");
	document.getElementById("genr").innerText = this.data('genres');
	document.getElementById("pop").innerText = this.data('pop');
	document.getElementById("uri").href = this.data('uri');

	// Set artist image
	document.getElementById("img").src = this.data('imgUrl');
	document.getElementById("img").width = 320;
	document.getElementById("img").height = 320;
});

var cytoNodes;
var cytoEdges;

/**
 * Function to isolate selected node and its related nodes. Restores them on second click
 */
document.getElementById("isolate").addEventListener("click", function(){
	if(!currentlyRemoved) {
		var initialNode = currentNode;
		var allConnections = initialNode.neighborhood();
		cytoNodes = cy.elements('node');
		cytoEdges = cy.elements('edge');
		cy.remove('node');
		cy.remove('edge');	
		initialNode.restore();
		allConnections.restore();
		currentlyRemoved = true;
		document.getElementById("isolate").innerText = "RESTORE GRAPH";
	} else {
		cy.remove('node');
		cy.remove('edge');
		cytoNodes.restore();
		cytoEdges.restore();
		currentlyRemoved = false;
		document.getElementById("isolate").innerText = "ISOLATE";
	}
});