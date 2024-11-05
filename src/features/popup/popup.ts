import $ from "jquery";

export const showPopup = (
	title: string,
	content: string,
	imageUrl?: string
): void => {
	$("#popupTitle").text(title);
	$("#popupContent").text(content);

	// Handle image display
	const $popupImage = $("#popupImage");
	if (imageUrl) {
		$popupImage.attr("src", imageUrl).show();
	} else {
		$popupImage.hide();
	}

	$("#popupBox").removeClass("translate-y-full").css("bottom", "1.5rem");
};

export const hidePopup = (): void => {
	$("#popupBox").addClass("translate-y-full").css("bottom", "-1.5rem");
	$("#popupImage").attr("src", "").hide();
};
