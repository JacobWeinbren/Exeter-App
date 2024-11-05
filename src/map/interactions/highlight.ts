import maplibregl from "maplibre-gl";

export const highlightFeature = (feature: any, map: maplibregl.Map): void => {
	// Reset any existing highlights
	clearExistingHighlight(map);

	// Set highlight for the clicked feature
	map.setPaintProperty("biodiversity", "circle-stroke-opacity", [
		"case",
		["==", ["get", "OBJECTID"], feature.properties.OBJECTID],
		1,
		0,
	]);
};

export const clearExistingHighlight = (map: maplibregl.Map): void => {
	map.setPaintProperty("biodiversity", "circle-stroke-opacity", 0);
};
