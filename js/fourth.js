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
		// Create a new toast
		var toast = document.createElement("div");
		toast.classList.add("toast");
		toast.classList.add("m-2");
		toast.setAttribute("role", "alert");
		toast.setAttribute("aria-live", "assertive");
		toast.setAttribute("aria-atomic", "true");
		toast.setAttribute("data-umami-event", "Invalid input toast displayed");

		// Create the toast body
		var toastBody = document.createElement("div");
		toastBody.classList.add("toast-body");
		toastBody.textContent = "Wszystkie wartości muszą być większe od zera";
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
});
