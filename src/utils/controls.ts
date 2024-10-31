import MapView from "@arcgis/core/views/MapView";
import $ from "jquery";

export const initControls = (view: MapView): void => {
	// Initialise zoom controls
	$("#zoomIn").on("click", () => zoomMap(view, 1));
	$("#zoomOut").on("click", () => zoomMap(view, -1));

	// Initialise panel toggles
	$("#leaderboardToggle").on("click", toggleLeaderboard);
	$("#chartToggle").on("click", toggleChart);
	$("#legendToggle").on("click", toggleLegend);

	// Initialise resize handler and run it immediately
	$(window).on("resize", handleResize);
	handleResize();
};

// Simple zoom function with animation
const zoomMap = (view: MapView, delta: number): void => {
	view.goTo({ zoom: view.zoom + delta }, { duration: 150 });
};

// Simple chart toggle
const toggleChart = (): void => {
	$("#chartContainer").toggleClass("translate-y-full");
};

const toggleLeaderboard = (): void => {
	const leaderboard = $("#leaderboardContainer");
	const isShowing = leaderboard.hasClass("-translate-x-full");
	const isLargeScreen = window.innerWidth >= 1024;
	const legendTranslateClass = "-translate-y-[calc(100%+0.5rem)]";

	// Toggle leaderboard and adjust related elements
	leaderboard.toggleClass("-translate-x-full");
	$(".moveable").toggleClass("translate-x-56");
	$("#map, #chartContainer, #legend").toggleClass("brightness-75");

	// Handle chart and legend visibility
	if (isShowing) {
		$("#chartContainer").addClass("translate-y-full");
		$("#legend").addClass(legendTranslateClass);
	} else {
		if (isLargeScreen) $("#legend").removeClass(legendTranslateClass);
		$("#chartContainer").addClass("translate-y-full");
	}
};

const handleResize = (): void => {
	const legend = $("#legend");
	const isLargeScreen = window.innerWidth >= 1024;
	const translateClass = "-translate-y-[calc(100%+0.5rem)]";

	if (isLargeScreen) {
		legend.removeClass(translateClass);
	} else if (!legend.hasClass("is-visible")) {
		legend.addClass(translateClass);
	}

	setTimeout(() => {
		legend.addClass("transition-all");
	}, 150);
};

const toggleLegend = (): void => {
	const legend = $("#legend");
	legend.toggleClass("-translate-y-[calc(100%+0.5rem)]");
	legend.toggleClass("is-visible");
};
