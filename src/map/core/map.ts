import type { CustomWindow } from "@/types";
import type { MapConfig } from "@/config/config";
import { EMOJI_MAP, MAP_CONSTANTS } from "@/constants/map";
import { initialiseApi, fetchBiodiversityData } from "@/services/api";
import { setupInteractions } from "@/map/interactions/interactions";
import maplibregl from "maplibre-gl";
import { initLeaderboard } from "@/features/leaderboard/leaderboard";
import { initLegend } from "@/features/legend/legend";
import $ from "jquery";
import { legendItems } from "@/features/legend/legend";
import { hidePopup } from "@/features/popup/popup";
import { clearExistingHighlight } from "../interactions/highlight";

export const BIODIVERSITY_DATA_LOADED_EVENT = "biodiversityDataLoaded";

interface MapData {
	clippedGeojson: string;
	exeterMultiPolygon: GeoJSON.MultiPolygon;
}

export const createMap = async (config: MapConfig): Promise<maplibregl.Map> => {
	const mapData = getMapData();
	const map = initialiseMap(config.token);

	// Store instances in window object
	(window as unknown as CustomWindow).map = map;
	(window as unknown as CustomWindow).token = config.token;

	await setupMapLayers(map, mapData);

	return map;
};

const getMapData = (): MapData => {
	const mapDataElement = document.getElementById("mapData");
	if (!mapDataElement?.dataset.processed) {
		throw new Error("Map data not found");
	}
	return JSON.parse(mapDataElement.dataset.processed);
};

const initialiseMap = (token: string): maplibregl.Map => {
	const basemapEnum = "9f7e19f3e4804409918d9513570a011b";

	return new maplibregl.Map({
		container: "map",
		style: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${token}`,
		zoom: MAP_CONSTANTS.DEFAULT_ZOOM,
		minZoom: MAP_CONSTANTS.MIN_ZOOM,
		center: MAP_CONSTANTS.DEFAULT_CENTER,
		pitch: 0,
		antialias: true,
	});
};

const addMapLayers = (map: maplibregl.Map, mapData: MapData) => {
	// Get the first symbol layer ID from the basemap
	const firstSymbolId = map
		.getStyle()
		.layers.find((layer) => layer.type === "symbol")?.id;

	map.addLayer(
		{
			id: "3d-buildings",
			source: "buildings",
			type: "fill-extrusion",
			paint: {
				"fill-extrusion-color": "#e7e2c5",
				"fill-extrusion-height": [
					"case",
					[
						"all",
						["has", "height"],
						["!=", ["get", "height"], null as any],
					],
					["*", ["get", "height"], 3.28084],
					20,
				],
				"fill-extrusion-base": 0,
				"fill-extrusion-opacity": 0,
			},
		},
		firstSymbolId
	);

	map.addLayer({
		id: "biodiversity-points-highlight",
		type: "circle",
		source: "biodiversity-points",
		paint: {
			"circle-radius": 15,
			"circle-color": "#ffffff",
			"circle-opacity": 0.3,
			"circle-stroke-width": 2,
			"circle-stroke-color": "#ffffff",
			"circle-stroke-opacity": 1,
		},
	});

	map.addLayer({
		id: "biodiversity-points-selected",
		type: "circle",
		source: "biodiversity-points",
		paint: {
			"circle-radius": 15,
			"circle-color": "#007cbf",
			"circle-opacity": 0.3,
			"circle-stroke-width": 2,
			"circle-stroke-color": "#007cbf",
			"circle-stroke-opacity": 1,
		},
	});

	map.addLayer({
		id: "biodiversity-points",
		type: "symbol",
		source: "biodiversity-points",
		layout: {
			"icon-image": [
				"match",
				[
					"slice",
					["to-string", ["get", "SubCategory"]],
					0,
					["-", ["length", ["to-string", ["get", "SubCategory"]]], 2],
				],
				...Object.entries(EMOJI_MAP).flatMap(([key, value]) => [
					key,
					value,
				]),
				EMOJI_MAP["Other Species"],
			] as any,
			"icon-size": 0.5,
			"icon-allow-overlap": true,
			"icon-anchor": "center",
			"icon-offset": [0, 0],
		},
		paint: {
			"icon-opacity": 1,
			"icon-color": "#000000",
		},
	});

	map.addLayer(
		{
			id: "place-labels",
			type: "symbol",
			source: "osm",
			"source-layer": "place",
			layout: {
				"text-field": ["get", "name"],
				"text-font": ["Arial Unicode MS Regular"],
				"text-size": [
					"interpolate",
					["linear"],
					["zoom"],
					8,
					12,
					13,
					14,
					16,
					16,
				],
				"text-anchor": "center",
				"text-allow-overlap": false,
				visibility: "visible",
			},
			paint: {
				"text-color": "#333",
				"text-opacity": [
					"case",
					["within", mapData.exeterMultiPolygon],
					1,
					0,
				],
				"text-halo-color": "#fff",
				"text-halo-width": 2,
			},
		},
		firstSymbolId
	);
};

const addBaseSources = (map: maplibregl.Map, mapData: MapData): void => {
	map.addSource("buildings", {
		type: "geojson",
		data: JSON.parse(mapData.clippedGeojson),
	});

	map.addSource("osm", {
		type: "vector",
		url: "https://tiles.stadiamaps.com/data/openmaptiles.json",
	});
};

const setupMapLayers = async (
	map: maplibregl.Map,
	mapData: MapData
): Promise<void> => {
	map.on("style.load", async () => {
		map.getCanvas().style.cursor = "crosshair";

		// Add base sources
		addBaseSources(map, mapData);

		// Add terrain source and settings
		map.addSource("terrain", {
			type: "raster-dem",
			tiles: [
				"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
			],
			tileSize: 256,
			maxzoom: 15,
			encoding: "terrarium",
		});

		// Enable terrain
		map.setTerrain({ source: "terrain", exaggeration: 1.5 });

		// Initialise API
		initialiseApi((window as unknown as CustomWindow).token);

		// Fetch biodiversity data directly
		const biodiversityData = await fetchBiodiversityData();
		(window as unknown as CustomWindow).biodiversityData = biodiversityData;
		$(document).trigger(BIODIVERSITY_DATA_LOADED_EVENT, {
			biodiversityData,
		});

		// Add biodiversity source
		map.addSource("biodiversity-points", {
			type: "geojson",
			data: biodiversityData,
		});

		// Setup emoji symbols
		setupEmojiSymbols(map);

		// Add map layers
		addMapLayers(map, mapData);

		// Initialise features
		setupInteractions(map);
		initLeaderboard();
		initLegend();

		// Setup 3D building effects
		setupBuildingEffects(map);

		// Track current category and visibility state
		let currentCategory = "intervention";

		// Initialise visibility state with all subcategories set to true
		const visibilityState: Record<string, boolean> = {};
		legendItems.forEach((item) => {
			item.subpoints.forEach((subpoint) => {
				visibilityState[subpoint.text] = true;
			});
		});

		// Listen for category changes
		$(document).on("category-changed", (event, data) => {
			currentCategory = data.category;
			applyFilters();
		});

		// Listen for checkbox changes
		$(document).on("subpoint-visibility-changed", (event, data) => {
			hidePopup();
			clearExistingHighlight();

			const { text, visible } = data;
			visibilityState[text] = visible;
			applyFilters();
		});

		// Function to apply both category and checkbox filters
		const applyFilters = () => {
			const categorySubpoints =
				legendItems
					.find((item) => item.id === currentCategory)
					?.subpoints.map((sp) => sp.text) || [];

			// Create the filter expression
			const filter = [
				"all",
				[
					"==",
					["downcase", ["get", "Category"]],
					currentCategory.toLowerCase(),
				],
				[
					"match",
					["get", "SubCategory"],
					categorySubpoints
						.filter((text) => visibilityState[text])
						.map((text) => {
							const emoji =
								text in EMOJI_MAP
									? EMOJI_MAP[text as keyof typeof EMOJI_MAP]
									: EMOJI_MAP["Other Species"];
							return `${text} ${emoji}`;
						}),
					true,
					false,
				],
			] as any;

			// Apply filter to both main points and highlight layer
			map.setFilter("biodiversity-points", filter);
			map.setFilter("biodiversity-points-highlight", filter);
		};

		applyFilters();
	});
};

const setupEmojiSymbols = (map: maplibregl.Map): void => {
	const createEmojiImage = (emoji: string): HTMLCanvasElement => {
		const size = 64;
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d")!;
		canvas.width = size;
		canvas.height = size;
		ctx.clearRect(0, 0, size, size);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = `${size * 0.75}px Arial`;
		ctx.fillText(emoji, size / 2, size / 2);
		return canvas;
	};

	const uniqueEmojis = [...new Set(Object.values(EMOJI_MAP))];

	uniqueEmojis.forEach((emoji) => {
		try {
			const canvas = createEmojiImage(emoji);
			map.addImage(
				emoji,
				canvas
					.getContext("2d")!
					.getImageData(0, 0, canvas.width, canvas.height)
			);
		} catch (e) {
			console.error(`Failed to load emoji: ${emoji}`, e);
		}
	});
};

const setupBuildingEffects = (map: maplibregl.Map): void => {
	const updateBuildingOpacity = () => {
		const currentPitch = map.getPitch();
		const opacity = Math.min(0.7, 0.0 + (currentPitch / 45) * 0.7);
		map.setPaintProperty("3d-buildings", "fill-extrusion-opacity", opacity);
	};

	updateBuildingOpacity();
	map.on("pitch", updateBuildingOpacity);
};
