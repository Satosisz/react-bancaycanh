// @ts-nocheck
import { Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';

export const ContactSearch = ( props ) =>
{
	const [ form ] = useForm();


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
		props.getDataList( { ...props.paging, page: 0, ...value } );
		props.setParams( value );
	}

	const resetForm = () =>
	{
		props.getDataList( { ...props.paging, page: 1 } );
		props.setParams( {
			id: null,
			product_name: null,
			tst_name: null,
			status: null,
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
					<Form.Item name="name" label="Tên" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập tên' />
					</Form.Item>
				</div>
				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="email" label="Email" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập email' />
					</Form.Item>
				</div>
				<div className="col-md-3 mb-2 form-group">
					<Form.Item name="title" label="Tiêu đề" className='mb-0 d-block'>
						<Input className='form-control' placeholder='Nhập tiêu đề' />
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
