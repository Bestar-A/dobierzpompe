// const serverDomain = "https://dobierzpompe-fserver.onrender.com/get_data/";
const serverDomain = "http://localhost:3000/get_data/";

let selectedRowId = null;

var inputField = document.getElementById("flow_rate_user");
var dropdownItems = document.querySelectorAll(".dropdown-menu .dropdown-item");
var measurementUnitDisplay = document.getElementById("measurementUnit");

const flow_rate_user_input = document.getElementById("flow_rate_user");
const diameterSelect = document.getElementById("pipe_diameter_user");

flow_rate_user_input.addEventListener("input", updateFlowVisualization);
diameterSelect.addEventListener("change", updateFlowVisualization);

let storedResponseData = null;

document.getElementById("submit1").addEventListener("click", submitForm);
document.getElementById("submit2").addEventListener("click", submitForm);

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

function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== "") {
		const cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === name + "=") {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function waitForDummyResponse() {
	return new Promise((resolve) => {
		setTimeout(resolve, 3000);
	});
}

async function submitForm() {
	const waiting = document.getElementById("waiting");
	waiting.style.display = "";
	waiting.style.zIndex = "20000";
	const measurementUnitDisplay = document.getElementById("measurementUnit");
	const measurementUnit = measurementUnitDisplay.getAttribute("value");

	const currentUnitFullName = Object.keys(unitAbbreviationsNotations).find((key) => unitAbbreviationsNotations[key] === measurementUnit);
	var flow_rate_user = parseFloat(document.getElementById("flow_rate_user").value.replace(/,/g, "."));
	flow_rate_user = toBaseUnit(flow_rate_user, currentUnitFullName);
	let lift_height_user_value = parseFloat(document.getElementById("lift_height_user").value.replace(/,/g, "."));
	let lift_height_user = isNaN(lift_height_user_value) ? 0 : lift_height_user_value.toFixed(0);

	let pipe_length_value = parseFloat(document.getElementById("pipe_length_user").value.replace(/,/g, "."));
	let pipe_length_user = isNaN(pipe_length_value) ? 0 : pipe_length_value.toFixed(0);

	const diameter = document.getElementById("pipe_diameter_user").value;
	const checkboxes = {
		S: document.getElementById("free").checked ? document.getElementById("free").value : null,
		W: document.getElementById("forced").checked ? document.getElementById("forced").value : null,
		Z: document.getElementById("closed").checked ? document.getElementById("closed").value : null,
		K: document.getElementById("canal").checked ? document.getElementById("canal").value : null,
		R: document.getElementById("shredder").checked ? document.getElementById("shredder").value : null,
		lowerfit: document.getElementById("lowerfit").checked ? document.getElementById("lowerfit").value : null,
	};
	let checkedKeys = [];
	for (let key in checkboxes) {
		if (checkboxes[key] !== null) {
			checkedKeys.push(`'${key}'`);
		}
	}

	let hydraulicTypesString = "(" + checkedKeys.join(",") + ")";
	const radioValue = document.querySelector('input[name="radioOption"]:checked') ? document.querySelector('input[name="radioOption"]:checked').value : null;

	if (parseFloat(document.getElementById("flow_rate_user").value) < 0.0009 || lift_height_user < 1 || pipe_length_user < 1) {
		alert("Wartości Q, H i L muszą być większe od 1");
		waiting.style.display = "none";

		return;
	}

	const data = {
		measurementUnit: "m3h",

		flow_rate_user,
		lift_height_user,
		pipe_length_user,
		diameter,
		hydraulic_types: hydraulicTypesString,
		lowerfit: document.getElementById("lowerfit").checked ? document.getElementById("lowerfit").value : null,
		radioValue,
	};

	/********************** Use Mockup Data in Development Phase for CORS error **********************/
	const cookieData = getCookie("csrftoken");
	const response = await fetch(serverDomain, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": cookieData,
		},
		body: JSON.stringify(data),
	});
	storedResponseData = await response.json();
	/***************************************************************************************************/

	/********************** Use Mockup Data in Development Phase for CORS error **********************
	await waitForDummyResponse();

	storedResponseData = response;

	***************************************************************************************************/

	waiting.style.display = "none";

	renderTable(storedResponseData);

	showCards();

	if (storedResponseData.length === 0) {
		plotHydraulicImg = document.getElementById("plotHydraulic");
		plotHydraulicImg.src = "/images/oops.png";
		plotPowerImg = document.getElementById("plotPower");
		plotPowerImg.src = "/images/pixel.png";
		rotorImg = document.getElementById("rotorImage");
		rotorImg.src = "/images/pixel.png";
		plotHydraulicImg.style.margin = "auto";
		plotPowerImg.style.margin = "auto";
		rotorImg.style.margin = "auto";
		innerHTML("pump_name", "");
		innerHTML("hydraulikah4", "BRAK WYNIKÓW");
		innerHTML("wyniki", "BRAK WYNIKÓW");
		innerHTML("flow_actual", "");
		innerHTML("flow_rate_user_td", "");
		innerHTML("lift_height_required", "");
		innerHTML("lift_height_actual", "");
		innerHTML("power_actual", "");
		innerHTML("rotorShortDescription", "");
		waiting.style.display = "none";
	}
}

function renderTable(data) {
	data.sort((a, b) => a.goodness_factor - b.goodness_factor);

	const tableContainer = document.getElementById("tableContainer");
	tableContainer.innerHTML = "";

	const table = document.createElement("table");
	table.id = "tableResults";
	table.className = "w-full mb-1";

	const thead = document.createElement("thead");
	const headerRow = document.createElement("tr");
	headerRow.className = "uppercase text-[12px] font-medium text-[#92929D] leading-[20px]";

	const headers = ["D", "Rotor", "Power", "Model"];
	headers.forEach((headerText, id) => {
		const th = document.createElement("th");
		th.className = `text-start pb-[14px] ${id === 0 && " ps-6"}`;
		th.textContent = headerText;
		headerRow.appendChild(th);
	});

	thead.appendChild(headerRow);
	table.appendChild(thead);

	const tbody = document.createElement("tbody");
	tbody.className = "text-[#494949] text-[12px] leading-[18px] lg:text-base lg:leading-[24px]";

	for (const item of data) {
		const roundedRelativeDiff = item.goodness_factor.toFixed(2);

		const rowId = `row_${item.pump_id}`;
		let rowClass = "hover:shadow-[0px_10px_30px_0px_#95959533] cursor-pointer duration-500 transition-all ease-linear";
		let badgeClass = "rounded-full text-white px-3 py-1 leading-[26px]";

		if (roundedRelativeDiff < 0.4) {
			badgeClass += " bg-[#F14343]";
		} else if (roundedRelativeDiff < 0.8) {
			badgeClass += " bg-[#3FB039]";
		} else if (roundedRelativeDiff < 1) {
			badgeClass += " bg-[#F3831B]";
		} else {
			badgeClass += " bg-[#F3691B]";
		}

		const row = document.createElement("tr");
		row.id = rowId;
		row.className = rowClass;
		row.addEventListener("click", () => {
			clearActiveRow();
			row.classList.add("shadow-[0px_10px_30px_0px_#95959533]");
			drawChart(item);
			updateData(item.hydraulic_plot, item.power_plot, item.hydraulic_name, item.pump_id, item.pump_id);
		});

		const firstCell = document.createElement("td");
		firstCell.className = "flex py-3 ps-[14px]";
		const badgeDiv = document.createElement("div");
		badgeDiv.className = badgeClass;
		badgeDiv.textContent = roundedRelativeDiff;
		firstCell.appendChild(badgeDiv);
		row.appendChild(firstCell);

		const cells = [item.hydraulic_name, `${item.power_nominal}kW`, item.pump_name];

		cells.forEach((cellText) => {
			const cell = document.createElement("td");
			cell.textContent = cellText;
			row.appendChild(cell);
		});

		tbody.appendChild(row);
	}

	table.appendChild(tbody);

	tableContainer.appendChild(table);

	var secondRow = table.rows[1];
	if (secondRow) {
		secondRow.click();
	}
	setTimeout(() => {
		tableContainer.scrollIntoView({ behavior: "smooth" });
	}, 100);
}

function clearActiveRow() {
	const resultTableRows = document.querySelectorAll("#tableResults tbody tr");
	resultTableRows.forEach((row) => {
		row.classList.remove("shadow-[0px_10px_30px_0px_#95959533]");
	});
}

function showCards() {
	document.getElementById("card3").style.display = "block";
	document.getElementById("card4").style.display = "block";
	document.getElementById("card5").style.display = "block";
	document.getElementById("card6").style.display = "block";
	document.getElementById("card7").style.display = "block";
	document.getElementById("tableContainer").scrollIntoView();
}

function replacePolishChars(input) {
	const polishChars = {
		ą: "a",
		ć: "c",
		ę: "e",
		ł: "l",
		ń: "n",
		ó: "o",
		ś: "s",
		ź: "z",
		ż: "z",
		Ą: "A",
		Ć: "C",
		Ę: "E",
		Ł: "L",
		Ń: "N",
		Ó: "O",
		Ś: "S",
		Ź: "Z",
		Ż: "Z",
	};
	return input.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (match) => polishChars[match]);
}

function applyPumpTypeDescription(hydraulic_name) {
	const descriptions = {
		Swobodny: "S - Swobodny przepływ, wirnik otwarty",
		Wymuszony: "W - Wymuszony przepływ, wirnik otwarty",
		Zamknięty: "Z - Zamknięty przepływ, wirnik wielołopatkowy",
		Kanałowy: "K - Kanałowy wirnik jednołopatkowy",
		Rozdrabniający: "R - Pompa z rozdrabniaczem",
	};
	return descriptions[hydraulic_name];
}

function innerHTML(id, value) {
	document.getElementById(id).innerHTML = value;
}

function updateMailTo() {
	var mail = document.getElementById("mail");
	mail.addEventListener("click", () => {
		window.location.href =
			"mailto:sprzedaz@meprozet.com.pl?subject=Zapytanie%20o%20pompę%20" +
			encodeURIComponent(document.getElementById("pump_name").innerHTML) +
			"%20o%20parametrach%20Q=" +
			encodeURIComponent(document.getElementById("flow_rate_user_td").innerHTML) +
			",%20H=" +
			encodeURIComponent(document.getElementById("lift_height_user").value) +
			"m,%20L=" +
			encodeURIComponent(document.getElementById("pipe_length_user").value) +
			"m,%20D=" +
			encodeURIComponent(document.getElementById("pipe_diameter_user").value) +
			"mm" +
			"&body=Dzień%20dobry,%0D%0A%0D%0AKorzystając%20z%20aplikacji%20dobierzpompe.pl,%20moją%20uwagę%20zwróciła%20pompa%20" +
			encodeURIComponent(document.getElementById("pump_name").innerHTML) +
			".%0D%0A%0D%0AInteresuje%20mnie%20...%20%0D%0A%0D%0APozdrawiam,";
	});
}

function updateData(plotHydraulic, plotPower, hydraulic_name, pump_id, rowId) {
	// const plotHydraulicImg = document.getElementById("plotHydraulic");
	// const plotPowerImg = document.getElementById("plotPower");
	// const rotorImage = document.getElementById("rotorImage");
	const rotorShortDescription = document.getElementById("rotorShortDescription");
	// const placeholderUrl = "/images/placeholder.gif";

	rotorShortDescription.innerHTML = applyPumpTypeDescription(hydraulic_name);

	// plotHydraulicImg.src = placeholderUrl;
	// plotPowerImg.src = placeholderUrl;
	// rotorImage.src = "/images/" + replacePolishChars(hydraulic_name) + ".png";

	// function loadImage(imageElement, imageUrl) {
	// 	const image = new Image();
	// 	image.onload = function () {
	// 		imageElement.src = imageUrl;
	// 	};
	// 	image.onerror = function () {
	// 		setTimeout(function () {
	// 			imageElement.src = imageUrl;
	// 		}, 1000);
	// 	};
	// 	image.src = imageUrl;
	// }

	// loadImage(plotHydraulicImg, "/img/" + plotHydraulic);
	// loadImage(plotPowerImg, "/img/" + plotPower);

	const dataIndex = storedResponseData.findIndex((item) => item.pump_id == pump_id);

	if (dataIndex !== -1) {
		const pumpData = storedResponseData[dataIndex];
		const table = document.getElementById("pumpTable");
		table.setAttribute("pump_id", pump_id);
		innerHTML("flow_rate_user_td", `${pumpData.flow_rate_user} m³/h`);
		innerHTML("flow_actual", `${pumpData.flow_actual.toFixed(2)} m³/h`);
		innerHTML("lift_height_required", `${pumpData.lift_height_required.toFixed(2)} m`);
		innerHTML("lift_height_actual", `${pumpData.lift_height_actual.toFixed(2)} m`);
		innerHTML("power_actual", `${pumpData.power_actual.toFixed(2)} kW`);
		innerHTML("pump_name", `${pumpData.pump_name}`);
		// console.log(selectedRowId);
		// if (selectedRowId !== null && selectedRowId !== rowId) {
		// 	const prevSelectedRow = document.getElementById(selectedRowId);
		// 	if (prevSelectedRow) {
		// 		prevSelectedRow.classList.remove("fw-bold", "text-primary");
		// 	}
		// }
		updateMailTo();

		const selectedRow = document.getElementById(rowId);
		if (selectedRow) {
			selectedRow.classList.add("fw-bold", "text-primary");
			selectedRowId = rowId;
		}
	} else {
		console.error(`Data for pump_id ${pump_id} not found in storedResponseData.`);
	}
}

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

updateFlowVisualization();
