let cy = cytoscape({
  container: document.getElementById("cy"),

  elements: {
    nodes: [
      {
        data: { 
          id: "a",
          name: "James Blake"
        },
      },
      {
        data: { 
          id: "b",
          name: "Bon Iver"
        },
      },
      {
        data: { 
          id: "c",
          name: "Bon Iver"
        },
      },
    ],
    edges: [
      {
        data: { id: "ab", source: "a", target: "b" },
        data: { id: "ac", source: "a", target: "c" },
        data: { id: "bc", source: "b", target: "c" },
      },
    ],
  },
  zoomingEnabled: false,
  userZoomingEnabled: false,
  panningEnabled: false,
  userPanningEnabled: false,
  boxSelectionEnabled: false,
  autoungrabify: false,
  autounselectify: false,
  touchTapThreshold: 8,
  desktopTapThreshold: 4,
  multiClickDebounceTime: 250,
  layout: {
    name: "concentric",
    //rows: 2,
  },

  // so we can see the ids
  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(name)'
      }
    },
    {
      selector: ':selected',
      style: {
        'width': 3,
        'background-color': '#f00',
        // 'target-arrow-color': '#ccc',
        // 'target-arrow-shape': 'triangle',
        // 'curve-style': 'bezier'
      }
    },
  ],
});

cy.on("tap", "node", (e) => {
  let node = e.cyTarget;
  // node.style('background-color', '#f00')
  let artisit = document.getElementById("artist");
  artisit.innerHTML = node.data("name");

});
