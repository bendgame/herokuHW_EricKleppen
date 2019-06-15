

function buildMetadata(sample) {
  console.log("Build metadata"); 

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = `/metadata/${sample}`;
    
    d3.json(url).then(function(response) {
      console.log(response)
      sample_meta = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata

      sample_meta.html("")
    // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(response).forEach(([key, value]) => {
      sample_meta
      .append("p")
      .text(`${key}: ${value}`);
      });
    });
  }

  function buildCharts(sample) {
  console.log("Build new chart");
  
  var chart_url = `/samples/${sample}`;
  
  

//   // @TODO: Use `d3.json` to fetch the sample data for the plots

//     // @TODO: Build a Bubble Chart using the sample data
//     // @TODO: Build a Pie Chart
//     // HINT: You will need to use slice() to grab the top 10 sample_values,
//     // otu_ids, and labels (10 each).
  d3.json(chart_url).then(function(chart_data) {

    var bub_x = chart_data.otu_ids
    var bub_y = chart_data.sample_values
    var marker_size = chart_data.sample_values
    var marker_colors = chart_data.otu_ids
    var text_values = chart_data.otu_labels

    var trace_bubble = {
      x: bub_x,
      y: bub_y,
      mode: 'markers',
      marker: 
        {
          color: marker_colors,
          size: marker_size
        },
      text: text_values
    }; 

    var bub_data = [trace_bubble];
    var bub_layout = {
      xaxis: { title: "OTU ID"},
    };
  
    Plotly.newPlot('bubble', bub_data, bub_layout);

    var slices = chart_data.sample_values.slice(0,10);
    var labels = chart_data.otu_ids.slice(0,10);
    var hover = chart_data.otu_labels.slice(0,10);

    var trace_pie = {
      labels: labels,
      values: slices,
      hover: hover,
      type: 'pie'
    };

    var pie_data = [trace_pie];

    var pie_layout = {
      title: "Belly Button Chart",
    };

    Plotly.newPlot("pie", pie_data, pie_layout);

  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};


// Initialize the dashboard
init();
