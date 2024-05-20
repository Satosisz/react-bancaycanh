// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Transactions } from "../../components/Transaction/Transaction.js";
import { getTransactionsByFilter } from "../../services/transactionService.js";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs.js";

export const TransactionContainer = () =>
{

	const [ transactions, setTransactions ] = useState( [] );
	const [ total, setTotal ] = useState( [] );
	const [ paging, setPaging ] = useState( {
		page: 0,
		pageSize: 20
	} );
	const [ params, setParams ] = useState( {} )
	const dispatch = useDispatch();

	useEffect( () =>
	{
		getTransactionsByFilters( paging, setTransactions, setPaging );
	}, [] );

	const getTransactionsByFilters = async ( filter ) =>
	{
		await getTransactionsByFilter( filter, setTransactions, setPaging, setTotal, dispatch );
	}
	const routes = [
		{
			name: 'Đơn hàng',
			route: '/transaction'
		},
		{
			name: 'Danh sách',
			route: '/'
		},
	]
	return ( <>
		<Breadcrumbs routes={ routes } title={ "Đơn hàng" } />
		<Transactions
			transactions={ transactions }
			paging={ paging }
			total={ total }
			setPaging={ setPaging }
			setTransactions={ setTransactions }
			params={ params }
			setParams={ setParams }
			getTransactionsByFilters={ getTransactionsByFilters }
		/>
	</> )
};
