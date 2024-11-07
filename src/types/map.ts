import type maplibregl from "maplibre-gl";

export interface MapFeature extends GeoJSON.Feature {
	type: "Feature";
	properties: {
		OBJECTID: string;
		Name?: string;
		Category?: string;
		SubCategory?: string;
		Details?: string;
		Creator?: string;
		DateTime?: number;
		cluster_count?: number;
	};
	geometry: {
		type: "Point";
		coordinates: [number, number];
	};
}

export interface MapInteractionConfig {
	layerId: string;
	highlightColor: string;
	highlightWidth: number;
}

export interface AttachmentInfo {
	id: string;
	name: string;
	contentType: string;
	size: number;
}

export interface MapEventHandlers {
	onFeatureClick?: (feature: MapFeature) => void;
	onFeatureHover?: (feature: MapFeature) => void;
	onMapClick?: (e: maplibregl.MapMouseEvent) => void;
}
