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

let biodiversityLayer: __esri.FeatureLayer;
let clickHighlight: __esri.Handle | null = null;

interface CustomWindow extends Window {
	hidePopup: () => void;
	showPopup: (title: string, content: string) => void;
}

export const createMap = (token: string) => {
	const map = new ArcGISMap();

	const basemap = new Basemap({
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

	biodiversityLayer = new FeatureLayer({
		url: "https://services5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/Biodiversity_Point_new/FeatureServer/0",
		outFields: ["*"],
		featureReduction: {
			type: "cluster",
			clusterRadius: "100px",
		},
		renderer: new SimpleRenderer({
			symbol: new SimpleMarkerSymbol({
				size: 8,
				color: [26, 188, 156, 1],
				outline: {
					color: [255, 255, 255, 0.5],
					width: 0.5,
				},
			}),
			visualVariables: [
				new SizeVariable({
					field: "cluster_count",
					stops: [
						{ value: 1, size: 16 },
						{ value: 6, size: 24 },
						{ value: 11, size: 32 },
						{ value: 16, size: 40 },
						{ value: 21, size: 48 },
						{ value: 26, size: 56 },
					],
				}),
				new ColorVariable({
					field: "cluster_count",
					stops: [
						{ value: 1, color: [26, 188, 156, 1] },
						{ value: 5, color: [26, 188, 156, 1] },
						{ value: 6, color: [155, 89, 182, 1] },
						{ value: 10, color: [155, 89, 182, 1] },
						{ value: 11, color: [231, 76, 60, 1] },
						{ value: 15, color: [231, 76, 60, 1] },
						{ value: 16, color: [241, 196, 15, 1] },
						{ value: 20, color: [241, 196, 15, 1] },
						{ value: 21, color: [230, 126, 34, 1] },
						{ value: 25, color: [230, 126, 34, 1] },
						{ value: 26, color: [52, 73, 94, 1] },
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

	view.when(() => {
		view.whenLayerView(biodiversityLayer).then((layerView) => {
			setupHighlight(view, layerView);
		});
	});

	return view;
};

function setupHighlight(
	view: __esri.MapView,
	layerView: __esri.FeatureLayerView
) {
	view.on("click", (event) => {
		// Remove existing highlight
		if (clickHighlight) {
			clickHighlight.remove();
			clickHighlight = null;
		}

		// Hide popup by default
		(window as unknown as CustomWindow).hidePopup();

		view.hitTest(event).then((response) => {
			const results = response.results.filter(
				(result): result is __esri.GraphicHit =>
					"graphic" in result &&
					result.graphic.layer === biodiversityLayer
			);

			if (results.length) {
				const graphic = results[0].graphic;
				clickHighlight = layerView.highlight(graphic);

				// Show popup with cluster information
				const attributes = graphic.attributes;
				const clusterCount = attributes.cluster_count || 1;
				const title = "Biodiversity Point";
				const content = `Number of records in this area: ${clusterCount}`;
				(window as unknown as CustomWindow).showPopup(title, content);
			}
		});
	});
}
