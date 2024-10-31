import $ from "jquery";

export const showPopup = (title: string, content: string): void => {
	$("#popupTitle").text(title);
	$("#popupContent").text(content);
	$("#popupBox").removeClass("translate-y-full").css("bottom", "1.5rem");
};

export const hidePopup = (): void => {
	$("#popupBox").addClass("translate-y-full").css("bottom", "-1.5rem");
};
