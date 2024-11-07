import type maplibregl from "maplibre-gl";
import type { MapFeature } from "@/types/map";

let lastHighlightedId: string | null = null;
let currentMap: maplibregl.Map | null = null;

export const initialiseHighlight = (map: maplibregl.Map): void => {
	currentMap = map;
};

export const highlightFeature = (feature: MapFeature): void => {
	if (!currentMap) return;

	clearExistingHighlight();

	const featureId = feature.properties.OBJECTID;
	lastHighlightedId = featureId;

	currentMap.setFilter("biodiversity-points-highlight", [
		"==",
		["get", "OBJECTID"],
		featureId,
	]);

	currentMap.setPaintProperty(
		"biodiversity-points-highlight",
		"circle-opacity",
		0.2
	);
	currentMap.setPaintProperty(
		"biodiversity-points-highlight",
		"circle-stroke-opacity",
		1
	);
};

export const clearExistingHighlight = (): void => {
	if (!currentMap) return;

	currentMap.setPaintProperty(
		"biodiversity-points-highlight",
		"circle-opacity",
		0
	);
	currentMap.setPaintProperty(
		"biodiversity-points-highlight",
		"circle-stroke-opacity",
		0
	);

	lastHighlightedId = null;
};
