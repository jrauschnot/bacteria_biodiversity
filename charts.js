function init() {
	// Grab a reference to the dropdown select element
	var selector = d3.select("#selDataset");

	// Use the list of sample names to populate the select options
	d3.json("samples.json").then((data) => {
		console.log(data);
		var sampleNames = data.names;

		sampleNames.forEach((sample) => {
			selector
				.append("option")
				.text(sample)
				.property("value", sample);
		});

		// Use the first sample from the list to build the initial plots
		var firstSample = sampleNames[0];
		buildCharts(firstSample);
		buildMetadata(firstSample);
	});
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
	//console.log(newSample);
	// Fetch new data each time a new sample is selected
	buildMetadata(newSample);
	buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
	d3.json("samples.json").then((data) => {
		var metadata = data.metadata;
		//console.log(metadata);
		// Filter the data for the object with the desired sample number
		var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
		var result = resultArray[0];
		// Use d3 to select the panel with id of `#sample-metadata`
		var PANEL = d3.select("#sample-metadata");

		// Use `.html("") to clear any existing metadata
		PANEL.html("");

		// Use `Object.entries` to add each key and value pair to the panel
		// Hint: Inside the loop, you will need to use d3 to append new
		// tags for each key-value in the metadata.
		Object.entries(result).forEach(([key, value]) => {
			PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
		});

	});
}

function buildCharts() {

}

// 1. Create the buildCharts function.
function buildCharts(sample) {
	// 2. Use d3.json to load and retrieve the samples.json file 
	d3.json("samples.json").then((data) => {
		console.log(data);
		// 3. Create a variable that holds the samples array.
		var sampledata = data.samples;
		console.log(sampledata);

		// 4. Create a variable that filters the samples for the object with the desired sample number.
		var sampleArray = sampledata.filter(sampleObj => sampleObj.id == sample);
		console.log(sampleArray);

		//  5. Create a variable that holds the first sample in the array.
		var firstSample = sampleArray[0];
		console.log(firstSample);

		// 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

		var values = firstSample.sample_values;
		console.log(values);
		var sortedValues = values.sort((a,b) => a-b);
		console.log(sortedValues.reverse());

		var topTENVALUES = sortedValues.slice(0,10);
		console.log(topTENVALUES);

		//

		var otuID = firstSample.otu_ids.slice(0,10);
		console.log(otuID);

		var labels = firstSample.otu_labels.slice(0,10);
		console.log(labels);

		//

		var metadata = data.metadata;
		var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
		var result = resultArray[0];
		console.log(result);

		var wfreq = result.wfreq;
		console.log(wfreq);

		// 7. Create the yticks for the bar chart.
		// Hint: Get the the top 10 otu_ids and map them in descending order  
		//  so the otu_ids with the most bacteria are last. 

		//Need to use parseFloat() here

		var yticks = console.log(otuID.reverse());

		// 8. Create the trace for the bar chart. 
		var trace = {
			x: topTENVALUES.reverse(),
			y: otuID.map(x => "OTU " + x),
			text: otuID.map(x => "OTU " + x),
			name: otuID,
			type: "bar",
			orientation: "h"
		};

		var barData = [trace];

		// 9. Create the layout for the bar chart. 
		var barLayout = {
			title: "Top 10 Bacteria Cultures Found",
		};

		// 10. Use Plotly to plot the data with the layout. 
		Plotly.newPlot("bar", barData, barLayout);

		// 1. Create the trace for the bubble chart.
		var trace1 = {
			x: otuID.reverse(),
			y: values,
			text: labels,
			mode: 'markers',
			marker: {
				size: values,
				color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)', 'rgb(93, 164, 214)', 'rgb(255, 144, 14)'],
				sizemode: 'area',
				sizeref: 0.05,
			  }
		};

		var bubbleData = [trace1];

		// 2. Create the layout for the bubble chart.
		var bubbleLayout = {
			title: "Bacteria Cultures per Sample",
			xaxis: { title: "OTU ID" }

		};

		// 3. Use Plotly to plot the data with the layout.
		Plotly.newPlot("bubble", bubbleData, bubbleLayout);

		// 4. Create the trace for the gauge chart.
		var trace2 = {
			value: wfreq,
			title: {text: "Belly Button Washing Frequency <br> Scrubs per week"},
			type: "indicator",
			mode: "gauge+number",
			gauge: {
				axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
				bar: { color: "darkblue" },
				bgcolor: "white",
				borderwidth: 2,
				bordercolor: "gray",
				steps: [
					{ range: [0, 2], color: "cyan" },
					{ range: [2, 4], color: "royalblue" },
					{ range: [4, 6], color: "lime" },
					{ range: [6, 8], color: "red" },
					{ range: [8, 10], color: "black" }
				  ]

		}
	};

		var gaugeData = [trace2];

		// 5. Create the layout for the gauge chart.
		var gaugeLayout = {
			width: 500,
			height: 400,
			margin: { t: 25, r: 25, l: 25, b: 25 },
			font: { color: "darkblue", family: "Arial" }
		  };

		// 6. Use Plotly to plot the gauge data and layout.
		Plotly.newPlot("gauge", gaugeData, gaugeLayout);
	});
}
