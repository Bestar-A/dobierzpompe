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
