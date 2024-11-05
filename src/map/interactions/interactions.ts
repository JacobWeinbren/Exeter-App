import { showPopup, hidePopup } from "@/features/popup/popup";
import { highlightFeature, clearExistingHighlight } from "./highlight";
import maplibregl from "maplibre-gl";

type InteractionMode = "hover" | "click";
let currentMode: InteractionMode = "hover";
let selectedPointId: string | null = null;

export const setupInteractions = (map: maplibregl.Map): void => {
	map.on("mousemove", "biodiversity", (e) => handlePointerMove(e, map));
	map.on("click", "biodiversity", (e) => handleClick(e, map));
	map.on("click", (e) => handleMapClick(e, map));
	map.on("mouseleave", "biodiversity", () => {
		if (currentMode === "hover") {
			hidePopup();
		}
	});
};

const handlePointerMove = (event: any, map: maplibregl.Map): void => {
	if (currentMode === "click") return;

	const feature = event.features[0];
	if (feature) {
		showPopupForFeature(feature);
	}
};

const handleClick = (event: any, map: maplibregl.Map): void => {
	const feature = event.features[0];

	if (feature) {
		currentMode = "click";
		selectedPointId = feature.properties.OBJECTID;
		showPopupForFeature(feature);
		highlightFeature(feature, map);
	} else {
		currentMode = "hover";
		selectedPointId = null;
		hidePopup();
		clearExistingHighlight(map);
	}
};

const handleMapClick = (event: any, map: maplibregl.Map): void => {
	const features = map.queryRenderedFeatures(event.point, {
		layers: ["biodiversity"],
	});

	if (features.length === 0) {
		currentMode = "hover";
		selectedPointId = null;
		hidePopup();
		clearExistingHighlight(map);
	}
};

const showPopupForFeature = (feature: any): void => {
	const count = feature.properties.cluster_count || 1;
	const title = `Biodiversity Point ${feature.properties.OBJECTID}`;
	const content = `Number of observations: ${count}`;
	showPopup(title, content);
};
