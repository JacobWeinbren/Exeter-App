import esriConfig from "@arcgis/core/config";
import OauthInfo from "@arcgis/core/identity/OAuthInfo";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";

interface CustomWindow extends Window {
	MAP_URL: string;
}

declare let window: CustomWindow;

export const initConfig = async () => {
	esriConfig.portalUrl = "https://uoe.maps.arcgis.com";
	esriConfig.assetsPath = "https://js.arcgis.com/4.30/@arcgis/core/assets";

	window.MAP_URL =
		"https://services5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/Biodiversity_Point_new/FeatureServer";

	const info = new OauthInfo({
		appId: import.meta.env.PUBLIC_ARCGIS_APP_ID,
		popup: false,
		portalUrl: esriConfig.portalUrl,
		authNamespace: "/",
		flowType: "auto",
	});

	IdentityManager.registerOAuthInfos([info]);

	try {
		await IdentityManager.getCredential(`${esriConfig.portalUrl}/sharing`);
		await new Portal().load();
	} catch (error) {
		console.error(error);
		throw error;
	}
};
