import { getMethod } from '../index'

export const MENU_SERVICE = {
	list: async () => {
		try {
			const response = await getMethod('menu');

			if (response?.status === 'success') {
				return response?.content;
			}
		} catch (error) {
			console.log(error);
		}
	}
}
