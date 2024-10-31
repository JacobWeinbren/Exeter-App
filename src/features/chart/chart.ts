import { Chart, type ChartConfiguration } from "chart.js/auto";

export const initChart = (): void => {
	const config: ChartConfiguration = {
		type: "bar",
		data: {
			labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
			datasets: [
				{
					label: "# of Votes",
					data: [12, 19, 3, 5, 2, 3],
					backgroundColor: [
						"rgba(239, 68, 68, 0.8)",
						"rgba(59, 130, 246, 0.8)",
						"rgba(234, 179, 8, 0.8)",
						"rgba(34, 197, 94, 0.8)",
						"rgba(168, 85, 247, 0.8)",
						"rgba(249, 115, 22, 0.8)",
					],
					borderWidth: 1,
					borderColor: "rgba(0, 0, 0, 0.1)",
					borderRadius: 8,
					borderSkipped: false,
				},
			],
		},
		options: {
			animation: {
				duration: 1500,
				easing: "easeOutQuart",
				delay: (context) => context.dataIndex * 100,
			},
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false },
				title: {
					display: true,
					text: "Number of Observations",
					font: {
						family: "Outfit, sans-serif",
						size: 20,
						weight: "bold",
					},
					padding: { top: 10, bottom: 20 },
				},
			},
			scales: {
				x: {
					grid: { display: false },
					ticks: { font: { family: "Outfit, sans-serif", size: 12 } },
				},
				y: {
					grid: { display: true, color: "rgba(0, 0, 0, 0.05)" },
					ticks: { font: { family: "Outfit, sans-serif", size: 12 } },
				},
			},
		},
	};

	new Chart(document.getElementById("chart") as HTMLCanvasElement, config);
};
