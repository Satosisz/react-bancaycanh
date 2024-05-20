// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCategoriesByFilter } from "../../services/categoryService";
import { Categories } from "../../components/Category/Category";
import { timeDelay } from "../../services/common";
import { toggleShowLoading } from "../../redux/actions/common";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs";

export const CategoryContainer = () =>
{

	const [ datas, setDatas ] = useState( [] );
	const [ total, setTotal ] = useState( [] );
	const [ paging, setPaging ] = useState( {
		page: 0,
		pageSize: 20
	} );
	const [ params, setParams ] = useState( {} );
	const dispatch = useDispatch();

	useEffect( () =>
	{
		getDatasByFilter( paging );
	}, [] );

	const getDatasByFilter = async ( filter ) =>
	{
		const rs = await getCategoriesByFilter( filter, dispatch );
		await timeDelay( 1500 );
		dispatch( toggleShowLoading( false ) );
		if ( rs )
		{
			setDatas( rs.content );
			setPaging( rs.pageable );
			setTotal( rs.totalElements );
		}
	}

	const routes = [
		{
			name: 'Danh mục',
			route: '/category'
		},
		{
			name: 'Danh sách',
			route: '/category/list'
		}
	]
	return ( <>
		<Breadcrumbs routes={routes} title={"Danh mục"} />
		<Categories
			datas={ datas }
			paging={ paging }
			params={ params }
			getDatasByFilter={ getDatasByFilter }
			setParams={ setParams }
			setPaging={ setPaging }
			setDatas={ setDatas }
			total={ total }
			setTotal={ setTotal }
		/>
	</> )
};
