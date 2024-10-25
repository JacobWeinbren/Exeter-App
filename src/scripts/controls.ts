import type MapView from "@arcgis/core/views/MapView";
import $ from "jquery";

export function initControls(view: MapView) {
	$("#zoomIn").on("click", () => {
		view.goTo(
			{
				zoom: view.zoom + 1,
			},
			{
				duration: 150,
			}
		);
	});

	$("#zoomOut").on("click", () => {
		view.goTo(
			{
				zoom: view.zoom - 1,
			},
			{
				duration: 150,
			}
		);
	});

	$("#leaderboardToggle").on("click", () => {
		if ($("leaderboardContainer").hasClass("-translate-x-full")) {
			view.popup.close();
		}

		$("#leaderboardContainer").toggleClass("-translate-x-full");
		$(".moveable").toggleClass("translate-x-56");
		$("#map, #chartContainer").toggleClass("brightness-75");
	});
}
