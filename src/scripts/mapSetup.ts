import ArcGISMap from "@arcgis/core/Map";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import Basemap from "@arcgis/core/Basemap";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import { SimpleMarkerSymbol } from "@arcgis/core/symbols";
import SizeVariable from "@arcgis/core/renderers/visualVariables/SizeVariable";
import ColorVariable from "@arcgis/core/renderers/visualVariables/ColorVariable";
import GroupLayer from "@arcgis/core/layers/GroupLayer";

export const createMap = (token: string) => {
	const map = new ArcGISMap();

	// Create a new basemap using the ArcGIS OpenStreetMap v2 style
	const basemap = new Basemap({
		baseLayers: [
			new VectorTileLayer({
				url: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer",
				style: "https://www.arcgis.com/sharing/rest/content/items/1932e7d4432d45dabc0d4d13109c1f09/resources/styles/root.json?f=pjson",
			}),
			new VectorTileLayer({
				url: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer",
				style: "https://www.arcgis.com/sharing/rest/content/items/29a71939af7a498584f44c4feca7249b/resources/styles/root.json?f=pjson",
			}),
		],
	});

	map.basemap = basemap;

	const groupLayer = new GroupLayer({
		effect: "drop-shadow(6px 6px 6px black)",
		opacity: 1,
		layers: [
			new VectorTileLayer({
				url: "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer",
				title: "Basemap Assessment",
				style: `https://uoe.maps.arcgis.com/sharing/rest/content/items/ab632d914d9d46a7826d5ae61d11c1e4/resources/styles/root.json?f=pjson&token=${token}`,
			}),
			new VectorTileLayer({
				url: "https://vectortileservices5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/UOE_cookie_cutter_demo22/VectorTileServer",
				title: "UoE Cookie Cutter",
				blendMode: "destination-in",
			}),
		],
	});

	map.add(groupLayer);

	// Add the new FeatureLayer with clustering
	const biodiversityLayer = new FeatureLayer({
		url: "https://services5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/Biodiversity_Point_new/FeatureServer/0",
		outFields: ["*"],
		featureReduction: {
			type: "cluster",
			clusterRadius: "100px",
		},
		renderer: new SimpleRenderer({
			symbol: new SimpleMarkerSymbol({
				size: 8,
				color: "#1abc9c",
				outline: {
					color: [255, 255, 255, 0.5],
					width: 0.5,
				},
			}),
			visualVariables: [
				new SizeVariable({
					field: "cluster_count",
					stops: [
						{ value: 1, size: 8 },
						{ value: 10, size: 12 },
						{ value: 50, size: 20 },
						{ value: 100, size: 30 },
					],
				}),
				new ColorVariable({
					field: "cluster_count",
					stops: [
						{ value: 1, color: "#1abc9c" },
						{ value: 6, color: "#9b59b6" },
						{ value: 11, color: "#e74c3c" },
						{ value: 16, color: "#f1c40f" },
						{ value: 21, color: "#e67e22" },
						{ value: 26, color: "#34495e" },
					],
				}),
			],
		}),
	});

	map.add(biodiversityLayer);

	return { map };
};

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
	});

	return view;
};
