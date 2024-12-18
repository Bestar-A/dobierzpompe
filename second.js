var inputField = document.getElementById("flow_rate_user");
var dropdownItems = document.querySelectorAll(".dropdown-menu .dropdown-item");
var measurementUnitDisplay = document.getElementById("measurementUnit");

const flow_rate_user_input = document.getElementById("flow_rate_user");
const diameterSelect = document.getElementById("pipe_diameter_user");

var unitAbbreviations = {
	"metry sześcienne na godzinę": "m³/h",
	"metry sześcienne na minutę": "m³/m",
	"metry sześcienne na sekundę": "m³/s",
	"litry na godzinę": "l/h",
	"litry na minutę": "l/m",
	"litry na sekundę": "l/s",
};

var unitAbbreviationsNotations = {
	"metry sześcienne na godzinę": "m3h",
	"metry sześcienne na minutę": "m3m",
	"metry sześcienne na sekundę": "m3s",
	"litry na godzinę": "lh",
	"litry na minutę": "lm",
	"litry na sekundę": "ls",
};

var currentUnitFullName = "metry sześcienne na godzinę";
document.addEventListener("DOMContentLoaded", function () {
	dropdownItems.forEach(function (item) {
		item.addEventListener("click", function (event) {
			event.preventDefault();
			var currentValue = parseFloat(inputField.value);
			var selectedUnit = item.textContent.trim();
			var currentUnit = measurementUnitDisplay.textContent.trim();

			// Find the full name of the current unit based on its abbreviation
			currentUnitFullName = Object.keys(unitAbbreviations).find((key) => unitAbbreviations[key] === currentUnit);
			flow_rate_user = toBaseUnit(flow_rate_user, currentUnitFullName);

			var valueInBaseUnit = toBaseUnit(currentValue, currentUnitFullName);
			var convertedValue = fromBaseUnit(valueInBaseUnit, selectedUnit);

			inputField.value = parseFloat(convertedValue).toFixed(3);

			// Update the display with the abbreviation of the selected unit
			measurementUnitDisplay.textContent = unitAbbreviations[selectedUnit];
			measurementUnitDisplay.setAttribute("value", unitAbbreviationsNotations[selectedUnit]);
		});
	});
});

function toBaseUnit(value, unit) {
	const toBase = {
		"metry sześcienne na minutę": value * 60,
		"metry sześcienne na sekundę": value * 3600,
		"litry na godzinę": value / 1000,
		"litry na minutę": (value / 1000) * 60,
		"litry na sekundę": (value / 1000) * 3600,
		"metry sześcienne na godzinę": value,
	};
	return Math.round((toBase[unit] || value) * 10) / 10;
}

function fromBaseUnit(value, unit) {
	const fromBase = {
		"metry sześcienne na minutę": value / 60,
		"metry sześcienne na sekundę": value / 3600,
		"litry na godzinę": value * 1000,
		"litry na minutę": (value * 1000) / 60,
		"litry na sekundę": (value * 1000) / 3600,
		"metry sześcienne na godzinę": value,
	};
	return fromBase[unit] || value;
}

function updateFlowVisualization() {
	const flowRate = parseFloat(flow_rate_user_input.value);
	const currentUnitNotation = measurementUnitDisplay.getAttribute("value");
	const currentUnitFullName = Object.keys(unitAbbreviationsNotations).find((key) => unitAbbreviationsNotations[key] === currentUnitNotation);
	const flowRateInM3h = toBaseUnit(flowRate, currentUnitFullName);
	const diameter = parseFloat(diameterSelect.value);
	const velocity = calculateVelocity(flowRateInM3h, diameter);
	const indicator = document.getElementById("flowIndicator");
	const comment = document.getElementById("flowComment");

	let indicatorPosition = (velocity / 3.5) * 100;
	indicatorPosition = Math.min(indicatorPosition, 97);

	indicator.style.left = `${indicatorPosition}%`;

	let color, commentText;
	if (velocity < 0.8) {
		color = "#aa0000";
		commentText = velocity.toFixed(1) + " m/s - Przepływ niedopuszczalny, zbyt wolny.";

		comment.style.fontWeight = "bold";
		comment.style.fontStyle = "normal";
		comment.style.color = "red";
	} else if (velocity >= 0.8 && velocity < 1.0) {
		color = "#ddaa00";
		commentText = velocity.toFixed(1) + " m/s - Przepływ dopuszczalny, ale nieoptymalny.";

		comment.style.fontWeight = "normal";
		comment.style.fontStyle = "italic";
		comment.style.color = "black";
	} else if (velocity >= 1.0 && velocity <= 2.5) {
		color = "green";
		commentText = velocity.toFixed(1) + " m/s - Przepływ optymalny.";

		comment.style.fontWeight = "normal";
		comment.style.fontStyle = "normal";
		comment.style.color = "black";
	} else if (velocity > 2.5 && velocity <= 3.0) {
		color = "orange";
		commentText = velocity.toFixed(1) + " m/s - Przepływ graniczny.";

		comment.style.fontWeight = "normal";
		comment.style.fontStyle = "italic";
		comment.style.color = "orange";
	} else {
		color = "red";
		commentText = velocity.toFixed(1) + " m/s - Przepływ zbyt szybki i niedopuszczalny.";

		comment.style.fontWeight = "normal";
		comment.style.fontWeight = "bold";
		comment.style.color = "red";
	}

	// indicator.style.backgroundColor = color;
	comment.textContent = commentText;
}

function calculateVelocity(flowRate, diameter) {
	const radius = diameter / 2 / 1000; // convert diameter from mm to m and then get the radius
	const pipeArea = Math.PI * radius * radius; // in square meters
	const flowRateInM3PerSec = flowRate / 3600; // convert flow rate from m3/h to m3/s
	return flowRateInM3PerSec / pipeArea; // velocity in m/s
}

document.addEventListener("DOMContentLoaded", function () {
	function getStepBasedOnUnit(measurementUnit) {
		switch (measurementUnit) {
			case "m3h":
				return 1;
			case "m3m":
				return 0.1;
			case "m3s":
				return 0.001;
			case "lh":
				return 100;
			case "lm":
				return 10;
			case "ls":
				return 0.5;
			default:
				return 1; // Default step if unit is not recognized
		}
	}

	function increaseValue(inputField) {
		const measurementUnitDisplay = document.getElementById("measurementUnit");
		const measurementUnit = measurementUnitDisplay.getAttribute("value");
		var step = getStepBasedOnUnit(measurementUnit);
		var currentValue = parseFloat(inputField.value);
		if (inputField.id === "flow_rate_user") {
			inputField.value = (currentValue + step).toFixed(3);
		} else {
			// For lift_height_user and pipe_length_user, increment without decimals
			inputField.value = Math.round(currentValue + 1);
		}
		updateFlowVisualization();
		inputField.dispatchEvent(new Event("input")); // Manually trigger the input event
	}

	function decreaseValue(inputField) {
		const measurementUnitDisplay = document.getElementById("measurementUnit");
		const measurementUnit = measurementUnitDisplay.getAttribute("value");
		var step = getStepBasedOnUnit(measurementUnit);
		var currentValue = parseFloat(inputField.value);
		if (inputField.id === "flow_rate_user" && currentValue > step) {
			inputField.value = (currentValue - step).toFixed(3);
		} else if (currentValue > 1) {
			// Assuming you want to prevent going below 1
			// For lift_height_user and pipe_length_user, decrement without decimals
			inputField.value = Math.round(currentValue - 1);
		}
		updateFlowVisualization();
		inputField.dispatchEvent(new Event("input")); // Manually trigger the input event
	}

	var inputGroups = document.querySelectorAll(".input-group");
	inputGroups.forEach(function (group) {
		var minusButton = group.querySelector(".minus-class");
		var plusButton = group.querySelector(".plus-class");
		var valueInput = group.querySelector(".value-input");
		let timerId; // Identyfikator timera

		function startIncreasing() {
			increaseValue(valueInput);
			clearInterval(timerId); // Upewnij się, że nie ma już działającego timera
			timerId = setInterval(() => increaseValue(valueInput), 100);
		}

		function startDecreasing() {
			decreaseValue(valueInput);
			clearInterval(timerId); // Upewnij się, że nie ma już działającego timera
			timerId = setInterval(() => decreaseValue(valueInput), 100);
		}

		function stopUpdating() {
			clearInterval(timerId); // Zatrzymuje działający timer
		}

		if (plusButton) {
			plusButton.addEventListener("mousedown", startIncreasing);
			plusButton.addEventListener("mouseup", stopUpdating);
			plusButton.addEventListener("mouseleave", stopUpdating);
			plusButton.addEventListener("touchstart", startIncreasing);
			plusButton.addEventListener("touchend", stopUpdating);
			plusButton.addEventListener("touchcancel", stopUpdating);
		}

		if (minusButton) {
			minusButton.addEventListener("mousedown", startDecreasing);
			minusButton.addEventListener("mouseup", stopUpdating);
			minusButton.addEventListener("mouseleave", stopUpdating);
			minusButton.addEventListener("touchstart", startDecreasing);
			minusButton.addEventListener("touchend", stopUpdating);
			minusButton.addEventListener("touchcancel", stopUpdating);
		}
	});
});

updateFlowVisualization();
