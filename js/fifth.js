function checkVisibility() {
	const textTopElement = document.getElementById("submit1");
	const floatingButton = document.querySelector(".floating-button");
	const bounding = textTopElement.getBoundingClientRect();

	// Check if 'text-top' is within the viewport
	if (bounding.top >= 0 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
		// If 'text-top' is visible, hide the floating button
		floatingButton.style.display = "none";
	} else {
		// If 'text-top' is not visible, show the floating button
		floatingButton.style.display = "flex";
	}
}

// Run checkVisibility on scroll and initially
window.addEventListener("scroll", checkVisibility);
checkVisibility(); // Run initially in case the page is not at the top when loaded
