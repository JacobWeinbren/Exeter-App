import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import type Graphic from "@arcgis/core/Graphic";
import { createSymbol } from "./renderers.ts";

declare global {
	interface Window {
		showPopup: (title: string, content: string, isClick: boolean) => void;
		hidePopup: () => void;
	}
}

let hoverHighlight: __esri.Handle | null = null;
let clickHighlight: __esri.Handle | null = null;
let view: __esri.MapView;
let layerView: __esri.FeatureLayerView;
let clickedGraphic: Graphic | null = null;

export function setupInteractions(
	mapView: __esri.MapView,
	biodiversityLayer: FeatureLayer
) {
	view = mapView;

	view.whenLayerView(biodiversityLayer).then((lv) => {
		layerView = lv;

		view.on("pointer-move", (event) => {
			view.hitTest(event).then((response) => {
				const result = response.results.find(
					(r) =>
						r.type === "graphic" &&
						r.graphic.layer === biodiversityLayer
				);

				if (result && "graphic" in result) {
					const graphic = result.graphic;

					if (hoverHighlight) {
						hoverHighlight.remove();
					}

					hoverHighlight = layerView.highlight(graphic);
					showPopup(graphic, false);
					updateSymbol(graphic, "hover");
				} else {
					if (hoverHighlight) {
						hoverHighlight.remove();
						hoverHighlight = null;
						window.hidePopup();
					}
				
					resetNonClickedSymbols();
				}
			});
		});

		view.on("click", (event) => {
			view.hitTest(event).then((response) => {
				const result = response.results.find(
					(r) =>
						r.type === "graphic" &&
						r.graphic.layer === biodiversityLayer
				);

				if (result && "graphic" in result) {
					const graphic = result.graphic;

					if (clickHighlight) {
						clickHighlight.remove();
					}
					if (hoverHighlight) {
						hoverHighlight.remove();
						hoverHighlight = null;
					}

					clickHighlight = layerView.highlight(graphic);
					clickedGraphic = graphic; 
					showPopup(graphic, true);
				} else {
					if (clickHighlight) {
						clickHighlight.remove();
						clickHighlight = null;
						clickedGraphic = null; 
						window.hidePopup();
					}
				}
			});
		});
	});
}

function showPopup(graphic: Graphic, isClick: boolean) {
	const title = graphic.attributes.cluster_count
		? `Cluster of ${graphic.attributes.cluster_count} points`
		: "Individual Point";
	const content = graphic.attributes.cluster_count
		? "Click to zoom in and see individual points."
		: `Creator ID: ${graphic.attributes.CreatorID}`;

	window.showPopup(title, content, isClick);
}

function updateSymbol(graphic: Graphic, state: "default" | "hover" | "click") {
	const clusterCount = graphic.attributes.cluster_count || 1;
	const newSymbol = createSymbol(clusterCount, state);
	graphic.symbol = newSymbol;
}

async function resetNonClickedSymbols() {
	if (layerView?.layer instanceof FeatureLayer) {
		const featureLayer = layerView.layer;
		const allFeatures = await featureLayer.queryFeatures();
		for (const feature of allFeatures.features) {
			if (feature !== clickedGraphic) {
				updateSymbol(feature, "default");
			}
		}
	}
}

export function deactivateClickState() {
	if (clickHighlight) {
		clickHighlight.remove();
		clickHighlight = null;
		clickedGraphic = null; 
		window.hidePopup();
	}
}
