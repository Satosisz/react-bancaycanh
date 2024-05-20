// @ts-nocheck
import { Form, Input, Select, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";
import { Table } from 'reactstrap';
import { customDate, customNumber, toSlug } from '../../helpers/common/common';
import { PAYMENT_TYPE } from '../../helpers/constant/value';
import { toggleShowLoading } from '../../redux/actions/common';
import { buildImage, onErrorImage } from '../../services/common';
import { getTransactionById, updateTransaction } from '../../services/transactionService';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';
import Widget from '../Widget/Widget';

export const TransactionForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ transactionInfo, setTransactionInfo ] = useState();
	const dispatch = useDispatch();
	const params = useParams();
	const [ id, setId ] = useState( null );
	const [ status, setStatus ] = useState();
	const [ totalPrice, setTotalPrice ] = useState( 0 );

	const [ orders, setOrders ] = useState( [] );
	const isView = props.location?.pathname?.includes( 'view' );

	useEffect( () =>
	{
		setStatus( [
			{ value: 1, label: 'Tiếp nhận' },
			{ value: 2, label: 'Đang vận chuyển' },
			{ value: 3, label: 'Đã bàn giao' },
			{ value: 4, label: 'Đã hủy' },
		] );
	}, [] );

	useEffect( () =>
	{
		if ( params.id )
		{
			setId( Number( params.id ) );
			getTransactionInfo( Number( params.id ) );
		}
	}, [ params.id ] );

	useEffect( () =>
	{
		if ( transactionInfo )
		{
			form.setFieldsValue( {
				tst_name: transactionInfo.tst_name,
				tst_email: transactionInfo.tst_email,
				tst_phone: transactionInfo.tst_phone,
				tst_address: transactionInfo.tst_address,
				tst_status: transactionInfo.tst_status,
				tst_type: Number( transactionInfo?.tst_type || 0 ),
				tst_note: transactionInfo.tst_note
			} );
			setTotalPrice( transactionInfo.tst_total_money );
			setOrders( transactionInfo.orders )
		}
	}, [ transactionInfo ] );

	const getTransactionInfo = async ( id ) =>
	{
		await getTransactionById( id, setTransactionInfo, dispatch );
	}

	const validateMessages = {
		required: '${label} không được để trống!',
		types: {
			email: '${label} không đúng định dạng email',
			number: '${label} không đúng định dạng số',
			min: '${label} không đúng định dạng!',
			max: '${label} không đúng định dạng!',
		},
		number: {
			range: '${label} trong khoảng ${min} - ${max}',
		},
	};

	const submitForm = async ( e ) =>
	{
		dispatch( toggleShowLoading( true ) );
		const response = await updateTransaction( id, e );
		dispatch( toggleShowLoading( false ) );

		if ( response?.status === 'success' )
		{
			message.success( 'Cập nhật đơn hàng thành công!' );
			window.location.href = '/transaction/list'
		} else
		{
			console.log(response);
			message.error( response?.message );
		}
	}

	const onFieldsChange = ( e ) =>
	{
		if ( e?.length > 0 )
		{
			let value = typeof e[ 0 ].value == 'string' ? e[ 0 ].value : e[ 0 ].value;
			if ( e[ 0 ].name[ 0 ] === 'name' && value != '' )
			{
				let slug = toSlug( value );
				form.setFieldsValue( { slug: slug } );
			}
			let fieldValue = {
				[ String( e[ 0 ].name[ 0 ] ) ]: value
			}
			form.setFieldsValue( fieldValue );
		}
	}
	const routes = [
		{
			name: 'Đơn hàng',
			route: '/transaction/list'
		},
		{
			name: !isView ? 'Cập nhật' : 'Chi tiết',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Đơn hàng" } />
			<div className="w-75 mx-auto">
				<Widget>
					<Form
						className='p-3'
						name='nest-messages form'
						form={ form }
						onFinish={ submitForm }
						onFieldsChange={ onFieldsChange }
						validateMessages={ validateMessages }
					>
						<div className='mb-3'>
							<div className="row ">
								<p className='col-12 mb-2 col-md-6'><span style={ { fontWeight: 600 } }>Thời gian tạo: </span>{ customDate( transactionInfo?.created_at, 'DD/MM/yyyy' ) }</p>
								<p className='col-12 mb-2 col-md-6'><span style={ { fontWeight: 600 } }>Thời gian cập nhật: </span>{ customDate( transactionInfo?.updated_at, 'DD/MM/yyyy' ) }</p>
							</div>
							<Form.Item name="tst_name" label="Tên người nhận"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input className='form-control' readOnly={ isView } placeholder='Nhập tên người nhận' />
							</Form.Item>

							<div className='row'>
								<div className='col-md-6'>
									<Form.Item name="tst_phone" label="Số điện thoại"
										rules={ [ { required: true, min: 10, max: 12 } ] }
										className=' d-block'>
										<Input className='form-control' readOnly={ isView } placeholder='Nhập số điện thoại' />
									</Form.Item>
								</div>
								<div className='col-md-6'>
									<Form.Item name="tst_email" readOnly={ isView } label="Email người nhận"
										rules={ [ { required: true, type: 'email' } ] }
										className=' d-block'>
										<Input className='form-control' type='email' readOnly={ isView } placeholder='Nhập email' />
									</Form.Item>
								</div>
							</div>

							<Form.Item name="tst_address" label="Địa chỉ"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input className='form-control' readOnly={ isView } placeholder='Nhập địa chỉ' />
							</Form.Item>

							<div className='row'>
								<div className='col-md-6'>
									<Form.Item name="tst_status" label="Trạng thái"
										rules={ [ { required: true } ] }
										className=' d-block'>
										<Select
											placeholder="Chọn trạng thái"
											disabled={ isView }
											style={ { width: '100%' } }
											options={ status }
										/>
									</Form.Item>
								</div>
							</div>

							<div className="widget-table-overflow mt-4">
								<Table className={ `table-striped table-btransactioned table-hover mb-9` } responsive>
									<thead>
										<tr>
											<th>STT</th>
											<th>Hình ảnh</th>
											<th>Tên sản phẩm</th>
											<th className='text-right'>Giá gốc</th>
											<th className='text-right'>Số lượng</th>
											<th className='text-right'>Tổng</th>
										</tr>
									</thead>
									<tbody>
										{
										 orders?.length > 0 &&
											orders.map( ( item, index ) =>
											{
												return (
													<tr key={ index }>
														<td className='text-center'>{ index + 1 }</td>
														<td>{
															<img style={ { btransaction: "1px solid", btransactionRadius: "10px" } } src={ buildImage( item.product.pro_avatar ) }
																alt={ item.product.pro_name } width={ 100 }
																height={ 100 } onError={ onErrorImage } />
														}</td>
														<td className='text-break' style={ { maxWidth: "200px" } }>{ item.product.pro_name }</td>
														<td className='text-right'>{ customNumber( item.od_price, ',', 'đ' ) }</td>
														<td className='text-right'>{ item.od_qty }</td>
														<td className='text-right'>{ customNumber( (Number(item?.od_sale ? item?.od_sale : 100) / 100) * Number(item.od_price) * Number(item.od_qty) , ',', 'đ' ) }</td>
													</tr>
												);
											}
											)
										}

									</tbody>
								</Table>
							</div>

							<Form.Item name="tst_note" label="Ghi chú"
								className=' d-block'>
								<Input.TextArea rows={ 5 } readOnly={ isView } className='form-control' placeholder='Ghi chú' />
							</Form.Item>
							<div className='row'>
								<div className='col-12 col-md-6 '>
									<Form.Item name="tst_type" label="Hình thức thanh toán"
										className='d-block'>
										<Select
											placeholder="Hình thức thanh toán"
											disabled={ isView }
											style={ { width: '100%' } }
											options={ PAYMENT_TYPE }
										/>
									</Form.Item>
								</div>
							</div>
							<div className='row'>
								<div className='col-md-6 mb-0 d-flex'>
									<h5 className='font-weight-normal'>Tổng giá:</h5>
									<h5 className='ml-2 font-italic'>{ customNumber( totalPrice, ',', 'đ' ) }</h5>
								</div>
							</div>

						</div>

						<div className='d-flex justify-content-center'>
							{ isView ?
								<button type="button" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
									<Link className="text-white" to="/transaction/list"><i className="nc-icon nc-zoom-split mr-2"></i>Quay lại</Link>
								</button> :
								<button type="submit" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
									<i className="nc-icon nc-zoom-split mr-2"></i>Cập nhật
								</button>
							}


						</div>
					</Form>
				</Widget >
			</div>
		</>

	)
}
