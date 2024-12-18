let selectedRowId = null;

const flow_rate_user_input = document.getElementById("flow_rate_user");
const diameterSelect = document.getElementById("pipe_diameter_user");

var minus = document.getElementById("minus");
var plus = document.getElementById("plus");
// Assuming minus and plus are defined elsewhere
minus.addEventListener("click", updateFlowVisualization);
plus.addEventListener("click", updateFlowVisualization);

// Aktualizacja przy zmianie wartości
flow_rate_user_input.addEventListener("input", updateFlowVisualization);
diameterSelect.addEventListener("change", updateFlowVisualization);

var inputField = document.getElementById("flow_rate_user");
var dropdownItems = document.querySelectorAll(".dropdown-menu .dropdown-item");
var measurementUnitDisplay = document.getElementById("measurementUnit");

let storedResponseData = null; // Store the response data in a variable so that it can be accessed later
document.getElementById("submit1").addEventListener("click", submitForm);
document.getElementById("submit2").addEventListener("click", submitForm);

async function submitForm() {
	console.log("logging csrf");
	console.log(getCookie("csrftoken"));
	console.log("end of logging csrf");
	const waiting = document.getElementById("waiting");
	waiting.style.display = "";
	waiting.style.zIndex = "20000";
	const measurementUnitDisplay = document.getElementById("measurementUnit");
	console.log(measurementUnitDisplay);
	const measurementUnit = measurementUnitDisplay.getAttribute("value"); // e.g., "m3h", "m3m", etc.
	console.log(measurementUnit);
	// retrieve currentUnitFullName based on the unitAbbreviationsNotations and tag value of measurementUnitDisplay
	const currentUnitFullName = Object.keys(unitAbbreviationsNotations).find((key) => unitAbbreviationsNotations[key] === measurementUnit);
	console.log(currentUnitFullName);
	var flow_rate_user = parseFloat(document.getElementById("flow_rate_user").value.replace(/,/g, "."));
	console.log(flow_rate_user);
	flow_rate_user = toBaseUnit(flow_rate_user, currentUnitFullName);
	console.log(flow_rate_user);
	let lift_height_user_value = parseFloat(document.getElementById("lift_height_user").value.replace(/,/g, "."));
	let lift_height_user = isNaN(lift_height_user_value) ? 0 : lift_height_user_value.toFixed(0);

	let pipe_length_value = parseFloat(document.getElementById("pipe_length_user").value.replace(/,/g, "."));
	let pipe_length_user = isNaN(pipe_length_value) ? 0 : pipe_length_value.toFixed(0);

	console.log(flow_rate_user);
	console.log(currentUnitFullName);
	//const h = document.getElementById('lift_height_user').value;
	//const pipe_length = document.getElementById('pipe_length_user').value;
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
	console.log(hydraulicTypesString); // Outputs something like: ('S','W','Z','K','R')
	const radioValue = document.querySelector('input[name="radioOption"]:checked') ? document.querySelector('input[name="radioOption"]:checked').value : null;
	// make validation that flow_rate_user,lift_height_user,l are higher or equal 1
	console.log(flow_rate_user);
	if (parseFloat(document.getElementById("flow_rate_user").value) < 0.0009 || lift_height_user < 1 || pipe_length_user < 1) {
		alert("Wartości Q, H i L muszą być większe od 1");
		waiting.style.display = "none";
		// stop processing submit function
		return;
	}

	const data = {
		measurementUnit: "m3h", // Always send m3/h to the backend

		flow_rate_user,
		lift_height_user,
		pipe_length_user,
		diameter,
		hydraulic_types: hydraulicTypesString,
		lowerfit: document.getElementById("lowerfit").checked ? document.getElementById("lowerfit").value : null,
		radioValue,
	};

	console.log("Sending Data:", JSON.stringify(data));

	const response = await fetch("/general_post/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		},
		body: JSON.stringify(data),
	});

	storedResponseData = await response.json(); // Store responseData
	// if storedResponse is an empty Array insert innerHTML to several fields

	console.log("Response:", storedResponseData);

	// Call renderTable after the fetch request is completed
	renderTable(storedResponseData);

	showCards();
	waiting.style.display = "none";

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
	} else {
		innerHTML("wyniki", "Wyniki");
		innerHTML("hydraulikah4", "Hydraulika pompy oraz rurociągu");
	}
}

function showCards() {
	document.getElementById("card3").style.display = "block";
	document.getElementById("card4").style.display = "block";
	document.getElementById("card5").style.display = "block";
	document.getElementById("card6").style.display = "block";
	document.getElementById("tableContainer").scrollIntoView();
}

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

function renderTable(data) {
	// Sort the data based on the 'goodness_factor' property
	data.sort((a, b) => a.goodness_factor - b.goodness_factor);

	// Create the table HTML
	let tableHtml = '<table class="table table-hover mb-0 p-0 pmod5" id="tableResults">';
	tableHtml += "<tr><th>D</th><th>Wirnik</th><th>Moc</th><th>Model</th></tr>";

	// Iterate through the sorted data and add rows to the table
	for (const item of data) {
		// Round values to 2 digits after the decimal point
		const roundedRelativeDiff = item.goodness_factor.toFixed(2);

		// Add a row to the table with a unique ID for each row

		// TODO : change colors according to feedback
		const rowId = `row_${item.pump_id}`;
		let rowClass = "";
		if (roundedRelativeDiff < 0.4) {
			rowClass = "table-success hover-text";
		} else if (roundedRelativeDiff < 0.8) {
			rowClass = "table-info hover-text";
		} else if (roundedRelativeDiff < 1) {
			rowClass = "table-warning hover-text";
		} else {
			rowClass = "table-danger hover-text";
		}

		tableHtml += `<tr id="${rowId}" class="${rowClass}" onclick="updateData('${item.hydraulic_plot}','${item.power_plot}','${item.hydraulic_name}', '${item.pump_id}', '${rowId}')">`;
		tableHtml += `<td>${roundedRelativeDiff}</td><td>${item.hydraulic_name}</td><td>${item.power_nominal}kW</td><td>${item.pump_name}</td>`;
		tableHtml += "</tr>";
	}

	// Close the table HTML
	tableHtml += "</table>";

	// Display the table in the document (replace 'tableContainer' with the ID or class of the container where you want to display the table)
	document.getElementById("tableContainer").innerHTML = tableHtml;
	// Close the table HTML
	tableHtml += "</table>";

	// Display the table in the document (replace 'tableContainer' with the ID or class of the container where you want to display the table)
	document.getElementById("tableContainer").innerHTML = tableHtml;

	// Simulate a click on the second row of the table
	var table = document.getElementById("tableContainer").getElementsByTagName("table")[0];
	var secondRow = table.rows[1];
	if (secondRow) {
		secondRow.click();

		document.getElementById("tableContainer").scrollIntoView();
	}
	document.getElementById("tableContainer").scrollIntoView();
}

function innerHTML(id, value) {
	document.getElementById(id).innerHTML = value;
}

function updateData(plotHydraulic, plotPower, hydraulic_name, pump_id, rowId) {
	const plotHydraulicImg = document.getElementById("plotHydraulic");
	const plotPowerImg = document.getElementById("plotPower");
	const rotorImage = document.getElementById("rotorImage");
	const rotorShortDescription = document.getElementById("rotorShortDescription");
	const placeholderUrl = "/images/placeholder.gif"; // URL do placeholdera

	rotorShortDescription.innerHTML = applyPumpTypeDescription(hydraulic_name);

	// Ustawienie placeholdera przed załadowaniem rzeczywistych obrazów
	plotHydraulicImg.src = placeholderUrl;
	plotPowerImg.src = placeholderUrl;
	rotorImage.src = "/images/" + replacePolishChars(hydraulic_name) + ".png";

	// Funkcja pomocnicza do aktualizacji źródła obrazu
	function loadImage(imageElement, imageUrl) {
		const image = new Image();
		image.onload = function () {
			imageElement.src = imageUrl; // Obrazek dostępny, aktualizacja src
		};
		image.onerror = function () {
			// poczekaj 500ms i spróbuj ponownie
			setTimeout(function () {
				imageElement.src = imageUrl;
			}, 1000);
		};
		image.src = imageUrl;
	}

	// Asynchroniczna aktualizacja źródła obrazu po ustawieniu placeholdera
	loadImage(plotHydraulicImg, "/img/" + plotHydraulic);
	loadImage(plotPowerImg, "/img/" + plotPower);

	// Find the index of the specific pump data in the storedResponseData array based on pump_id
	const dataIndex = storedResponseData.findIndex((item) => item.pump_id == pump_id);

	if (dataIndex !== -1) {
		// Update other data using the dataIndex
		const pumpData = storedResponseData[dataIndex];
		// store pumpID as graph_parameters
		const table = document.getElementById("pumpTable");
		// add pumpID attribute to div which has pumpTable id
		table.setAttribute("pump_id", pump_id);
		innerHTML("flow_rate_user_td", `${pumpData.flow_rate_user} m³/h`);
		innerHTML("flow_actual", `${pumpData.flow_actual.toFixed(2)} m³/h`);
		innerHTML("lift_height_required", `${pumpData.lift_height_required.toFixed(2)} m`);
		innerHTML("lift_height_actual", `${pumpData.lift_height_actual.toFixed(2)} m`);
		innerHTML("power_actual", `${pumpData.power_actual.toFixed(2)} kW`);
		innerHTML("pump_name", `${pumpData.pump_name}`);
		console.log(selectedRowId);
		if (selectedRowId !== null && selectedRowId !== rowId) {
			const prevSelectedRow = document.getElementById(selectedRowId);
			if (prevSelectedRow) {
				prevSelectedRow.classList.remove("fw-bold", "text-primary");
			}
		}
		updateMailTo();

		// Add 'fw-bold' class to the new selected row
		const selectedRow = document.getElementById(rowId);
		if (selectedRow) {
			selectedRow.classList.add("fw-bold", "text-primary");
			selectedRowId = rowId; // Update the global variable to the new selected row's ID
		}
	} else {
		console.error(`Data for pump_id ${pump_id} not found in storedResponseData.`);
	}
}
function updateMailTo() {
	var mail = document.getElementById("mail");
	mail.setAttribute(
		"onclick",
		"window.location.href='mailto:sprzedaz@meprozet.com.pl?subject=Zapytanie%20o%20pompę%20' + document.getElementById('pump_name').innerHTML + 'o parametrach Q=' + document.getElementById('flow_rate_user_td').innerHTML + ', H=' + document.getElementById('lift_height_user').value + 'm, L=' + document.getElementById('pipe_length_user').value + 'm, D=' + document.getElementById('pipe_diameter_user').value + 'mm' + '&body=Dzień dobry,%0D%0A%0D%0AKorzystając z aplikacji dobierzpompe.pl, moją uwagę zwróciła pompa ' + document.getElementById('pump_name').innerHTML + '.' + '%0D%0A%0D%0AInteresuje mnie ... %0D%0A%0D%0APozdrawiam,'"
	);
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
	console.log(hydraulic_name);
	console.log(descriptions[hydraulic_name]);
	return descriptions[hydraulic_name];
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
