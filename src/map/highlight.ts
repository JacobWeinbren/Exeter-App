import type GeoJSONLayerView from "@arcgis/core/views/layers/GeoJSONLayerView";
import { type CustomWindow } from "../types";

// Highlights a selected feature on the map
export function highlightFeature(
	feature: __esri.Graphic,
	view: __esri.MapView
): void {
	// Wait for layer to be ready, then apply highlighting
	view.whenLayerView(feature.layer).then((layerView) => {
		const geoJSONLayerView = layerView as GeoJSONLayerView;
		(window as unknown as CustomWindow).clickHighlight =
			geoJSONLayerView.highlight(feature);
	});
}

// Removes any existing highlight from the map
export function clearExistingHighlight() {
	if ((window as unknown as CustomWindow).clickHighlight) {
		(window as unknown as CustomWindow).clickHighlight.remove();
		(window as unknown as CustomWindow).clickHighlight = null;
	}
}
