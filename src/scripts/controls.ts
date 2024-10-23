import MapView from "@arcgis/core/views/MapView";
import $ from "jquery";

export function initControls(view: MapView) {
	$("#zoomIn").on("click", function () {
		view.goTo(
			{
				zoom: view.zoom + 1,
			},
			{
				duration: 150,
			}
		);
	});

	$("#zoomOut").on("click", function () {
		view.goTo(
			{
				zoom: view.zoom - 1,
			},
			{
				duration: 150,
			}
		);
	});

	$("#leaderboardToggle").on("click", function () {
		console.log("Clicked");
		if ($("leaderboardContainer").hasClass("-translate-x-full")) {
			view.popup.close();
		}

		$("#leaderboardContainer").toggleClass("-translate-x-full");
		$(".moveable").toggleClass("translate-x-56");
		$("#map").toggleClass("brightness-75");
	});
}
