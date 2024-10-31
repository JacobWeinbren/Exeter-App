import esriConfig from "@arcgis/core/config";
import OauthInfo from "@arcgis/core/identity/OAuthInfo";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";
import { type CustomWindow } from "@/types";

const MAP_URL =
	"https://services5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/Biodiversity_Point_new/FeatureServer";

export const initConfig = async () => {
	setupEsriConfig();
	setupMapUrl();
	const info = createOAuthInfo();
	IdentityManager.registerOAuthInfos([info]);
	return await authenticate();
};

function setupEsriConfig() {
	esriConfig.portalUrl = "https://uoe.maps.arcgis.com";
	esriConfig.assetsPath = "https://js.arcgis.com/4.30/@arcgis/core/assets";
}

function setupMapUrl() {
	(window as unknown as CustomWindow).MAP_URL = MAP_URL;
}

function createOAuthInfo() {
	return new OauthInfo({
		appId: import.meta.env.PUBLIC_ARCGIS_APP_ID,
		popup: false,
		portalUrl: esriConfig.portalUrl,
		authNamespace: "/",
		flowType: "auto",
	});
}

async function authenticate() {
	try {
		const credential = await IdentityManager.getCredential(
			`${esriConfig.portalUrl}/sharing`
		);
		await new Portal().load();
		return credential.token;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
