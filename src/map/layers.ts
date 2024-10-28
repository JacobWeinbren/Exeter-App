import Basemap from "@arcgis/core/Basemap";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import { SimpleFillSymbol, SimpleMarkerSymbol } from "@arcgis/core/symbols";
import type { CustomWindow } from "../types";

// Sets up and returns all map layers required for initialisation
export const setupMapLayers = async (token: string) => {
	const mapDataEl = document.getElementById("mapData");
	const filteredLayers = JSON.parse(
		mapDataEl?.dataset.filteredLayers || "[]"
	);
	const processedLayers = JSON.parse(
		mapDataEl?.dataset.processedLayers || "[]"
	);

	const basemap = createBasemap();
	const groupLayer = createMainGroupLayer(filteredLayers, processedLayers);
	const biodiversityLayer = createBiodiversityLayer(token);

	return { basemap, groupLayer, biodiversityLayer };
};

// Creates the base OpenStreetMap tiles with standard styling
const createBasemap = () => {
	return new Basemap({
		baseLayers: [
			new VectorTileLayer({
				url: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer",
				style: "https://www.arcgis.com/sharing/rest/content/items/1932e7d4432d45dabc0d4d13109c1f09/resources/styles/root.json",
			}),
			new VectorTileLayer({
				url: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer",
				style: "https://www.arcgis.com/sharing/rest/content/items/29a71939af7a498584f44c4feca7249b/resources/styles/root.json",
			}),
		],
	});
};

// Organises all map layers into a grouped structure with shadow effects
const createMainGroupLayer = (baseMapLayers: any[], labelLayers: any[]) => {
	return new GroupLayer({
		effect: "drop-shadow(6px 6px 6px black)",
		opacity: 1,
		layers: [
			createBaseMapVectorLayer(baseMapLayers),
			createBuildingsLayer(),
			createLabelsVectorLayer(labelLayers),
			createCookieCutterLayer(),
		],
	});
};

// Generates the customised vector tile layer for the base map visualisation
const createBaseMapVectorLayer = (layers: any[]) => {
	return new VectorTileLayer({
		url: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer",
		title: "Basemap Assessment",
		style: {
			version: 8,
			sprite: "https://www.arcgis.com/sharing/rest/content/items/ab632d914d9d46a7826d5ae61d11c1e4/resources/sprites/sprite-1729870731615",
			glyphs: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf",
			sources: {
				esri: {
					type: "vector",
					url: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer",
				},
			},
			layers: layers,
		},
	});
};

// Renders building polygons with grey styling and shadow effects
const createBuildingsLayer = () => {
	return new GeoJSONLayer({
		url: "/Exeter-App/clipped.geojson",
		renderer: new SimpleRenderer({
			symbol: new SimpleFillSymbol({
				color: [230, 230, 230, 0.8],
				outline: {
					color: [70, 70, 70, 0.4],
					width: 0.5,
				},
			}),
		}),
		effect: "drop-shadow(2px 2px 2px rgba(0,0,0,0.5))",
		spatialReference: {
			wkid: 4326,
		},
		geometryType: "polygon",
		popupEnabled: false,
	});
};

// Creates a mask layer to clip the map to the university campus boundary
const createCookieCutterLayer = () => {
	return new VectorTileLayer({
		url: "https://vectortileservices5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/UOE_cookie_cutter_demo22/VectorTileServer",
		title: "UoE Cookie Cutter",
		blendMode: "destination-in",
	});
};

// Adds text labels and POI markers on top of the base map
const createLabelsVectorLayer = (layers: any[]) => {
	return new VectorTileLayer({
		url: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer",
		style: {
			version: 8,
			sprite: "https://cdn.arcgis.com/sharing/rest/content/items/29a71939af7a498584f44c4feca7249b/resources/styles/../sprites/sprite",
			glyphs: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf",
			sources: {
				esri: {
					type: "vector",
					url: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer",
				},
			},
			layers: layers,
		},
	});
};

// Displays biodiversity survey points as coloured markers
const createBiodiversityLayer = (token: string) => {
	return new GeoJSONLayer({
		url: `${(window as unknown as CustomWindow).MAP_URL}/0/query?f=geojson&where=1=1&outFields=*&token=${token}`,
		renderer: new SimpleRenderer({
			symbol: new SimpleMarkerSymbol({
				size: 8,
				color: [26, 188, 156, 1],
				outline: {
					color: [255, 255, 255, 0.5],
					width: 0,
				},
			}),
		}),
		popupEnabled: false,
	});
};
