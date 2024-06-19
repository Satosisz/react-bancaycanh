// @ts-nocheck
import React from "react";
import
{
	Table
} from "reactstrap";
import Widget from "../Widget/Widget.js";

import s from "../../pages/tables/Tables.js";
import { customDate } from "../../helpers/common/common.js";
import { CategorySearch } from "./CategorySearch.js";
import { Pagination, message } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { EMPTY_IMG } from "../../helpers/constant/image.js";
import { buildImage, onErrorImage } from "../../services/common.js";
import { Category } from "../../services/categoryService.js";
import { DeleteOutlined } from "@ant-design/icons";

export const Categories = ( props ) =>
{
	const deleteData = async ( id ) =>
		{
			try
			{
				const rs = await Category.delete( id );
				if ( rs && rs.status === 'success' )
				{
					message.success( 'Delete successfully!' );
					props.getDatasByFilter( { pageSize:  props.paging.pageSize, page: 0 } )

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
						<Link to="/category/create" className="btn btn-info">
							<span className="d-flex align-items-center"><i className="eva eva-plus mr-2"></i>Thêm</span>
						</Link>
					</div>
					<CategorySearch { ...props } />
				</div>
			</Widget >
			<Widget>
				<div className="widget-table-overflow p-5 mt-4">
					<Table className={ `table-striped table-bordered table-hover ${ s.statesTable }` } responsive>
						<thead>
							<tr>
								<th>ID</th>
								<th className="text-nowrap">TÊN LOẠI</th>
								<th className="text-nowrap">SLUG</th>
								<th className="text-nowrap">THỜI GIAN</th>
								<th className="text-nowrap text-center">HÀNH ĐỘNG</th>
							</tr>
						</thead>
						<tbody>
							{
								props.datas?.length > 0 && props.datas.map( ( item, key ) =>
								{
									return (
										< tr key={ key } className="table-product">
											<td className="text-gray-900 text-center">{  props.paging.pageNumber * props.paging.pageSize + ( key + 1 ) }</td>
											<td className="text-gray-900">
												<span className="text-break" style={ { minWidth: '100px' } }>{ item.c_name }</span>
											</td>
											<td className="text-gray-900">
												<span className="text-break" style={ { minWidth: '100px' } }>{ item.c_slug }</span>
											</td>
											{/* <td className="text-gray-900">
												{ item.hot === 1 && <span className="text-danger">Hot</span> }
											</td> */}
											<td className="text-gray-900 text-nowrap">
												{ customDate( item.created_at, 'DD/MM/yyyy' ) }
											</td>
											<td>
												<div className="d-flex justify-content-center">
												<Link to={`/category/edit/${item.id}`} >
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
								( !props.datas || props.datas?.length <= 0 ) &&
								<tr>
									<td colSpan={ 9 } style={ { textAlign: "center", backgroundColor: '#ffff' } }>
										<img className="text-center" src={ EMPTY_IMG } style={ { width: "300px", height: "300px" } } />
										<div style={ { color: "#9A9A9A" } }>DỮ LIỆU TRỐNG</div>
									</td>
								</tr>
							}

						</tbody>
					</Table>
					{
						props.datas && props.total > 0 &&
						<div className="mx-auto d-flex justify-content-center my-4">
							<Pagination
								onChange={ e =>
									props.getDatasByFilter( { pageSize: props.paging.pageSize, page: e, ...props.params } )
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
