// @ts-nocheck
import React from "react";
import {
    Table
} from "reactstrap";
import Widget from "../Widget/Widget.js";

import { Pagination } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { customDate } from "../../helpers/common/common.js";
import { EMPTY_IMG } from "../../helpers/constant/image.js";
import s from "../../pages/tables/Tables.js";
import { buildImage, onErrorUser } from "../../services/common.js";
import { UserSearch } from "./UserSearch.js";
export const UserCpn = ( props ) =>
{
	console.log(props);
	const genStatus = ( status ) =>
	{
		switch ( status )
		{
			case 1: {
				return <div className="text-success">Active</div>
			}
			default: return <div className="text-warning">Inactive</div>
		}
	}

	const renderRole = ( roles ) =>
	{
		if ( roles && roles.length > 0 )
		{
			return roles.map( item =>
			{
				return (
					<span className="badge badge-info mr-2">{ item.guard_name }</span>
				)
			} )
		}
	}
	return (
		<>
			<Widget>
				<div className="p-5">
					{/* <div className="mb-3">
						<Link to="/user/create" className="btn btn-info">
							<span className="d-flex align-items-center"><i className="eva eva-plus mr-2"></i> Thêm mới</span>
						</Link>
					</div> */}
					<UserSearch { ...props } />
				</div>
			</Widget >
			<Widget>
				<div className="widget-table-overflow p-5 mt-4">
					<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
						<thead>
							<tr>
								<th>#</th>
								<th className="text-nowrap">HÌNH ĐẠI DIỆN</th>
								<th className="text-nowrap">Thông tin</th>
								{/* <th className="text-nowrap">User name</th> */}
								<th className="text-nowrap">Email</th>
								<th className="text-nowrap">Thao tác</th>
							</tr>
						</thead>
						<tbody>
							{
								props.listData?.length > 0 && props.listData.map( ( item, key ) =>
								{
									return (
										< tr key={ key } className="table-product">
											<td className="text-gray-900 text-center">{ props.paging.pageNumber * props.paging.pageSize + ( key + 1 ) }</td>
											<td className="d-flex align-items-center">
												<img width="70" height="70"
													style={ { border: "0.5px solid gray", borderRadius: '5px' } }
													src={ buildImage(item.avatar)} alt={ item.name } onError={ onErrorUser } />
											</td>
											<td className="text-gray-900">
												<div className="d-flex">
													<div className="font-weight-bold " style={ { minWidth: "100px" } }>Họ và tên:</div>
													<div className="ml-2 text-break" style={ { minWidth: '120px' } }>{ item.name }</div>
												</div>
												<div className="d-flex my-2">
													<div className="font-weight-bold" style={ { minWidth: "100px" } }>Giới tính:</div>
													<div className="ml-2 text-break" style={ { minWidth: '100px' } }>
														{ item.gender ? item.gender.toUpperCase() : '' }
													</div>
												</div>
												<div className="d-flex">
													<div className="font-weight-bold" style={ { minWidth: "100px" } }>Ngày sinh:</div>
													<div className="ml-2 text-break" style={ { minWidth: '100px' } }>
														{ item.birthday ? customDate( item.birthday, 'DD/MM/YYYY' ) : 'N/A' }
													</div>
												</div>
												<div className="d-flex mt-2">
													<div className="font-weight-bold" style={ { minWidth: "100px" } }>Số điện thoại:</div>
													<div className="ml-2 text-break" style={ { minWidth: '100px' } }>{ item.phone || 'N/A' }</div>
												</div>
											</td>
											{/* <td className="text-gray-900">
												{ item.username }
											</td> */}
											<td className="text-gray-900">
												{ item.email }
											</td>
											{/* <td className="text-gray-900 text-break" style={ { minWidth: "100px" } }>
												{ item.roles?.length > 0 &&
													<div className="d-flex">
														{ renderRole( item.roles ) }
													</div>
												}
											</td> */}
											<td>
												<Link to={ `/user/edit/${ item.id }` } className="d-flex justify-content-center">
													<i className="eva eva-edit" style={ { fontSize: "16px", border: "1px solid" } }></i>
												</Link>
											</td>
										</tr>
									)
								}
								) }

							{
								( !props.listData || props.listData?.length <= 0 ) &&
								<tr>
									<td colSpan={ 9 } style={ { textAlign: "center", backgroundColor: '#ffff' } }>
										<img className="text-center" src={ EMPTY_IMG } style={ { width: "300px", height: "300px" } } />
										<div style={ { color: "#9A9A9A" } }>Dữ liệu trống</div>
									</td>
								</tr>
							}


						</tbody>
					</Table>
					{
						props.total > 0 &&
						<div className="mx-auto d-flex justify-content-center my-4">
							<Pagination
								onChange={ e =>
									props.getListData( { pageSize: props.paging.pageSize, page: e, ...props.params } )
								}
								pageSize={ props.paging.pageSize }
								defaultCurrent={ props.paging.pageNumber + 1}
								total={ props.total }
							/>
						</div>
					}
				</div>

			</Widget >
		</>

	)
}
