// @ts-nocheck
import { Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';

export const TransactionSearch = ( props ) =>
{
	const [ form ] = useForm();
	const [ status, setStatus ] = useState( [] );

	useEffect( () =>
	{
		setStatus( [
			{ value: 1, label: "Tiếp nhận" },
			{ value: 2, label: "Đang vận chuyển" },
			{ value: 3, label: "Đã bàn giao" },
			{ value: 4, label: "Đã hủy" }
		] );
	}, [] )


	const submitForm = ( value ) =>
	{
		let params = {};
		if ( value.name )
		{
			value.name = value.name.trim();
		}
		if ( value.id )
		{
			value.id = value.id.trim();
		}
		props.getTransactionsByFilters( { pageSize:  props.paging.pageSize, page: 0, ...value } );
		props.setParams( value );
	}

	const resetForm = () =>
	{
		props.getTransactionsByFilters( { pageSize:  props.paging.pageSize, page: 1 } );
		props.setParams( {
			id: null,
			product_name: null,
			name: null,
			status: null,
			phone: null
		} );
		form.resetFields();
	}
	return (
		<Form
			name='search product'
			form={ form }
			onFinish={ submitForm }
		>
			<div className="row mb-1">
				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="name" label="Tên người dùng" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập tên người dùng' />
					</Form.Item>
				</div>

				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="phone" label="Số điện thoại" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập vào số điện thoại' />
					</Form.Item>
				</div>
				<div className="col-md-3 mb-2">
					<Form.Item name="status" label="Trạng thái" className='mb-0 d-block'>
						<Select
							placeholder="Chọn trạng thái"
							style={ { width: '100%' } }
							options={ status }
						/>
					</Form.Item>
				</div>
			</div>

			<button type="submit" className="btn btn-primary" style={ { marginRight: 10, padding: '10px 10px' } }>
				<i className="nc-icon nc-zoom-split mr-2">Tìm kiếm</i>
			</button>

			<button type="button" className="btn btn-secondary" style={ { marginLeft: 10, padding: '10px 10px' } } onClick={ resetForm }>
				<i className="nc-icon nc-refresh-02 mr-2">Tải lại</i>
			</button>
		</Form>
	);
}
