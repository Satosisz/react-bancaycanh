import React, { useEffect, useState } from 'react';
import Widget from '../Widget/Widget.js';
import {  Pagination, message } from 'antd';
import
{
	Button,
	Table
} from "reactstrap";
import { StarIcons } from './star.js';
import { useDispatch } from 'react-redux';
import { toggleShowLoading } from '../../redux/actions/common.js';
import { timeDelay } from '../../services/common.js';
import s from "../../pages/tables/Tables.js";
import { RATING_SERVICE_CMS } from '../../services/ratingService'
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs.js';

export const PageVoting = () =>
{

	const [ paging, setPaging ] = useState( {
		page: 0,
		pageSize: 20,
		total: 0
	} );

	const dispatch = useDispatch();
	const [ dataList, setDataList ] = useState( [] );

	useEffect( () =>
	{
		getDataList( { page: paging.page, pageSize: paging.pageSize } ).then( r => { } );
	}, [] );

	const getDataList = async ( filters ) =>
	{
		try
		{
			dispatch( toggleShowLoading( true ) );
			const response = await RATING_SERVICE_CMS.getLists( filters );
			await timeDelay( 500 );
			if ( response?.status === 'success' || response?.status === 200 )
			{
				setDataList( response?.data?.content );
				setPaging( response?.data?.pageable )
			}
			dispatch( toggleShowLoading( false ) );
		} catch ( error )
		{
			console.log( error );
			dispatch( toggleShowLoading( false ) );
		}

	}

	const handleDelete = async ( id ) =>
	{
		console.log(id);
		dispatch( toggleShowLoading( true ) );
		const response = await RATING_SERVICE_CMS.delete( id );
		await timeDelay(500)
		if ( response?.status === 'success' || response?.status === 200 )
		{
			message.success( 'Xóa đánh giá thành công!' );
			await getDataList( { page: 0, pageSize: 20 } ).then( r => { } );
		} else
		{
			message.error( response?.message || 'Delete review failed!' );
		}
		dispatch( toggleShowLoading( false ) );
	}
	const routes = [
		{
			name: 'Đánh giá',
			route: '/reviews'
		},
		{
			name: 'Danh sách',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Đánh giá" } />
		<Widget>
			<div className="widget-table-overflow p-5 mt-4">
				<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
					<thead>
						<tr>
							<th>#</th>
							<th>Khách hàng</th>
							<th>Sản phẩm</th>
							<th className='text-nowrap'>Số sao đánh giá</th>
							<th>Nội dung</th>
							<th>Hành động</th>
						</tr>
					</thead>
					<tbody>
						{ dataList.length > 0 ? dataList.map( ( item, key ) =>
						{
							return (
								<tr key={ key }>
									<td className='align-middle'>{ key + 1 }</td>
									<td className='text-nowrap align-middle'>
										{ item?.user?.name || 'N/A' }
										{/* <Link className={ '' }
													to={ `/rating/update/${ item._id }` } >

												</Link> */}
									</td>
									<td className='align-middle' style={{maxWidth: '100px'}}>{ item?.product?.pro_name || 'N/A' }</td>
									<td className='align-middle text-nowrap'>
										<StarIcons rating_number={ item?.r_number } />
									</td>
									<td className='text-break' style={ { maxWidth: '200px' } }>{ item.r_content }</td>
									<td className='align-middle'>
										<Button className='btn btn-danger'
											onClick={ () => handleDelete( item.id ) }>
											XÓA
										</Button>{ ' ' }
									</td>
								</tr>
							)
						} )
							:
							<tr>
								<td className='text-center' colSpan={ 8 }>Không có dữ liệu</td>
							</tr>
						}

					</tbody>
				</Table>
			</div>
			{
				paging?.total > 0 &&
				<div className="mx-auto d-flex justify-content-center my-4">
					<Pagination
						onChange={ e =>
							getDataList( { ...paging, page: e } )
						}
						pageSize={ paging.pageSize }
						defaultCurrent={ paging.page }
						total={ paging.total }
					/>
				</div>
			}
		</Widget>
		</>
	);
}
