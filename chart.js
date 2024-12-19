const pumpChartCtx = document.getElementById("hydraulics-chart");
const powerChartCanvas = document.querySelector("#hydraulics-chart");

console.log(powerChartCanvas);

let pumpChart;

const drawChart = (item) => {
	console.log(item.pump_id);
	const xdata = item.hydraulic_graph_params.flow_rate_records_high_res.map((i) => Math.round(i * 10) / 10);
	const data = {
		labels: xdata,
		datasets: [
			{
				label: "pump curve",
				data: item.hydraulic_graph_params.pump_curve,
				fill: false,
				borderColor: "#00ff00",
				backgroundColor: "#0000001f",
				pointRadius: 1,
			},
			{
				label: "pipe curve",
				data: item.hydraulic_graph_params.pipe_curve,
				fill: true,
				borderColor: "#82B4EF",
				backgroundColor: "#2A6AB61f",
				pointRadius: 1,
			},
		],
	};

	if (pumpChart) pumpChart.destroy();

	console.log(data);
	pumpChart = new Chart(pumpChartCtx, {
		type: "line",
		data,
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				x: {
					display: true,
					title: {
						display: true,
						text: "Lorem [m3/h]",
						color: "#222",
						font: {
							family: "Poppins",
							size: 10,
							weight: "medium",
							lineHeight: 2.8,
						},
						padding: { top: 5, left: 0, right: 0, bottom: 0 },
					},
					ticks: {
						stepSize: 20,
					},
				},
				y: {
					display: true,
					title: {
						display: true,
						text: "Lorem ipsum dolor [m]",
						color: "#222",
						font: {
							family: "Poppins",
							size: 10,
							style: "normal",
							lineHeight: 2.8,
						},
						padding: { top: 10, left: 0, right: 0, bottom: 0 },
					},
				},
			},
			plugins: {
				legend: {
					display: false,
				},
			},
		},
	});
};
