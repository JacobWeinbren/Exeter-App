export interface CustomWindow extends Window {
	MAP_URL: string;
	showPopup: (title: string, content: string) => void;
	hidePopup: () => void;
	clickHighlight: any;
}

export interface BiodiversityFeature {
	type: "Feature";
	geometry: {
		type: "Point";
		coordinates: [number, number];
	};
	properties: {
		OBJECTID: string;
		cluster_count?: number;
	};
}

export interface PopupData {
	title: string;
	content: string;
}
