export interface CustomWindow extends Window {
	MAP_URL: string;
	TOKEN: string;
	map: maplibregl.Map | null;
	biodiversityData: GeoJSON.FeatureCollection | null;
	clickHighlight: __esri.Handle | null;
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
