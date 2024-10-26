import ArcGISMap from "@arcgis/core/Map";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import Basemap from "@arcgis/core/Basemap";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import {
	createClusterRenderer,
	createFeatureReductionCluster,
} from "./renderers";

declare global {
	interface Window {
		MAP_URL: string;
	}
}

export const createMap = () => {
	const map = new ArcGISMap();
	const basemap = Basemap.fromId("gray-vector");
	map.basemap = basemap;

	const groupLayer = new GroupLayer({
		effect: "drop-shadow(6px 6px 6px black)",
		opacity: 1,
		layers: [
			new VectorTileLayer({
				url: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer",
				title: "Basemap Assessment",
				style: "https://uoe.maps.arcgis.com/sharing/rest/content/items/ab632d914d9d46a7826d5ae61d11c1e4/resources/styles/root.json",
			}),
			new VectorTileLayer({
				url: "https://vectortileservices5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/UOE_cookie_cutter_demo22/VectorTileServer",
				title: "UoE Cookie Cutter",
				blendMode: "destination-in",
			}),
		],
	});

	map.add(groupLayer);

	const clusterRenderer = createClusterRenderer();
	const featureReductionCluster = createFeatureReductionCluster();

	const biodiversityLayer = new FeatureLayer({
		url: window.MAP_URL,
		outFields: ["*"],
		featureReduction: featureReductionCluster,
		renderer: clusterRenderer,
	});

	map.add(biodiversityLayer);

	return { map, biodiversityLayer };
};

export const createMapView = (map: __esri.Map) => {
	return new MapView({
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
	});
};
