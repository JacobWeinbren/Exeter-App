import $ from "jquery";

const legendItems = [
	{
		id: "conservation",
		label: "Conservation",
		subpoints: [
			{
				text: "Wildlife Habitats",
				emoji: "🏡",
				count: 12,
				colour: "#2E86AB",
			},
			{
				text: "Natural Barriers",
				emoji: "🌳",
				count: 8,
				colour: "#A23B72",
			},
			{
				text: "Nesting Sites",
				emoji: "🪺",
				count: 15,
				colour: "#F18F01",
			},
		],
	},
	{
		id: "restoration",
		label: "Restoration",
		subpoints: [
			{
				text: "Insect Shelters",
				emoji: "🐝",
				count: 20,
				colour: "#C73E1D",
			},
			{
				text: "Small Mammal Homes",
				emoji: "🦊",
				count: 6,
				colour: "#3B1F2B",
			},
			{
				text: "Natural Debris",
				emoji: "🍂",
				count: 18,
				colour: "#4B3F72",
			},
		],
	},
	{
		id: "species",
		label: "Species",
		subpoints: [
			{ text: "Spotting", emoji: "👀", count: 25, colour: "#44633F" },
			{
				text: "Sign of Animal",
				emoji: "🦶",
				count: 30,
				colour: "#5C4742",
			},
		],
	},
];

export function initLegend() {
	const legendHtml = `
    <h3 class="mb-3 text-sm font-semibold">Wildly Accurate - Biodiversity Interventions</h3>
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
                <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${subpoint.colour};"></span>
                <span>${subpoint.text} ${subpoint.emoji}</span>
              </div>
              <span class="font-bold">${subpoint.count}</span>
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
	$('.category-points[data-category="conservation"]').show();
	$('.category-btn[data-category="conservation"]').addClass(
		"ring-2 ring-offset-2"
	);

	$(".category-btn").on("click", function () {
		const category = $(this).data("category");
		$(".category-btn").removeClass("ring-2 ring-offset-2");
		$(this).addClass("ring-2 ring-offset-2");
		$(".category-points").hide();
		$(`.category-points[data-category="${category}"]`).show();
	});
}
