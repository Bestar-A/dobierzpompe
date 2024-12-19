const pumpChartCtx = document.getElementById("hydraulics-chart");
const powerChartCtx = document.getElementById("power-chart");

let pumpChart, powerChart;

const drawChart = (item) => {
	const pumpXData = item.hydraulic_graph_params.flow_rate_records_high_res.map((i) => Math.round(i * 10) / 10);

	const pumpData = {
		labels: pumpXData,
		datasets: [
			{
				type: "scatter",
				label: "flow actual",
				data: [
					{ x: item.hydraulic_graph_params.flow_actual, y: item.hydraulic_graph_params.lift_height_actual },
					{ x: item.hydraulic_graph_params.flow_rate_nominal, y: item.hydraulic_graph_params.nominal_height },
					{ x: item.hydraulic_graph_params.flow_rate_user, y: item.hydraulic_graph_params.lift_height_user },
				],
				backgroundColor: ["#5E96D8C6", "#FB4B14", "#89B62A"],
				pointRadius: [10, 4, 4],
				borderWidth: [4, 0, 0],
				borderColor: "#ffffff",
				pointStyle: "circle",
			},
			{
				type: "line",
				label: "pump curve",
				data: item.hydraulic_graph_params.pump_curve,
				fill: false,
				borderColor: "#2A6AB6",
				borderWidth: 3,
				backgroundColor: "#0000001f",
				pointRadius: 0.1,
			},
			{
				type: "line",
				label: "pipe curve",
				data: item.hydraulic_graph_params.pipe_curve,
				fill: true,
				borderColor: "#D6F09E",
				borderWidth: 3,
				backgroundColor: "#2A6AB61f",
				pointRadius: 0.1,
			},
		],
	};

	if (pumpChart) pumpChart.destroy();

	pumpChart = new Chart(pumpChartCtx, {
		type: "scatter",
		data: pumpData,
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
						stepSize: 0.1,
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

	const powerXData = item.power_graph_params.flow_rate_records_high_res.map((i) => Math.round(i * 10) / 10);

	if (powerChart) powerChart.destroy();

	const powerData = {
		labels: powerXData,
		datasets: [
			{
				type: "scatter",
				label: "flow actual",
				data: [
					{ x: item.power_graph_params.flow_actual, y: item.power_graph_params.power_actual },
					{ x: item.power_graph_params.flow_rate_nominal, y: item.power_graph_params.power_nominal_on_curve },
				],
				backgroundColor: ["#5E96D8C6", "#FB4B14"],
				pointRadius: [10, 4],
				borderWidth: [4, 0],
				borderColor: "#ffffff",
				pointStyle: "circle",
			},
			{
				type: "line",
				label: "power curve curve",
				data: item.power_graph_params.power_curve,
				fill: true,
				borderColor: "#2A6AB6",
				borderWidth: 3,
				backgroundColor: "#dddddd1f",
				pointRadius: 0.1,
			},
		],
	};

	powerChart = new Chart(powerChartCtx, {
		type: "scatter",
		data: powerData,
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
						stepSize: 0.1,
					},
				},
				y: {
					display: true,
					title: {
						display: true,
						text: "Moc [kW]",
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
