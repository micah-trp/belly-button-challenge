// set constant of Data URL from Json Format
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and perform all the necessary operations
d3.json(url).then(function(data) {
  // Get the sample names for the dropdown menu
  const names = data.names;
  const dropdownMenu = d3.select("#selDataset");

  // Initialize the dashboard with the first sample
  initDashboard(data, names[0]);

  // Populate the dropdown menu with sample names
  names.forEach((id) => {
    dropdownMenu.append("option").text(id).property("value", id);
  });

  // Event listener for dropdown change
  dropdownMenu.on("change", function() {
    const selectedSample = dropdownMenu.property("value");
    updateDashboard(data, selectedSample);
  });
});

// Initialise Dashboard to start dashboard at start up
function initDashboard(data, initialSample) {
  buildMetadata(data.metadata, initialSample);
  buildBarChart(data.samples, initialSample);
  buildBubbleChart(data.samples, initialSample);
}

// Update Dashboard to update the dashboard when the sample is changed.
function updateDashboard(data, selectedSample) {
  buildMetadata(data.metadata, selectedSample);
  buildBarChart(data.samples, selectedSample);
  buildBubbleChart(data.samples, selectedSample);
}

/// The following functions have been set up to make the code modular

// Step 1 : BuildMetaData -
function buildMetadata(metadata, sample) {
  const selectedData = metadata.find((item) => item.id === +sample);
  const sampleMetadata = d3.select("#sample-metadata");
  sampleMetadata.html("");
  Object.entries(selectedData).forEach(([key, value]) => {
    sampleMetadata.append("h5").html(`${key}: <b>${value}<b>`); // Use <b> tag to make the title bold;
  });
}

// Step 2 Build Bar Chart as its own function
function buildBarChart(samples, sample) {
    const selectedData = samples.find((item) => item.id === sample);
    const top10OtuIds = selectedData.otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();
    const top10SampleValues = selectedData.sample_values.slice(0, 10).reverse();
    const top10OtuLabels = selectedData.otu_labels.slice(0, 10).reverse();

    // Define the custom color scale from dark blue to light blue
    const minColor = '#00008B'; // Dark blue
    const maxColor = '#808080'; // Grey

    // Calculate the color for each bar based on the range of values
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
                          .domain([Math.min(...top10SampleValues), Math.max(...top10SampleValues)]);

    const trace = {
      x: top10SampleValues,
      y: top10OtuIds,
      text: top10OtuLabels,
      type: "bar",
      orientation: "h",
      marker: {
        color: top10SampleValues.map(value => colorScale(value))
      }
    };

    const layout = {
      title: {
        text: "<b>Top 10 OTUs Present</b>", // Use <b> tag to make the title bold
      }
    };

    Plotly.newPlot("bar", [trace], layout);
}
  
  // Step 3 Build Bar Chart as its own function
  function buildBubbleChart(samples, sample) {
    const selectedData = samples.find((item) => item.id === sample);
    const trace1 = {
      x: selectedData.otu_ids,
      y: selectedData.sample_values,
      text: selectedData.otu_labels,
      mode: "markers",
      marker: {
        size: selectedData.sample_values,
        color: selectedData.otu_ids,
        colorscale: "Earth"
      }
    };
  
    const layout = {
      title: {
        text: "<b>Bacteria Per Sample</b>", // Use <b> tag to make the title bold
      },
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };
  
    Plotly.newPlot("bubble", [trace1], layout);
  }
  

    // Step 4 Build buildGaugeChart
//   function buildGaugeChart(metadata, sample) {
