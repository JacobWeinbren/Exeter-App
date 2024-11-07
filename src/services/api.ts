import type { AttachmentInfo } from "@/types/map";
import type { MapFeature } from "@/types/map";
import type { CustomWindow } from "@/types";

let MAP_URL: string | null = null;
let authToken: string | null = null;

export const initialiseApi = (token: string) => {
	MAP_URL = (window as unknown as CustomWindow).MAP_URL;
	if (!MAP_URL) throw new Error("MAP_URL not initialized");
	authToken = token;
};

export const fetchAttachments = async (
	objectId: string
): Promise<AttachmentInfo[]> => {
	if (!authToken || !MAP_URL) throw new Error("API not initialized");

	try {
		const response = await fetch(
			`${MAP_URL}/0/attachments/${objectId}?f=json&token=${authToken}`
		);
		const data = await response.json();
		return data.attachmentInfos || [];
	} catch (error) {
		console.error("Error fetching attachments:", error);
		return [];
	}
};

export const getAttachmentUrl = (
	objectId: string,
	attachmentId: string
): string => {
	if (!authToken || !MAP_URL) throw new Error("API not initialized");
	return `${MAP_URL}/0/attachments/${objectId}/${attachmentId}?token=${authToken}`;
};

export const fetchBiodiversityData = async (): Promise<
	GeoJSON.FeatureCollection<any, MapFeature>
> => {
	if (!authToken || !MAP_URL) throw new Error("API not initialized");

	const response = await fetch(
		`${MAP_URL}/0/query?f=geojson&where=1=1&outFields=*&token=${authToken}`
	);
	const data = await response.json();
	return data as GeoJSON.FeatureCollection<any, MapFeature>;
};
