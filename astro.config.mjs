// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	site: "https://jacobweinbren.github.io",
	base: "/Exeter-App",
	vite: {
		ssr: {
			noExternal: ["@arcgis/core"],
		},
	},
	integrations: [tailwind()],
});
