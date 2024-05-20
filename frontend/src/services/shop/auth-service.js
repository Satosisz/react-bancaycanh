import { getMethod, postMethod, putMethod } from "../api-service"

export const Auth_Service = {
	login: async (data) => {
		return await postMethod('user/auth/login', data);
	},
	resetPassword: async (data) => {
		return await postMethod('user/auth/change-password', data);
	},
	register: async (data) => {
		return await postMethod('user/auth/register', data);
	},
	profile: async () => {
		return await getMethod('user/auth/profile');
	},
	updateProfile: async (data) => {
		return await putMethod('user/auth/profile', data);
	},
	changePassword: async (data) => {
		return await putMethod('user/auth/change-password', data);
	},
	reset: async (data) => {
		return await putMethod('user/auth/password/reset', data);
	}
}
