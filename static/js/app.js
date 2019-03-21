function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(results => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var mdPanel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    mdPanel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(results).forEach((key, value) => mdPanel.append("h6").text(`${key}: ${value}`));
  });
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(results => {
  // @TODO: Build a Bubble Chart using the sample data
  var trace1 = {
    x: results.otu_ids,
    y: results.sample_values,
    mode: 'markers',
    text: results.otu_labels,
    marker: {
      size: results.sample_values,
      color: results.otu_ids
    }
  };
  
  var data = [trace1];
  
  var layout = {
    showlegend: false,
  };
  
  Plotly.newPlot("bubble", data, layout);

  // @TODO: Build a Pie Chart
  console.log(results);
    var values = results.sample_values;
    var labels = results.otu_ids;
    var ids = results.otu_labels;
    console.log("values:", values);
    console.log("labels:", labels);
    console.log("ids:", ids);
 
  var pieData = [{
    values: values.slice(0,10),
    labels: labels.slice(0,10),
    hovertext: ids.slice(0,10),
    type: "pie"
  }];

    var layout = {
      showLegend: true
    };

    Plotly.newPlot("pie", pieData, layout);
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  });
}

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
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
