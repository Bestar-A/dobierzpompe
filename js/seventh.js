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

		// Create a new toast
		var toast = document.createElement("div");
		toast.classList.add("toast");
		toast.classList.add("m-2");
		toast.setAttribute("role", "alert");
		toast.setAttribute("aria-live", "assertive");
		toast.setAttribute("aria-atomic", "true");
		toast.setAttribute("data-umami-event", "Q toast displayed");

		// Create the toast body
		var toastBody = document.createElement("div");
		toastBody.classList.add("toast-body");
		unitTextForToastBody = document.getElementById("measurementUnit").textContent;
		toastBody.textContent = `Maksymalna wydajność (Q - przepływ) pomp zatapialnych w ofercie to obecnie ${max} ${unitTextForToastBody}`;
		toast.appendChild(toastBody);

		// Insert the toast after the input field
		e.target.parentNode.insertBefore(toast, e.target.nextElementSibling);

		// Initialize the toast
		var toastEl = new bootstrap.Toast(toast);

		// Show the toast
		toastEl.show();

		// Remove the toast after 5 seconds
		setTimeout(function () {
			toast.remove();
		}, 3000);
	}
	if (value < min) {
		e.target.value = min;
	}
});
