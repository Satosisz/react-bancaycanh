// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UserCpn } from "../../components/User/User";
import { USER_SERVICE } from "../../services/userService";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs";

export const UserContainer = () =>
{

	const [ listData, setListData ] = useState( [] );
	const [ total, setTotal ] = useState( [] );
	const [ paging, setPaging ] = useState( {
		page: 0,
		pageSize: 20
	} );
	const [ params, setParams ] = useState( {} );
	const dispatch = useDispatch();

	useEffect( () =>
	{
		getListData( paging );
	}, [] );

	const getListData = async ( filter ) =>
	{
		const response = await USER_SERVICE.getListData( filter, dispatch );
		if ( response )
		{
			setListData( response.content );
			setPaging( response.pageable );
			setTotal( response.totalElements );
		} else
		{
			setListData( [] );
		}
	}

	const routes = [
		{
			name: 'Người dùng',
			route: '/user/list'
		},
		{
			name: 'Danh sách',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Người dùng" } /> <UserCpn
				listData={ listData }
				paging={ paging }
				params={ params }
				getListData={ getListData }
				setParams={ setParams }
				setPaging={ setPaging }
				setListData={ setListData }
				total={ total }
			/>
		</> )
};
