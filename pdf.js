const downloadBtn = document.querySelector("#download-btn");

downloadBtn.addEventListener("click", () => {
	const pdfPage = document.querySelector("#pdf-page");

	pdfPage.style.display = "block";
	const pageHeight = parseFloat(window.getComputedStyle(pdfPage).height);
	const pageWidth = parseFloat(window.getComputedStyle(pdfPage).width);

	html2PDF(pdfPage, {
		jsPDF: {
			unit: "pt",
			format: [pageWidth, pageHeight],
		},
		imageType: "image/jpeg",
		output: "./pdf/generate.pdf",
		html2canvas: { scale: 3 },
	});
	pdfPage.style.display = "none";
});
