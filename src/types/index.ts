import type maplibregl from "maplibre-gl";

export interface CustomWindow extends Window {
	token: string;
	map: maplibregl.Map | null;
	biodiversityData: GeoJSON.FeatureCollection<any, any> | null;
	MAP_URL: string;
}

export interface BiodiversityPoint {
	OBJECTID: string;
	cluster_count?: number;
	CreatorID?: string;
	coordinates: [number, number];
}

export interface LegendItem {
	text: string;
	emoji: string;
	count: number;
	colour: string;
}

export interface PopupData {
	title: string;
	content: string;
}
