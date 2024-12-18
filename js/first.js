function decimalInputHandler(e) {
	const isFlowRateUser = e.target.id === "flow_rate_user";
	const measurementUnit = isFlowRateUser ? document.getElementById("measurementUnit").getAttribute("value") : "";
	const decimalPlaces = isFlowRateUser && (measurementUnit === "m3m" || measurementUnit === "m3s") ? 3 : 1;

	e.target.value = e.target.value.replace(/[^0-9,.]/g, "");
	e.target.value = e.target.value.replace(/,/g, ".");

	if (e.target.value.includes(".")) {
		var parts = e.target.value.split(".");
		e.target.value = parts[0] + "." + parts[1].slice(0, decimalPlaces);
	}
}

["flow_rate_user", "lift_height_user", "pipe_length_user"].forEach(function (id) {
	document.getElementById(id).addEventListener("input", decimalInputHandler);
});

document.getElementById("flow_rate_user").addEventListener("input", function (e) {
	var value = e.target.value;
	var dotCount = (value.match(/\./g) || []).length;
	if (dotCount > 1) {
		e.target.value = value.slice(0, -1);
	}
});
