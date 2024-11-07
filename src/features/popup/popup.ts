import $ from "jquery";

export const showPopup = (
	title: string,
	content: string,
	imageUrl?: string
): void => {
	const $popup = $("#popupBox");
	const $title = $("#popupTitle");
	const $content = $("#popupContent");
	const $image = $("#popupImage");

	// Set content
	$title.html(title);
	$content.html(content);

	// Handle image
	if (imageUrl) {
		$image
			.attr("src", imageUrl)
			.removeClass("hidden")
			.on("error", function () {
				$(this).addClass("hidden");
			});
	} else {
		$image.addClass("hidden");
	}

	// Show popup with slide up and fade in
	$popup
		.removeClass("invisible")
		.removeClass("translate-y-8 opacity-0")
		.addClass("translate-y-0 opacity-100");
};

export const hidePopup = (): void => {
	const $popup = $("#popupBox");

	// Hide popup with slide down and fade out
	$popup
		.removeClass("translate-y-0 opacity-100")
		.addClass("translate-y-8 opacity-0");
};
