function decimalInputHandler(e) {
	// Check if the target id is 'flow_rate_user'
	const isFlowRateUser = e.target.id === "flow_rate_user";
	// Retrieve the measurement unit from the measurementUnit element if the target is 'flow_rate_user'
	const measurementUnit = isFlowRateUser ? document.getElementById("measurementUnit").getAttribute("value") : "";
	// Determine the number of decimal places based on the measurement unit or target id
	const decimalPlaces = isFlowRateUser && (measurementUnit === "m3m" || measurementUnit === "m3s") ? 3 : 1;

	e.target.value = e.target.value.replace(/[^0-9,.]/g, ""); // Allow only numbers, comma, and dot
	e.target.value = e.target.value.replace(/,/g, "."); // Convert comma to dot

	// Split the value by the dot to separate the integer part from the decimal part
	if (e.target.value.includes(".")) {
		var parts = e.target.value.split(".");
		// Reconstruct the value allowing only the specified number of decimal places
		e.target.value = parts[0] + "." + parts[1].slice(0, decimalPlaces);
	}
}

// Apply the handler to the input elements
["flow_rate_user", "lift_height_user", "pipe_length_user"].forEach(function (id) {
	document.getElementById(id).addEventListener("input", decimalInputHandler);
});

// Additional handler to ensure there is only one dot in the 'flow_rate_user' input
document.getElementById("flow_rate_user").addEventListener("input", function (e) {
	var value = e.target.value;
	var dotCount = (value.match(/\./g) || []).length;
	if (dotCount > 1) {
		e.target.value = value.slice(0, -1); // Remove the last character if more than one dot is present
	}
});
