// @ts-nocheck
import { toggleShowLoading } from "../redux/actions/common";
import { getMethod, putMethod } from "./apiService";
import { buildFilter, timeDelay } from "./common";

export const getTransactions = async (params) => {
	let filters = buildFilter(params);
	return await getMethod('/admin/transaction', filters);
}

export const showTransactionInfo = async (id, params) => {
	return await getMethod(`/admin/transaction/show/${id}`, params);
}

export const getTransactionsByFilter = async (params, setTransactions, setPaging, setTotal, dispatch) => {
	try {
		dispatch(toggleShowLoading(true))
		const response = await getTransactions(params);
		await timeDelay(2000);
		if (response?.status === 'success') {
			setTransactions(response?.data.content);
			setPaging(response?.data.pageable);
			setTotal(response?.data.totalElements);

		} else {
			setTransactions([]);
		}
		dispatch(toggleShowLoading(false))
	} catch (error) {
		console.log(error);
		setTransactions([]);
		dispatch(toggleShowLoading(false))

	}
}

export const getTransactionById = async (id, setTransactionInfo, dispatch) => {
	try {
		if(dispatch) {
			dispatch(toggleShowLoading(true));
		}
		await timeDelay(1000)
		const response = await showTransactionInfo(id);
		if(response?.status === 'success') {
			setTransactionInfo(response?.data);
		} else {
			setTransactionInfo(null);
		}
		if(dispatch) {
			dispatch(toggleShowLoading(false));
		}
	} catch (error) {
		setTransactionInfo(null);
		if(dispatch) {
			dispatch(toggleShowLoading(false));
		}
	}
}

export const updateTransaction = async (id, data) => {
	await timeDelay(1000)
	return await putMethod('/admin/transaction/update/'+id, data);
}
