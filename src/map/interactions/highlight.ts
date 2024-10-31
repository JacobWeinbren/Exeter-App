import type GeoJSONLayerView from "@arcgis/core/views/layers/GeoJSONLayerView";
import { type CustomWindow } from "@/types";

export const highlightFeature = (
	feature: __esri.Graphic,
	view: __esri.MapView
): void => {
	view.whenLayerView(feature.layer).then((layerView) => {
		const geoJSONLayerView = layerView as GeoJSONLayerView;
		(window as unknown as CustomWindow).clickHighlight =
			geoJSONLayerView.highlight(feature);
	});
};

export const clearExistingHighlight = (): void => {
	const customWindow = window as unknown as CustomWindow;
	if (customWindow.clickHighlight) {
		customWindow.clickHighlight.remove();
		customWindow.clickHighlight = null;
	}
};
