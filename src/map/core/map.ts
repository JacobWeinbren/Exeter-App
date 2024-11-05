import maplibregl from "maplibre-gl";

export const createMap = async (token: string) => {
	const mapData = JSON.parse(
		document.getElementById("mapData")?.dataset.processed || "{}"
	);
	const { mask, clippedGeojson, exeterMultiPolygon } = mapData;

	const basemapEnum = "ab632d914d9d46a7826d5ae61d11c1e4";

	const map = new maplibregl.Map({
		container: "map",
		style: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${token}`,
		zoom: 15,
		minZoom: 14,
		center: [-3.533, 50.736],
		pitch: 0,
		antialias: true,
	});

	map.on("style.load", () => {
		map.addSource("inverse-mask", {
			type: "geojson",
			data: mask,
		});

		map.addSource("buildings", {
			type: "geojson",
			data: JSON.parse(clippedGeojson),
		});

		map.addSource("biodiversity-points", {
			type: "geojson",
			data: `https://services5.arcgis.com/N6Nhpnxaedla81he/arcgis/rest/services/Biodiversity_Point_new/FeatureServer/0/query?f=geojson&where=1=1&token=${token}`,
		});

		// Add OSM vector source for labels
		map.addSource("osm", {
			type: "vector",
			url: "https://tiles.stadiamaps.com/data/openmaptiles.json",
		});

		// Get the first symbol layer ID from the basemap
		const firstSymbolId = map
			.getStyle()
			.layers.find((layer) => layer.type === "symbol")?.id;

		map.addLayer({
			id: "grayscale-overlay",
			type: "fill",
			source: "inverse-mask",
			paint: {
				"fill-color": "#003C32",
				"fill-opacity": 0.7,
			},
		});

		map.addLayer(
			{
				id: "3d-buildings",
				source: "buildings",
				type: "fill-extrusion",
				paint: {
					"fill-extrusion-color": "#E6E6E6",
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
					"fill-extrusion-opacity": 0.7,
				},
			},
			firstSymbolId
		);

		map.addLayer({
			id: "biodiversity",
			type: "circle",
			source: "biodiversity-points",
			paint: {
				"circle-radius": 5,
				"circle-color": "#4CAF50",
				"circle-opacity": 1,
				"circle-stroke-width": 2,
				"circle-stroke-color": "#fff",
				"circle-stroke-opacity": 0,
			},
		});

		// Add label layers after buildings
		map.addLayer({
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
				"text-opacity": ["case", ["within", exeterMultiPolygon], 1, 0],
				"text-halo-color": "#fff",
				"text-halo-width": 2,
			},
		});

		function testPitch() {
			const currentPitch = map.getPitch();
			const opacity = Math.min(0.7, 0.0 + (currentPitch / 45) * 0.7);
			map.setPaintProperty(
				"3d-buildings",
				"fill-extrusion-opacity",
				opacity
			);
		}

		testPitch();

		map.on("pitch", () => {
			testPitch();
		});
	});

	return map;
};
