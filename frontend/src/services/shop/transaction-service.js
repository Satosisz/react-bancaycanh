import { getMethod, postMethod } from '../index';

export const TRANSACTION_SERVICE = {
	create: async (data) => {
		return await postMethod('transaction/store', data);
	},

	getList: async (params) => {
		return await getMethod('transaction', params);
	},

	show: async (id) => {
		return await getMethod('transaction/show/' + id);
	}
}
