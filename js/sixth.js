document.getElementById("lift_height_user").addEventListener("input", function (e) {
	var max = parseFloat(e.target.max);
	var min = parseFloat(e.target.min);
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
		toast.setAttribute("data-umami-event", "H toast displayed");

		// Create the toast body
		var toastBody = document.createElement("div");
		toastBody.classList.add("toast-body");
		toastBody.textContent = "Maksymalna geometryczna wysokość podnoszenia pomp zatapialnych w ofercie to obecnie 58 metrów";
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
		}, 5000);
	}
	if (value < min) {
		e.target.value = min;
	}
});
