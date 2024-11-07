import $ from "jquery";
import type { CustomWindow } from "@/types";
import { BIODIVERSITY_DATA_LOADED_EVENT } from "@/map/core/map";
import { EMOJI_MAP } from "@/constants/map";

function calculateAllSubcategoryCounts(): Record<string, number> {
	const biodiversityData = (window as unknown as CustomWindow)
		.biodiversityData;
	if (!biodiversityData?.features) return {};

	return biodiversityData.features.reduce(
		(counts, feature: GeoJSON.Feature<any, any>) => {
			const subcategory = feature.properties?.SubCategory;
			if (subcategory) {
				counts[subcategory] = (counts[subcategory] || 0) + 1;
			}
			return counts;
		},
		{} as Record<string, number>
	);
}

export const legendItems = [
	{
		id: "intervention",
		label: "Intervention",
		subpoints: [
			{
				text: "Wildlife Home",
				emoji: EMOJI_MAP["Wildlife Home"],
				colour: "#3B82F6",
			},
			{
				text: "Natural Barrier",
				emoji: EMOJI_MAP["Natural Barrier"],
				colour: "#F97316",
			},
			{
				text: "Wood Features",
				emoji: EMOJI_MAP["Wood Feature"],
				colour: "#84CC16",
			},
			{
				text: "Meadows & Grassland",
				emoji: EMOJI_MAP["Meadows & Grassland"],
				colour: "#EAB308",
			},
			{
				text: "Other Intervention",
				emoji: EMOJI_MAP["Other Intervention"],
				colour: "#8B5CF6",
			},
		],
	},
	{
		id: "observation",
		label: "Observation",
		subpoints: [
			{
				text: "Plant",
				emoji: EMOJI_MAP["Plant"],
				colour: "#22C55E",
			},
			{
				text: "Bird",
				emoji: EMOJI_MAP["Bird"],
				colour: "#FB923C",
			},
			{
				text: "Other Animal",
				emoji: EMOJI_MAP["Other Animal"],
				colour: "#FB923C",
			},
			{
				text: "Animal Trace",
				emoji: EMOJI_MAP["Animal Traces"],
				colour: "#8B5CF6",
			},
			{
				text: "Other Species",
				emoji: EMOJI_MAP["Other Species"],
				colour: "#EAB308",
			},
		],
	},
];

export function initLegend() {
	// Listen for biodiversity data loaded event
	$(document).on(BIODIVERSITY_DATA_LOADED_EVENT, () => {
		const subcategoryCounts = calculateAllSubcategoryCounts();
		renderLegend(subcategoryCounts);
	});
}

function renderLegend(subcategoryCounts: Record<string, number>) {
	const legendHtml = `
		<h3 class="mb-3 text-sm font-semibold">Wildly Accurate</h3>
		<div class="flex flex-wrap gap-2 mb-3">
			${legendItems
				.map(
					(item) => `
				<button data-category="${item.id}" class="px-3 py-1 text-sm bg-white border border-black rounded-full category-btn">
					${item.label}
				</button>
			`
				)
				.join("")}
		</div>
		<div class="mb-3 space-y-2">
			${legendItems
				.map(
					(item) => `
				<div class="text-xs category-points" data-category="${item.id}">
					${item.subpoints
						.map(
							(subpoint) => `
						<div class="flex items-center justify-between gap-2 ml-2">
							<div class="flex items-center gap-2 text-sm">
								<input type="checkbox" class="subpoint-checkbox" 
									data-category="${item.id}" 
									data-text="${subpoint.text}"
									checked
								>
								<span>${subpoint.emoji} ${subpoint.text}</span>
							</div>
							<span class="font-bold">${subcategoryCounts[`${subpoint.text} ${subpoint.emoji}`] || 0}</span>
						</div>
					`
						)
						.join("")}
				</div>
			`
				)
				.join("")}
		</div>
		<div class="pt-2 text-xs text-gray-500 border-t">
			<div>Data from <a class="underline" href="https://www.exeter.ac.uk/" target="_blank">Exeter University</a>.</div>
			<a class="underline" href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>
		</div>
	`;

	$("#legend").html(legendHtml);
	$(".category-points").hide();
	$('.category-points[data-category="intervention"]').show();
	$('.category-btn[data-category="intervention"]').addClass(
		"ring-2 ring-offset-2"
	);

	$(".subpoint-checkbox").on("change", function () {
		const category = $(this).data("category");
		const text = $(this).data("text");
		const isChecked = $(this).is(":checked");

		// Emit a custom event that the map can listen to
		$(document).trigger("subpoint-visibility-changed", {
			category,
			text,
			visible: isChecked,
		});
	});

	$(".category-btn").on("click", function () {
		const selectedCategory = $(this).data("category");

		// Update UI
		$(".category-btn").removeClass("ring-2 ring-offset-2");
		$(this).addClass("ring-2 ring-offset-2");
		$(".category-points").hide();
		$(`.category-points[data-category="${selectedCategory}"]`).show();

		// Emit event for category change
		$(document).trigger("category-changed", { category: selectedCategory });
	});

	// Trigger initial category selection
	$(document).trigger("category-changed", { category: "intervention" });
}
