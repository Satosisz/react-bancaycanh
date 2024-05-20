// @ts-nocheck
import React, { useState } from "react";
import
{
	Table
} from "reactstrap";
import Widget from "../Widget/Widget.js";

import s from "../../pages/tables/Tables.js";
import { customDate, customNumber } from "../../helpers/common/common.js";
import { ProductSearch } from "./ProductSearch.js";
import { Pagination ,message } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { EMPTY_IMG } from "../../helpers/constant/image.js";
import { buildImage, onErrorImage } from "../../services/common.js";
import { Product } from "../../services/productService.js";
import { DeleteOutlined } from "@ant-design/icons";
export const Products = ( props ) =>
{
	const genStatus = ( status ) =>
	{
		switch ( status )
		{
			case 1: {
				return <div className="text-success">Hoạt động</div>
			}
			default: return <div className="text-warning">Không hoạt động</div>
		}
	}

	const deleteData = async ( id ) =>
		{
			try
			{
				const rs = await Product.delete( id );
				if ( rs && rs.status === 'success' )
				{
					message.success( 'Delete successfully!' );
					props.getProductsByFilters( { pageSize:  props.paging.pageSize, page: 0 } )

				} else
				{
					message.error( rs.message );
				}
			} catch ( error )
			{
				message.error( error.message );
			}
	}

	return (
		<>
			<Widget>
				<div className="p-5">
					<div className="mb-3">
						<Link to="/product/create" className="btn btn-info">
						<span className="d-flex align-items-center"><i className="eva eva-plus mr-2"></i> Thêm mới</span>
						</Link>
					</div>
					<ProductSearch { ...props } />
				</div>
			</Widget >
			<Widget>
				{/* <div className="p-3">
					<ProductSearch { ...props } />
				</div> */}
				<div className="widget-table-overflow p-5 mt-4">
					<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
						<thead>
							<tr>
								<th>#</th>
								<th className="text-nowrap">Hình ảnh</th>
								<th className="text-nowrap">Sản phẩm</th>
								<th className="text-nowrap">Số lượng</th>
								<th className="text-nowrap">Giá</th>
								<th className="text-nowrap">Phân loại</th>
								<th className="text-nowrap">Trạng thái</th>
								<th className="text-nowrap">Thời gian tạo</th>
								<th className="text-nowrap">Thao tác</th>
							</tr>
						</thead>
						<tbody>
							{
								props.products?.length > 0 && props.products.map( ( item, key ) =>
								{
									return (
										< tr key={ key } className="table-product">
											<td className="text-gray-900 text-center">{ props.paging.pageNumber * props.paging.pageSize + ( key + 1 ) }</td>
											<td className="d-flex align-items-center">
												<img width="70" height="70"
													style={ { border: "0.5px solid gray", borderRadius: '5px' } }
													src={ buildImage(item.pro_avatar) } alt={ item.pro_name } onError={ onErrorImage } />
											</td>
											<td className="text-gray-900">
												<div className="d-flex">
													<div className="font-weight-bold " style={ { minWidth: "80px" } }>Tên SP: { item.pro_hot ? <span className="text-danger">Hot</span> : '' }</div>
													<div className="ml-2 text-break" style={ { minWidth: '100px' } }>{ item.pro_name }</div>
												</div>
												<div className="d-flex my-2">
													<div className="font-weight-bold" style={ { minWidth: "80px" } }>slug:</div>
													<div className="ml-2 text-break" style={ { minWidth: '100px' } }>{ item.pro_slug }</div>
												</div>
											</td>
											<td className="text-gray-900">{ customNumber( item.pro_amount, '.', '' ) }</td>
											<td className="text-gray-900">{ customNumber( item.pro_price, '.', 'đ' ) }</td>
											<td className="text-gray-900 text-break" style={ { minWidth: "100px" } }>{ item.category?.c_name || 'N/A' }</td>

											<td className="text-gray-900">{ genStatus( item.pro_active ) }</td>
											<td className="text-gray-900 text-nowrap">
												{ customDate( item.created_at, 'DD/MM/yyyy' ) }
											</td>
											<td>
												<div className="d-flex justify-content-center">
												<Link to={`/product/edit/${item.id}`}>
													<i className="eva eva-edit"style={{fontSize: "16px", border: "1px solid"}}></i>
												</Link>
												<DeleteOutlined onClick={ () => deleteData( item.id ) }
													className="mx-2" style={ { fontSize: "16px" } } />
												</div>
											</td>
										</tr>
									)
								}
								) }

							{
								( !props.products || props.products?.length <= 0 ) &&
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
									props.getProductsByFilters( { pageSize:  props.paging.pageSize, page: e, ...props.params } )
								}
								pageSize={ props.paging.pageSize}
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
