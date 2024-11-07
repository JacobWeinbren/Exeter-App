import esriConfig from "@arcgis/core/config";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";
import type { CustomWindow } from "@/types";

// Constants
const PORTAL_URL = "https://uoe.maps.arcgis.com";
const ASSETS_PATH = "https://js.arcgis.com/4.30/@arcgis/core/assets";
const MAP_URL =
	"https://services5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/Biodiversity_Points_Revised/FeatureServer";

// Types
export interface MapConfig {
	token: string;
	portalUrl: string;
	mapUrl: string;
}

// Initialise configuration
export const initConfig = async (): Promise<MapConfig> => {
	// Setup basic configurations
	esriConfig.portalUrl = PORTAL_URL;
	esriConfig.assetsPath = ASSETS_PATH;

	// Setup OAuth
	const oauthInfo = new OAuthInfo({
		appId: import.meta.env.PUBLIC_ARCGIS_APP_ID,
		popup: false,
		portalUrl: PORTAL_URL,
		authNamespace: "/",
		flowType: "auto",
	});

	IdentityManager.registerOAuthInfos([oauthInfo]);

	try {
		// Authenticate and get credentials
		const credential = await IdentityManager.getCredential(
			`${PORTAL_URL}/sharing`
		);
		await new Portal().load();

		// Store MAP_URL in window object
		(window as unknown as CustomWindow).MAP_URL = MAP_URL;

		return {
			token: credential.token,
			portalUrl: PORTAL_URL,
			mapUrl: MAP_URL,
		};
	} catch (error) {
		console.error("Authentication failed:", error);
		throw error;
	}
};
