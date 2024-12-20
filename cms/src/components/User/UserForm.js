// @ts-nocheck
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Select, Upload } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { buildImage } from '../../services/common';
import { ROLE_SERVICE } from '../../services/rolePermissionService';
import { USER_SERVICE, submitFormUser } from '../../services/userService';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';
import Widget from '../Widget/Widget';
export const UserForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ status, setStatus ] = useState( [] );
	const [ roles, setRoles ] = useState( [] );
	const [ files, setFiles ] = useState( [] );
	const [ data, setData ] = useState( null );
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();
	const [ id, setId ] = useState( null );

	useEffect( () =>
	{
		setStatus( [
			{ value: 1, label: "Hoạt động" },
			{ value: 0, label: "Không hoạt động" }
		] );
		setRoles( [
			{ value: 1, label: "Admin" },
			{ value: 2, label: "Người dùng" }
		] );
		// getListRoles();
	}, [] );

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
				name: data.avatar,
				status: 'done',
				url: buildImage( data.avatar ),
				default: true
			} );
			// let role = data.roles?.reduce( (role, item) =>
			// {
			// 	if ( item )
			// 	{
			// 		role.push(item.id);
			// 	}
			// 	return role;
			// }, [] );
			let formValue = {
				name: data.name,
				type: data?.type,
				email: data.email,
				address: data.address,
				gender: data.gender,
				status: data.status,
				phone: data.phone,
				price: data.price,
				birthday: data.birthday,
				roles: [],
				image: file
			}
			setFiles( file )
			form.setFieldsValue( formValue )
		}
	}, [ data ] );

	const getListRoles = async () =>
	{
		const result = await ROLE_SERVICE.getDataList( { page: 0, pageSize: 100 }, dispatch );
		if ( result )
		{
			let roles = result.roles.reduce( ( newRole, item ) =>
			{
				if ( item )
				{
					newRole.push( {
						value: item.id,
						label: item.guard_name
					} )
				}
				return newRole
			}, [] );
			setRoles( roles );
		}
	}


	const getData = async ( id ) =>
	{
		const rs = await USER_SERVICE.showData( id, dispatch );
		if ( rs )
		{
			setData( rs );
		} else
		{
			setData( null );
		}
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
		delete e.username;
		e.username = e.email;
		if ( e?.birthday ) e.birthday = moment( e.birthday ).format( "YYYY-MM-DD HH:mm:ss" );
		await submitFormUser( id, files, e, dispatch, history );
	}

	const resetForm = () =>
	{
		form.resetFields();
	}

	const onFieldsChange = ( e ) =>
	{
		if ( e.length > 0 )
		{
			let value = typeof e[ 0 ].value == 'string' ? e[ 0 ].value : e[ 0 ].value;

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
			name: 'Người dùng',
			route: '/user/list'
		},
		{
			name: id ? 'Cập nhật' : 'Tạo mới',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Người dùng" } />
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

							<Form.Item name="name" label="Họ và Tên"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input className='form-control' placeholder='Nhập dữ liệu' />
							</Form.Item>

							<div className='row'>
								{/* <div className='col-12 col-md-6'>
								<Form.Item name="username" label="User name"
									className=' d-block'>
									<Input className='form-control' placeholder='Nhập dữ liệu' />
								</Form.Item>
							</div> */}
								<div className='col-12 col-md-6'>
									<Form.Item name="email" label="Email"
										rules={ [ { required: true } ] }
										className='d-block'>
										<Input className='form-control' readOnly={ id ? true : false } placeholder='Nhập email' />
									</Form.Item>
								</div>
								{ !id && <div className='col-12 col-md-6'>
									<Form.Item name="password" label="Mật khẩu"
										className='required d-block'>
										<Input.Password className='form-control' placeholder='Nhập mật khẩu' />
									</Form.Item>
								</div> }
								<div className='col-12 col-md-6'>
									<Form.Item name="phone" label="Số điện thoại"
										className='required d-block'>
										<Input className='form-control' placeholder='Nhập số điện thoại' />
									</Form.Item>
								</div>


								<div className='col-12 col-md-6'>
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
												<div style={ { marginTop: 8 } }>Tải lên</div>
											</div> }
										</Upload>
									</Form.Item>
								</div>
							</div>
							<div className='row'>
								<div className='col-12 col-md-4'>
									<Form.Item name="gender" label="Giới tính"
										rules={ [ { required: true } ] } className='d-block'>
										<Select
											placeholder="Chọn giới tính"
											style={ { width: '100%' } }
											options={ [
												{
													value: 'MALE',
													label: 'Nam'
												},
												{
													value: 'FEMALE',
													label: 'Nữ'
												},
												{
													value: 'OTHER',
													label: 'Khác'
												}
											] }
										/>
									</Form.Item>
								</div>
								<div className='col-12 col-md-4'>
									<Form.Item name="status" label="Trạng thái"
										rules={ [ { required: true } ] } className='d-block'>
										<Select
											placeholder="Chọn trạng thái"
											style={ { width: '100%' } }
											options={ status }
										/>
									</Form.Item>
								</div>
								{/* <div className='col-12 col-md-4'>
									<Form.Item name="type" label="Phân quyền"
										rules={ [ { required: true } ] } className='d-block'>
										<Select
											placeholder="Chọn quyền"
											style={ { width: '100%' } }
											options={ roles }
										/>
									</Form.Item>
								</div> */}
								<div className='col-12 col-md-4'>
									<Form.Item name="birthday" label="Ngày sinh" className='d-block'>
										<Input type='date' className='form-control' />
									</Form.Item>
								</div>
							</div>
							<Form.Item name="address" label="Địa chỉ"
								className=' d-block'>
								<Input className='form-control' placeholder='Nhập địa chỉ' />
							</Form.Item>

							{/* <Form.Item name="roles" label="Role"
							rules={ [ { required: true } ] } className='d-block'>
							<Select
								placeholder="Select role"
								showSearch
								mode="multiple"
								filterOption={ ( input, option ) => ( option?.label?.toLowerCase() ).includes( input?.toLowerCase() ) }

								style={ { width: '100%' } }
								options={ roles }
							/>
						</Form.Item> */}
						</div>

						<div className='d-flex justify-content-center'>
							<button type="submit" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
								{ !id && 'Tạo mới' || 'Cập nhật' }
							</button>

							{ !id && <button type="button" className="btn btn-secondary text-center" style={ { marginLeft: 10, padding: '10px 10px' } } onClick={ resetForm }>
								Reset
							</button> }
						</div>
					</Form>
				</Widget >
			</div>
		</>
	)
}
