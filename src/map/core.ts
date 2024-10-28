import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { setupMapLayers } from "./layers";
import { setupInteractions } from "./interactions";

export const createMap = async (token: string) => {
	// Initialise new ArcGIS map instance
	const map = new ArcGISMap();
	const { basemap, groupLayer, biodiversityLayer } =
		await setupMapLayers(token);

	// Set basemap properly
	map.basemap = basemap;

	// Add other layers
	map.add(groupLayer);
	map.add(biodiversityLayer);

	return { map };
};

// Create and configure the map view
export const createMapView = (map: __esri.Map) => {
	const view = new MapView({
		container: "map",
		map: map,
		center: [-3.534422, 50.736509],
		zoom: 15,
		ui: {
			components: ["attribution"],
		},
		constraints: {
			minZoom: 12,
			snapToZoom: false,
		},
		cursor: "crosshair",
	} as __esri.MapViewProperties);

	view.when(() => {
		setupInteractions(view);
	});

	return view;
};
