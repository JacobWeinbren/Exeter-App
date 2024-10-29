import { type CustomWindow, type PopupData } from "../types";
import { highlightFeature, clearExistingHighlight } from "./highlight";

// Track interaction state and selected point
let currentMode: "hover" | "click" = "hover";
let selectedPointId: string | null = null;

export function setupInteractions(view: __esri.MapView) {
	let hoveredFeature: any = null;

	view.on("pointer-move", (event) =>
		handlePointerMove(event, view, hoveredFeature)
	);
	view.on("click", (event) => handleClick(event, view));
}

function handlePointerMove(
	event: any,
	view: __esri.MapView,
	hoveredFeature: any
) {
	// Skip if in click mode
	if (currentMode === "click") return;

	view.hitTest(event).then((response) => {
		const feature = getFeatureFromHitTest(response);

		// Show popup for GeoJSON layers only
		if (feature?.layer?.type === "geojson") {
			if (hoveredFeature !== feature) {
				hoveredFeature = feature;
				showPopupForFeature(feature);
			}
		}
	});
}

function handleClick(event: any, view: __esri.MapView) {
	view.hitTest(event).then((response) => {
		const feature = getFeatureFromHitTest(response);

		clearExistingHighlight();

		// Handle click on GeoJSON features
		if (feature?.layer?.type === "geojson") {
			currentMode = "click";
			selectedPointId = feature.attributes.OBJECTID;
			showPopupForFeature(feature);
			highlightFeature(feature, view);
		} else {
			// Reset to hover mode when clicking elsewhere
			currentMode = "hover";
			selectedPointId = null;
			(window as unknown as CustomWindow).hidePopup();
		}
	});
}

// Extract feature from hit test response
function getFeatureFromHitTest(
	response: __esri.HitTestResult
): __esri.Graphic | undefined {
	const result = response.results[0];
	if (result && "graphic" in result) {
		return result.graphic;
	}
	return undefined;
}

// Display popup with feature information
function showPopupForFeature(feature: __esri.Graphic): void {
	// Get attributes and handle clustered points
	const attributes = feature.attributes;
	const clusterCount = attributes.cluster_count || 1;

	const popupData: PopupData = {
		title: "Biodiversity Point",
		content: `Number of records in this area: ${clusterCount}`,
	};

	(window as unknown as CustomWindow).showPopup(
		popupData.title,
		popupData.content
	);
}
