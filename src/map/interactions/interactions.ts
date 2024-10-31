import { showPopup, hidePopup } from "@/features/popup/popup";
import { highlightFeature, clearExistingHighlight } from "./highlight";

type InteractionMode = "hover" | "click";
let currentMode: InteractionMode = "hover";
let selectedPointId: string | null = null;

export const setupInteractions = (view: __esri.MapView): void => {
	view.on("pointer-move", (event) => handlePointerMove(event, view));
	view.on("click", (event) => handleClick(event, view));
};

const handlePointerMove = async (
	event: any,
	view: __esri.MapView
): Promise<void> => {
	if (currentMode === "click") return;

	const feature = await getFeatureFromEvent(event, view);
	if (feature?.layer?.type === "geojson") {
		showPopupForFeature(feature);
	}
};

const handleClick = async (event: any, view: __esri.MapView): Promise<void> => {
	const feature = await getFeatureFromEvent(event, view);
	clearExistingHighlight();

	if (feature?.layer?.type === "geojson") {
		currentMode = "click";
		selectedPointId = feature.attributes.OBJECTID;
		showPopupForFeature(feature);
		highlightFeature(feature, view);
	} else {
		currentMode = "hover";
		selectedPointId = null;
		hidePopup();
	}
};

const getFeatureFromEvent = async (
	event: any,
	view: __esri.MapView
): Promise<__esri.Graphic | undefined> => {
	const response = await view.hitTest(event);
	const result = response.results[0];
	return result && "graphic" in result ? result.graphic : undefined;
};

const showPopupForFeature = (feature: __esri.Graphic): void => {
	const count = feature.attributes.cluster_count || 1;
	const title = `Biodiversity Point ${feature.attributes.OBJECTID}`;
	const content = `Number of observations: ${count}`;
	showPopup(title, content);
};
