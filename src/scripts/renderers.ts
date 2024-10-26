import ClassBreaksRenderer from "@arcgis/core/renderers/ClassBreaksRenderer";
import FeatureReductionCluster from "@arcgis/core/layers/support/FeatureReductionCluster";
import Color from "@arcgis/core/Color";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

const clusterColors = {
	"1-5": "#1abc9c",
	"6-10": "#9b59b6",
	"11-15": "#e74c3c",
	"16-20": "#f1c40f",
	"21-25": "#e67e22",
	"26+": "#34495e",
};

function adjustBrightness(color: Color, factor: number): Color {
	const rgb = color.toRgb();
	return new Color([
		Math.min(255, Math.round(rgb[0] * factor)),
		Math.min(255, Math.round(rgb[1] * factor)),
		Math.min(255, Math.round(rgb[2] * factor)),
		rgb[3],
	]);
}

export function createSymbol(
	clusterCount: number,
	state: "default" | "hover" | "click" = "default"
): SimpleMarkerSymbol {
	const size = Math.max(12, Math.min(50, Math.sqrt(clusterCount) * 5));

	let baseColor: string;
	if (clusterCount === 1) baseColor = "#000000";
	else if (clusterCount <= 5) baseColor = clusterColors["1-5"];
	else if (clusterCount <= 10) baseColor = clusterColors["6-10"];
	else if (clusterCount <= 15) baseColor = clusterColors["11-15"];
	else if (clusterCount <= 20) baseColor = clusterColors["16-20"];
	else if (clusterCount <= 25) baseColor = clusterColors["21-25"];
	else baseColor = clusterColors["26+"];

	let color = new Color(baseColor);
	let outlineColor: Color | null = null;
	let outlineWidth = 0;

	switch (state) {
		case "hover":
			color = adjustBrightness(color, 1.2);
			break;
		case "click":
			color = adjustBrightness(color, 1.4);
			outlineColor = new Color([30, 64, 175]);
			outlineWidth = 3;
			break;
		default:
			break;
	}

	return new SimpleMarkerSymbol({
		color: color,
		size: size,
		outline: outlineColor
			? {
					color: outlineColor,
					width: outlineWidth,
				}
			: undefined,
	});
}

export function createClusterRenderer() {
	return new ClassBreaksRenderer({
		field: "cluster_count",
		defaultSymbol: createSymbol(1),
		classBreakInfos: [
			{
				minValue: 2,
				maxValue: 5,
				symbol: createSymbol(3),
			},
			{
				minValue: 6,
				maxValue: 10,
				symbol: createSymbol(8),
			},
			{
				minValue: 11,
				maxValue: 15,
				symbol: createSymbol(13),
			},
			{
				minValue: 16,
				maxValue: 20,
				symbol: createSymbol(18),
			},
			{
				minValue: 21,
				maxValue: 25,
				symbol: createSymbol(23),
			},
			{
				minValue: 26,
				maxValue: 150,
				symbol: createSymbol(88),
			},
		],
	});
}

export function createFeatureReductionCluster() {
	return new FeatureReductionCluster({
		type: "cluster",
		clusterRadius: "40px",
		clusterMinSize: "5px",
		clusterMaxSize: "50px",
	});
}
