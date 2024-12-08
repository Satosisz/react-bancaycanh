import { getMethod, postMethod, putMethod } from "../api-service"

export const Auth_Service = {
	login: async (data) => {
		return await postMethod('login', data);
	},
	resetPassword: async (data) => {
		return await postMethod('change-password', data);
	},
	register: async (data) => {
		return await postMethod('register', data);
	},
	profile: async () => {
		return await getMethod('profile');
	},
	updateProfile: async (data) => {
		return await putMethod('profile', data);
	},
	changePassword: async (data) => {
		return await putMethod('change-password', data);
	},
	reset: async (data) => {
		return await putMethod('password/reset', data);
	}
}
