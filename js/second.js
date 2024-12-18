let selectedRowId = null;

var minus = document.getElementById("minus");
var plus = document.getElementById("plus");
// Assuming minus and plus are defined elsewhere
minus.addEventListener("click", updateFlowVisualization);
plus.addEventListener("click", updateFlowVisualization);

document.getElementById("submit2").addEventListener("click", submitForm);

async function retrieveAndSendGraphParametersForPdf() {
	// Retrieve 'pump_id' from the 'pumpTable' element
	const pump_id = document.getElementById("pumpTable").getAttribute("pump_id");

	// Find the pump data in storedResponseData based on pump_id
	const pumpDataIndex = storedResponseData.findIndex((pump) => pump.pump_id == pump_id);
	console.log(pumpDataIndex);
	if (pumpDataIndex !== -1) {
		// Pump data found
		const pumpData = storedResponseData[pumpDataIndex];
		console.log(pumpData);
		// Extract hydraulic_graph_params and power_graph_params
		const hydraulic_graph_params = pumpData.hydraulic_graph_params;
		console.log(hydraulic_graph_params);
		const power_graph_params = pumpData.power_graph_params;

		// Log the retrieved parameters (optional)
		console.log("Hydraulic Graph Parameters:", hydraulic_graph_params);
		console.log("Power Graph Parameters:", power_graph_params);

		// Prepare the data to be sent as a POST request
		const postData = {
			hydraulic_graph_params: JSON.stringify(hydraulic_graph_params),
			power_graph_params: JSON.stringify(power_graph_params),
		};
		console.log(postData);

		try {
			const response = await fetch("/download_pdf/", {
				// Replace with your actual URL
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// Make sure to include CSRF token if needed
					"X-CSRFToken": getCookie("csrftoken"),
				},
				body: JSON.stringify(postData),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			// Handle the response from the server
			function downloadPdf() {
				const url = "/download_calculated_pdf/"; // Replace with the actual URL of your PDF
				const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
				if (isIOS) {
					window.location.href = url;
				} else {
					window.open(url, "_blank");
				}
			}
			downloadPdf();
		} catch (error) {
			console.error("Error during PDF generation request:", error);
		}
	} else {
		console.error("Pump data not found for the given pump_id.");
	}
}
