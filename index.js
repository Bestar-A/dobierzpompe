// Selection of submersible pumps section

// Performance Selection
// Dropdown Open & Close
document.getElementById("measure-unit-dropdown-btn").addEventListener("click", () => {
	document.getElementById("dropdownMeasurement").classList.toggle("hidden");
});

// Change Measure Unit
const ids = ["dropm3h", "dropm3m", "dropm3s", "droplh", "droplm", "dropls"];

ids.forEach((id) => {
	document.getElementById(id).addEventListener("click", function () {
		document.getElementById("changeMeasurement").textContent = this.dataset.value;
		document.getElementById("dropdownMeasurement").classList.add("hidden");
	});
});

// Change Performance Value
document.getElementById("flow_rate_user").addEventListener("input", function (e) {
	var measurementUnit = document.getElementById("measurementUnit").getAttribute("value");
	var min;
	const measurementsMaxMap = {
		m3h: 445,
		m3m: 7.5,
		m3s: 0.125,
		lh: 445000,
		lm: 7500,
		ls: 125,
	};

	let max = measurementsMaxMap[measurementUnit];

	var value = parseFloat(e.target.value);

	if (value > max) {
		e.target.value = max;

		unitTextForToastBody = document.getElementById("measurementUnit").textContent;
		toastContent = `Maksymalna wydajność (Q - przepływ) pomp zatapialnych w ofercie to obecnie ${max} ${unitTextForToastBody}`;
		Toastify({
			text: toastContent,
			duration: 3000,
			newWindow: true,
			close: true,
			gravity: "top", // `top` or `bottom`
			position: "right", // `left`, `center` or `right`
			style: {
				maxWidth: "300px",
				background: "#F14343",
				backgroundFilter: "blur(15px)",
				borderRadius: "8px",
			},
			onClick: function () {}, // Callback after click
		}).showToast();
	}
	if (value < min) {
		e.target.value = min;
	}
});

document.getElementById("lift_height_user").addEventListener("input", function (e) {
	var max = parseFloat(e.target.max);
	var min = parseFloat(e.target.min);
	var value = parseFloat(e.target.value);

	if (value > max) {
		e.target.value = max;

		toastContent = "Maksymalna geometryczna wysokość podnoszenia pomp zatapialnych w ofercie to obecnie 58 metrów";
		Toastify({
			text: toastContent,
			duration: 3000,
			newWindow: true,
			close: true,
			gravity: "top", // `top` or `bottom`
			position: "right", // `left`, `center` or `right`
			style: {
				maxWidth: "300px",
				background: "#F14343",
				backgroundFilter: "blur(15px)",
				borderRadius: "8px",
			},
			onClick: function () {}, // Callback after click
		}).showToast();
	}
	if (value < min) {
		e.target.value = min;
	}
});

document.getElementById("submit1").addEventListener("click", function (e) {
	var valid = true;
	var inputs = document.getElementsByClassName("value-input");
	for (var i = 0; i < inputs.length; i++) {
		if (parseFloat(inputs[i].value) <= 0) {
			valid = false;
			break;
		}
	}
	if (!valid) {
		toastContent = "Wszystkie wartości muszą być większe od zera";
		Toastify({
			text: toastContent,
			duration: 3000,
			newWindow: true,
			close: true,
			gravity: "top", // `top` or `bottom`
			position: "right", // `left`, `center` or `right`
			style: {
				maxWidth: "300px",
				background: "#F14343",
				backgroundFilter: "blur(15px)",
				borderRadius: "8px",
			},
			onClick: function () {}, // Callback after click
		}).showToast();
	}
});

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
