import type maplibregl from "maplibre-gl";
import type { MapFeature } from "@/types/map";
import type { FilterSpecification } from "maplibre-gl";

let lastHighlightedId: string | null = null;
let currentMap: maplibregl.Map | null = null;

export const initialiseHighlight = (map: maplibregl.Map): void => {
	currentMap = map;
	currentMap.setFilter("biodiversity-points-selected", [
		"==",
		"OBJECTID",
		"",
	]);
};

export const highlightFeature = (feature: MapFeature): void => {
	if (!currentMap) return;

	clearExistingHighlight();

	const featureId = feature.properties.OBJECTID;
	lastHighlightedId = featureId;

	const currentFilter = currentMap.getFilter("biodiversity-points");
	const highlightFilter: FilterSpecification = [
		"all",
		["==", ["get", "OBJECTID"], featureId],
		...(Array.isArray(currentFilter)
			? [currentFilter as FilterSpecification]
			: []),
	] as any;

	currentMap.setFilter("biodiversity-points-selected", highlightFilter);
	currentMap.setPaintProperty(
		"biodiversity-points-highlight",
		"circle-stroke-opacity",
		1
	);
};

export const clearExistingHighlight = (): void => {
	if (!currentMap) return;

	currentMap.setFilter("biodiversity-points-selected", [
		"==",
		"OBJECTID",
		"",
	]);

	lastHighlightedId = null;
};
