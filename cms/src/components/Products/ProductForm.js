// @ts-nocheck
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Select, Switch, Upload } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { toSlug } from '../../helpers/common/common';
import { toggleShowLoading } from '../../redux/actions/common';
import { getCategoriesByFilter } from '../../services/categoryService';
import { buildImage, timeDelay } from '../../services/common';
import { showProductDetail, submitFormProduct } from '../../services/productService';
import Breadcrumbs from '../Breadbrumbs/Breadcrumbs';
import Widget from '../Widget/Widget';

const initOptions = [ {
	key: "",
	value: ""
} ]
export const ProductForm = ( props ) =>
{
	const [ form ] = useForm();
	const [ status, setStatus ] = useState( [] );
	const [ categories, setCategories ] = useState( [] );
	const [ files, setFiles ] = useState( [] );
	let [ attributes, setAttributes ] = useState( initOptions );
	const [ product, setProduct ] = useState( null );
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();
	const [ id, setId ] = useState( null );

	useEffect( () =>
	{
		setStatus( [
			{ value: 1, label: "Active" },
			{ value: 0, label: "Inactive" }
		] );
		getListCategories();
	}, [] );

	useEffect( () =>
	{
		if ( params.id )
		{
			setId( Number( params.id ) );
			getProduct( Number( params.id ) );
		}
	}, [ params.id ] );


	useEffect( () =>
	{
		if ( product )
		{
			let file = [];
			file.push( {
				uid: file.length,
				name: product?.pro_avatar,
				status: 'done',
				path: product?.pro_avatar,
				url: buildImage( product.pro_avatar ),
				default: true
			} );

			if ( product?.product_images?.length > 0 )
			{
				file = product.product_images.reduce( ( newFile, item ) =>
				{
					if ( item )
					{
						newFile.push( {
							uid: file.length,
							name: item. product?.pro_name,
							status: 'done',
							path: item.al_name,
							url: buildImage( item.al_name ),
							default: true
						} );
					}
					return newFile;
				}, file )
			}
			setFiles( file )
			let formValue = {
				pro_name: product.pro_name,
				pro_category: product.category.id,
				pro_content: product.pro_content,
				pro_description: product.pro_description,
				pro_active: product.pro_active,
				pro_sale: product?.pro_sale,
				pro_hot: product.pro_hot === 1 ? true : false,
				pro_amount: parseInt(product.pro_amount),
				pro_price: product.pro_price,
				sale_to: product.sale_to ? moment( product.sale_to ).format( 'yyyy-MM-DD' ) : null,
				pro_slug: product.pro_slug,
				image: file
			}
			form.setFieldsValue( formValue )
			setAttributes( product?.options || initOptions )
		}
	}, [ product ] )

	const getListCategories = async () =>
	{
		const result = await getCategoriesByFilter( { page: 0, pageSize: 20, status: 1 }, dispatch );
		await timeDelay( 500 );
		dispatch( toggleShowLoading( false ) );
		if ( result.content )
		{
			let category = result.content.reduce( ( newCate, item ) =>
			{
				if ( item )
				{
					newCate.push( {
						value: item.id,
						label: item.c_name
					} )
				}
				return newCate
			}, [] );
			setCategories( category );
		}
	}

	const getProduct = async ( id ) =>
	{
		await showProductDetail( id, setProduct );
	}

	const validateMessages = {
		required: '${label} không được để trống!',
		types: {
			email: '${label} không đúng định dạng email',
			number: '${label} không đúng định dạng số',
			max: '${label} tối đa 100'
		},
		number: {
			range: '${label} trong khoảng ${min} - ${max}',
		},
	};

	const submitForm = async ( e ) =>
	{
		let valueAttributes = attributes?.filter( item => item.key !== "" && item.value !== "" )
		await submitFormProduct( id, files, { ...e, options: valueAttributes }, dispatch, history );
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
				form.setFieldsValue( { pro_slug: slug } );
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
			let fileChoose = e?.fileList.map( item =>
			{
				if ( item.default ) return item;
				item.status = 'done';
				return item;
			} );
			setFiles( fileChoose );
		}
		return e?.fileList;
	}
	const routes = [
		{
			name: 'Sản phẩm',
			route: '/product/list'
		},
		{
			name: id ? 'Cập nhật' : 'Tạo mới',
			route: ''
		}
	]

	return (
		<>
			<Breadcrumbs routes={ routes } title={ "Sản phẩm" } />
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
							<Form.Item name="pro_name" label="Tên sản phẩm"
								rules={ [ { required: true } ] }
								className=' d-block'>
								<Input className='form-control' placeholder='Nhập dữ liệu' />
							</Form.Item>

							<Form.Item name="pro_category" label="Phân loại"
								rules={ [ { required: true } ] } className='d-block'>
								<Select
									placeholder="Chọn phân loại"
									showSearch
									filterOption={ ( input, option ) => ( option?.label?.toLowerCase() ).includes( input?.toLowerCase() ) }

									style={ { width: '100%' } }
									options={ categories }
								/>
							</Form.Item>
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
									{ files.length <= 5 && <div>
										<PlusOutlined />
										<div style={ { marginTop: 8 } }>Tải lên</div>
									</div> }
								</Upload>
							</Form.Item>
							<Form.Item name="pro_content" label="Mô tả ngắn"
								className='d-block'>
								<Input.TextArea className='form-control'
									placeholder='Nhập mô tả ngắn'
									cols={ 10 } rows={ 5 } />
							</Form.Item>
							<Form.Item name="pro_description" label="Mô tả chi tiết"

								className='d-block'>
								<Input.TextArea className='form-control'
									placeholder='Nhập mô tả chi tiết' cols={ 10 } rows={ 5 } />
							</Form.Item>

							{/*<div className='form-group'>
							<label >Thuộc tính</label>
							<div className='mt-2'>
								<div className="table-item row w-100 mx-auto" style={ { lineHeight: 3, backgroundColor: "#eef5f9", fontWeight: "700", borderBottom: "1px solid #F1F3F8" } }>
									<div className="text-center table-item__id col-5">Key</div>
									<div className="table-item__info col-5 text-center"
										style={ { borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" } }>
										Value
									</div>
									<div className="table-item__action col-2">Action</div>
								</div>
								{
									attributes?.length > 0 && attributes.map( ( item, key ) =>
									{
										return (
											<div key={ key } className='w-100 mx-auto'>

												<div className="style-scroll" style={ { overflow: "hidden", overflowY: "auto", boxShadow: "1px 0 8px rgba(0, 0, 0, .08) inset;" } }>
													<div className="table-item w-100 mx-auto row py-1" style={ { border: "1px solid #d9d9d9" } }>
														<div className="text-center table-item__id col-5">
															<input className='form-control' defaultValue={ item.key } onChange={ ( e ) =>
															{
																if ( e )
																{
																	attributes[ key ].key = e?.target?.value;
																	setAttributes( attributes );
																}
															} } />
														</div>
														<div className="table-item__info col-5"
															style={ { borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" } }>
															<input className='form-control' defaultValue={ item.value } onChange={ ( e ) =>
															{
																if ( e )
																{
																	attributes[ key ].value = e?.target?.value;
																	setAttributes( attributes );
																}
															} } />

														</div>
														<div className="table-item__action col-2 d-flex justify-content-center">
															{attributes?.length > 1 &&
															<DeleteOutlined className=" text-danger text-center cursor-pointer"
															 style={{fontSize: "20px"}} onClick={() => {
																let value = attributes.filter((e, index) => index !== key);
																setAttributes(value)
															 }}/> }
														</div>
													</div>
												</div>
											</div>
										);
									} )
								}

								<div className='mt-3'>
									<button type='button' className='btn btn-success' onClick={ () =>
									{
										setAttributes( attributes.concat( { key: "", value: "" } ) )
									} }>
										<PlusCircleOutlined style={{fontSize: "20px"}} />
									</button>
								</div>

							</div>
								</div>*/}

							<div className='row'>

								<div className='col-md-4'>
									<Form.Item name="pro_price" label="Giá"
										rules={ [ { required: true } ] }
										className='d-block'>
										<Input className='form-control' placeholder='Nhập giá sản phẩm' />
									</Form.Item>
								</div>
								<div className='col-md-4'>
									<Form.Item name="pro_amount" label="Số lượng"
										rules={ [ { required: true } ] }
										className='d-block'>
										<Input type='number' className='form-control' placeholder='Nhập số lượng' />
									</Form.Item>
								</div>
								<div className='col-md-4'>
									<Form.Item name="pro_sale" label="Giảm giá"
										className=' d-block'>
										<Input className='form-control' type='number' max={ 100 } placeholder='(%)' />
									</Form.Item>
								</div>
								{/* <div className='col-md-4'>
									<Form.Item name="sale_to" label="Giảm đến ngày"
										className=' d-block'>
										<Input type='date' className='form-control' />
									</Form.Item>
								</div> */}

								<div className='col-md-4'>
									<Form.Item name="pro_active" label="Trạng thái"
										rules={ [ { required: true } ] } className='d-block'>
										<Select
											placeholder="Chọn trạng thái"
											style={ { width: '100%' } }
											options={ status }
										/>
									</Form.Item>
								</div>


							</div>

							<Form.Item name="pro_hot" label="Is hot?" valuePropName="checked">
								<Switch />
							</Form.Item>

						</div >

						<div className='d-flex justify-content-center'>
							<button type="submit" className="btn btn-primary text-center" style={ { marginRight: 10, padding: '10px 10px' } }>
								<i className="nc-icon nc-zoom-split mr-2"></i>{ !id && 'Tạo mới' || 'Cập nhật' }
							</button>

							{ !id && <button type="button" className="btn btn-secondary text-center" style={ { marginLeft: 10, padding: '10px 10px' } } onClick={ resetForm }>
								<i className="nc-icon nc-refresh-02 mr-2">Tải lại</i>
							</button> }
						</div>
					</Form >
				</Widget >
			</div >
		</>


	)
}
