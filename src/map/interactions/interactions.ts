import type maplibregl from "maplibre-gl";
import type { MapFeature } from "@/types/map";
import { showPopup, hidePopup } from "@/features/popup/popup";
import { fetchAttachments, getAttachmentUrl } from "@/services/api";
import {
	initialiseHighlight,
	highlightFeature,
	clearExistingHighlight,
} from "./highlight";

let selectedPointId: string | null = null;
const layerId = 'biodiversity-points'

export const setupInteractions = (map: maplibregl.Map): void => {
	initialiseHighlight(map);

	map.on("click", layerId, (e) => {
		const typedEvent = e as maplibregl.MapMouseEvent & {
			features?: MapFeature[];
		};
		handleFeatureClick(typedEvent, map);
	});
	map.on("click", (e) => handleMapClick(e, map));
};

const handleFeatureClick = (
	event: maplibregl.MapMouseEvent & { features?: MapFeature[] },
	map: maplibregl.Map
): void => {
	const feature = event.features?.[0];
	if (!feature) return;

	selectedPointId = feature.properties.OBJECTID;
	showFeatureDetails(feature, map);
};

const handleMapClick = (
	event: maplibregl.MapMouseEvent,
	map: maplibregl.Map
): void => {
	const features = map.queryRenderedFeatures(event.point, {
		layers: [layerId],
	});

	if (features.length === 0) {
		selectedPointId = null;
		hidePopup();
		clearExistingHighlight();
	}
};

const showFeatureDetails = async (
	feature: MapFeature,
	map: maplibregl.Map
): Promise<void> => {
	const {
		OBJECTID: objectId,
		Name: name = "Unknown",
		Category: category = "Unknown",
		SubCategory: subCategory = "Unknown",
		Details: details = "No details available",
		cluster_count = 1,
	} = feature.properties;

	const contentHtml = `
		<div class="popup-content">
			<p><strong>Name:</strong> <span>${name}</span></p>
			<p><strong>Category:</strong> <span>${category}</span></p>
			<p><strong>SubCategory:</strong> <span>${subCategory}</span></p>
			<p><strong>Details:</strong> <span>${details}</span></p>
			<p><strong>Number of observations:</strong> <span>${cluster_count}</span></p>
		</div>
	`;

	try {
		const attachments = await fetchAttachments(objectId);
		const imageUrl =
			attachments.length > 0
				? getAttachmentUrl(objectId, attachments[0].id)
				: undefined;

		highlightFeature(feature);
		showPopup(`Biodiversity Point ${objectId}`, contentHtml, imageUrl);
	} catch (error) {
		console.error("Error fetching attachments:", error);
		showPopup(`Biodiversity Point ${objectId}`, contentHtml);
	}
};
