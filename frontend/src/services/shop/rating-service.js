import { getMethod, postMethod } from "../api-service";
import { buildFilter } from "../common";

export const RATING_SERVICE = {
	create: async (data) => {
		return await postMethod('rating/store', data);
	},

	getList: async (params) => {
		let filters = await buildFilter(params);
		return await getMethod('rating', filters);
	},

	show: async (id) => {
		return await getMethod('rating/show/' + id);
	}
}
