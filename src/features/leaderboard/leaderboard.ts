import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import $ from "jquery";

export const initLeaderboard = async (): Promise<void> => {
	const featureLayer = new FeatureLayer({ url: (window as any).MAP_URL });
	const query = new FeatureLayer().createQuery();
	query.where = `CreationTime >= '${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}'`;
	query.outFields = ["CreatorID"];

	const results = await featureLayer.queryFeatures(query);
	const contributors = Object.entries(
		results.features.reduce(
			(acc, feature) => {
				const name = feature.attributes?.CreatorID;
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
            <li class="flex items-center justify-between p-4 transition-all rounded-lg hover:bg-gray-100">
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
