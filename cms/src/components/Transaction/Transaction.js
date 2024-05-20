// @ts-nocheck
import { SmallDashOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Table,
    UncontrolledDropdown
} from "reactstrap";
import Widget from "../Widget/Widget.js";

import { Pagination } from "antd";
import { customNumber } from "../../helpers/common/common.js";
import { EMPTY_IMG } from "../../helpers/constant/image.js";
import { TransactionSearch } from "./TransactionSearch.js";

export const Transactions = (props) => {
	const genStatus = (status) => {
		if (status === 1) return <div className="badge bg-warning">Tiếp nhận</div>;
		else if (status === 2) return <div className="badge bg-primary">Đang vận chuyển</div>;
		else if (status === 3) return <div className="badge bg-success">Đã bàn giao</div>;
		else return <div className="badge bg-danger">Đã hủy</div>;
	}

	const genType = (status) => {

		if (status === 1) return <div className="text-success">Tiền mặt</div>;
		return <div className="text-primary">Thanh toán online</div>;
	}

	return (
		<>
			<Widget>
				<div className="p-5">
					<TransactionSearch {...props} />
				</div>
			</Widget >
			<Widget>

				<div className="widget-table-overflow p-5 mt-4">
					<h5>Total: {props.total}</h5>
					<Table className={`table-striped table-btransactioned table-hover mb-9`} responsive>
						<thead>
							<tr>
								<th>#</th>
								<th className="text-nowrap fs-5">Code</th>
								<th className="text-nowrap fs-5">User</th>
								<th className="text-nowrap text-right fs-5">Tổng tiền</th>
								<th className="text-nowrap text-center fs-5">Trạng thái</th>
								<th className="text-nowrap text-center fs-5">Loại thanh toán</th>
								<th className="text-nowrap text-center fs-5">Hành động</th>
							</tr>
						</thead>
						<tbody>
							{
								props.transactions?.length > 0 && props.transactions.map((item, key) => {
									return (
										< tr key={key} className="table-product">
											<td>{item.id}</td>
											<td>{item.tst_code}</td>
											<td>
												<span className="font-weight-bold">Tên người dùng:</span><span> {item.tst_name} <br /></span>
												<span className="font-weight-bold">Email:</span><span> {item.tst_email} <br /></span>
												<span className="font-weight-bold">Số điện thoại:</span><span> {item.tst_phone} <br /></span>
												<span className="font-weight-bold">Địa chỉ:</span><span> {item.tst_address} <br /></span>
												<span className="font-weight-bold">Ghi chú:</span><span> {item.tst_note} <br /></span>
											</td>
											<td className="text-right">{customNumber(item.tst_total_money, ',', '₫')}</td>
											<td className="text-center">{genStatus(item.tst_status)}</td>
											<td className="text-center">{genType(item.tst_type	)}</td>
											<td className="text-center">

												<UncontrolledDropdown group>
													<DropdownToggle className="p-0" style={{ btransaction: 'none', btransactionRadius: 'unset', background: 'none' }}>
														<SmallDashOutlined />
													</DropdownToggle>
													<DropdownMenu className="p-0">
														<DropdownItem href={`view/${item.id}`} className="text-nowrap pt-2">
															Chi tiết
														</DropdownItem>
														<DropdownItem href={`edit/${item.id}`} className="text-nowrap pt-2">
															Chỉnh sửa
														</DropdownItem>

													</DropdownMenu>
												</UncontrolledDropdown>
											</td>
										</tr>
									)
								}
								)}

							{
								(!props.transactions || props.transactions?.length <= 0) &&
								<tr>
									<td colSpan={9} style={{ textAlign: "center", backgroundColor: '#ffff' }}>
										<img className="text-center" src={EMPTY_IMG} style={{ width: "300px", height: "300px" }} />
										<div style={{ color: "#9A9A9A" }}>Dữ liệu trống</div>
									</td>
								</tr>
							}
						</tbody>
					</Table>
					{
						props.total > 0 &&
						<div className="mx-auto d-flex justify-content-center my-4">
							<Pagination
								onChange={e =>
									props.getTransactionsByFilters({ pageSize:  props.paging.pageSize, page: e, ...props.params })
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
