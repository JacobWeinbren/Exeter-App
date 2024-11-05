import { showPopup, hidePopup } from "@/features/popup/popup";
import { highlightFeature, clearExistingHighlight } from "./highlight";
import maplibregl from "maplibre-gl";

type InteractionMode = "hover" | "click";
let currentMode: InteractionMode = "hover";
let selectedPointId: string | null = null;

export const setupInteractions = (map: maplibregl.Map): void => {
	map.on("click", "biodiversity", (e) => handleClick(e, map));
	map.on("click", (e) => handleMapClick(e, map));
};

const handleClick = (event: any, map: maplibregl.Map): void => {
	const feature = event.features[0];

	if (feature) {
		currentMode = "click";
		selectedPointId = feature.properties.OBJECTID;
		showPopupForFeature(feature);
		highlightFeature(feature, map);
	} else {
		currentMode = "hover";
		selectedPointId = null;
		hidePopup();
		clearExistingHighlight(map);
	}
};

const handleMapClick = (event: any, map: maplibregl.Map): void => {
	const features = map.queryRenderedFeatures(event.point, {
		layers: ["biodiversity"],
	});

	if (features.length === 0) {
		currentMode = "hover";
		selectedPointId = null;
		hidePopup();
		clearExistingHighlight(map);
	}
};

const showPopupForFeature = async (feature: any): Promise<void> => {
	const count = feature.properties.cluster_count || 1;
	const objectId = feature.properties.OBJECTID;
	const title = `Biodiversity Point ${objectId}`;
	const content = `Number of observations: ${count}`;

	// Fetch attachments for this feature
	const token = (window as any).token;
	const attachmentsUrl = `https://services5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/Biodiversity_Point_new/FeatureServer/0/${objectId}/attachments?f=json&token=${token}`;

	try {
		const response = await fetch(attachmentsUrl);
		const data = await response.json();
		const attachments = data.attachmentInfos || [];

		if (attachments.length > 0) {
			const attachment = attachments[0];
			const imageUrl = `https://services5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/Biodiversity_Point_new/FeatureServer/0/${objectId}/attachments/${attachment.id}?token=${token}`;
			showPopup(title, content, imageUrl);
		} else {
			showPopup(title, content);
		}
	} catch (error) {
		console.error("Error fetching attachments:", error);
		showPopup(title, content);
	}
};
