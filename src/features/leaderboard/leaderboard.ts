import $ from "jquery";
import type { CustomWindow } from "@/types";

export const initLeaderboard = async (): Promise<void> => {
	const customWindow = window as unknown as CustomWindow;
	const geojsonData = customWindow.biodiversityData;

	if (!geojsonData) {
		console.error("Biodiversity data not loaded");
		return;
	}

	// Calculate contributions from the last 7 days
	const sevenDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
	const recentFeatures = geojsonData.features.filter(
		(feature) => feature.properties?.CreationTime >= sevenDaysAgo
	);

	const contributors = Object.entries(
		recentFeatures.reduce(
			(acc, feature) => {
				const name = feature.properties?.CreatorID;
				if (name) acc[name] = (acc[name] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		)
	)
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10);

	$("#leaderboardList").html(
		contributors
			.map(
				(contributor, index) => `
            <li class="flex items-center justify-between p-2 transition-all rounded-lg hover:bg-gray-100">
                <div class="flex items-center space-x-2">
                    <span class="text-sm font-bold text-gray-700">${index + 1}</span>
                    <span class="text-sm font-bold text-gray-700">${contributor.name}</span>
                </div>
                <span class="text-sm text-gray-600">${contributor.count * 10} XP</span>
            </li>
        `
			)
			.join("")
	);
};
