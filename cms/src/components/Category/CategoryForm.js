// @ts-nocheck
import { Form, Input, Select, Switch, Upload } from 'antd';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import React from 'react';
import Widget from '../Widget/Widget';
import { useForm } from 'antd/lib/form/Form';
import { toSlug } from '../../helpers/common/common';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { showCategoryDetail, submitForms } from '../../services/categoryService';
import { buildImage } from '../../services/common';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';
export const CategoryForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ files, setFiles ] = useState( [] );
	const [ data, setData ] = useState( null );
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();
	const [ id, setId ] = useState( null );

	useEffect( () =>
	{
		if ( params.id )
		{
			setId( Number( params.id ) );
			getData( Number( params.id ) );
		}
	}, [ params.id ] );


	useEffect( () =>
	{
		if ( data )
		{
			let file = [];
			file.push( {
				uid: file.length,
				name: data.c_avatar,
				status: 'done',
				url: buildImage(data.c_avatar),
				default: true
			} );
			let formValue = {
				c_name: data.c_name,
				description: data.description,
				status: data.status || 0,
				hot: data.hot === 1 ? true : false,
				c_slug: data.c_slug,
				image: file
			}
			setFiles(file)
			form.setFieldsValue( formValue )

		}
	}, [ data ] )

	const getData = async ( id ) =>
	{
		await showCategoryDetail( id, setData );
	}

	const validateMessages = {
		required: '${label} không được để trống!',
		types: {
			email: '${label} không đúng định dạng email',
			number: '${label} không đúng định dạng số',
		},
		number: {
			range: '${label} trong khoảng ${min} - ${max}',
		},
	};

	const submitForm = async ( e ) =>
	{
		await submitForms( id, files, e, dispatch, history );
	}

	const resetForm = () =>
	{
		form.resetFields();
	}

	const onFieldsChange = ( e ) =>
	{
		if ( e.length > 0 )
		{
			let value = typeof e[ 0 ].value === 'string' ? e[ 0 ].value : e[ 0 ].value;
			if ( e[ 0 ].name[ 0 ] === 'name' && value != '' )
			{
				let slug = toSlug( value );
				form.setFieldsValue( { c_slug: slug } );
			}
			let fieldValue = {
				[ String( e[ 0 ].name[ 0 ] ) ]: value
			}
			form.setFieldsValue( fieldValue );
		}
	}

	const normFile = ( e ) =>
	{
		if ( e?.fileList )
		{
			let fileChoose = e?.fileList;
			setFiles( fileChoose );
		}
		return e?.fileList;
	}

	const routes = [
		{
			name: 'Danh mục',
			route: '/category/list'
		},
		{
			name: id ? 'Cập nhật' : 'Tạo mới',
			route:''
		}
	]

	return (
		<>
		<Breadcrumbs routes={routes} title={"Danh mục"} />
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
						<Form.Item name="c_name" label="Tên loại sản phẩm"
							rules={ [ { required: true } ] }
							className=' d-block'>
							<Input className='form-control' placeholder='Nhập tên loại' />
						</Form.Item>
.

						<Form.Item
							label="Hình ảnh"
							name="image"
							accept="images/**"
							className='d-block'
							valuePropName="fileList"
							fileList={ files }
							getValueFromEvent={ normFile }
						>
							<Upload action="/upload" listType="picture-card">
								{ files.length < 1 && <div>
									<PlusOutlined />
									<div style={ { marginTop: 8 } }>Tải ảnh lên</div>
								</div> }
							</Upload>
						</Form.Item>

						{/* <Form.Item name="hot" label="Is hot?" valuePropName="checked">
							<Switch />
						</Form.Item> */}

					</div>

					<div className='d-flex justify-content-center'>
						<button type="submit" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
							{ !id && 'Thêm mới' || 'Cập nhật' }
						</button>

						{ !id && <button type="button" className="btn btn-secondary text-center" style={ { marginLeft: 10, padding: '10px 10px' } } onClick={ resetForm }>
							Tải lại
						</button> }
					</div>
				</Form>
			</Widget >
		</div>
		</>


	)
}
