import type MapView from "@arcgis/core/views/MapView";
import $ from "jquery";

// Initialises all map controls and panel toggles
export function initControls(view: MapView) {
	setupZoomControls(view);
	setupPanelToggles();
}

// Sets up the zoom in/out button click handlers
function setupZoomControls(view: MapView) {
	$("#zoomIn").on("click", () => handleZoom(view, 1));
	$("#zoomOut").on("click", () => handleZoom(view, -1));
}

// Handles map zoom animation with specified zoom level change
function handleZoom(view: MapView, delta: number) {
	view.goTo({ zoom: view.zoom + delta }, { duration: 150 });
}

// Initialises click handlers for leaderboard and chart panel toggles
function setupPanelToggles() {
	$("#leaderboardToggle").on("click", toggleLeaderboard);
	$("#chartToggle").on("click", toggleChart);
}

// Toggles leaderboard panel visibility and adjusts related elements
function toggleLeaderboard() {
	$("#leaderboardContainer").toggleClass("-translate-x-full");
	$(".moveable").toggleClass("translate-x-56");
	$("#map, #chartContainer").toggleClass("brightness-75");
}

// Toggles chart panel visibility using vertical translation
function toggleChart() {
	$("#chartContainer").toggleClass("translate-y-full");
}
