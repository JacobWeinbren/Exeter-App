import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { setupMapLayers } from "./layers";
import { setupInteractions } from "../interactions/interactions";

export const createMap = async (token: string) => {
	const map = new ArcGISMap();
	const { basemap, groupLayer, biodiversityLayer } =
		await setupMapLayers(token);
	map.basemap = basemap;
	map.add(groupLayer);
	map.add(biodiversityLayer);
	return { map };
};

export const createMapView = (map: __esri.Map) => {
	const view = new MapView({
		container: "map",
		map,
		center: [-3.534422, 50.736509],
		zoom: 15,
		ui: { components: ["attribution"] },
		constraints: { minZoom: 12, snapToZoom: false },
		cursor: "crosshair",
	} as __esri.MapViewProperties);

	view.when(() => setupInteractions(view));
	return view;
};
