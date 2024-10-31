import Basemap from "@arcgis/core/Basemap";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import { SimpleFillSymbol, SimpleMarkerSymbol } from "@arcgis/core/symbols";
import { type CustomWindow } from "@/types";

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
const createCookieCutterLayer = () => {
	return new VectorTileLayer({
		url: "https://vectortileservices5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/UOE_cookie_cutter_demo22/VectorTileServer",
		title: "UoE Cookie Cutter",
		blendMode: "destination-in",
	});
};

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

const createBiodiversityLayer = (token: string) => {
	return new GeoJSONLayer({
		url: `${(window as unknown as CustomWindow).MAP_URL}/0/query?f=geojson&where=1=1&outFields=*&token=${token}`,
		renderer: new SimpleRenderer({
			symbol: new SimpleMarkerSymbol({
				size: 10,
				color: [26, 188, 156, 1],
				outline: {
					color: [0, 0, 0, 1],
				},
			}),
		}),
		popupEnabled: false,
	});
};
