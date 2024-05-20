import { Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import axios from 'axios';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { deleteAllFromCart } from "../../redux/actions/cartActions";
import { REGEX_PHONE, timeDelay } from "../../helpers/constant";
import { getDiscountPrice } from "../../helpers/product";
import { toggleShowLoading } from "../../redux/actions/common";
import { TRANSACTION_SERVICE, getItem, onFieldsChange, validateMessages } from "../../services";

export const CheckoutForm = ( props ) =>
{
	const [ form ] = useForm();

	const { addToast } = useToasts();

	const dispatch = useDispatch();


	useEffect( () =>
	{
		let obj = {
			tst_name: getItem( 'name' ),
			tst_email: getItem( 'email' ),
			tst_phone: getItem( 'phone' ),
			tst_address: getItem( 'address' )
		}
		form.setFieldsValue(obj);
	}, [] )

	useEffect( () =>
	{
		if ( props.submit )
		{
			form.submit();
			props.setSubmit( false )
		}
	}, [ props.submit ] )

	const submitForm = async ( e ) =>
	{

		let cartTotalPrice = 0;
		let totalDiscount = 0;
		if ( props.cartItem?.length > 0 )
		{
			let products = props.cartItem.reduce( ( newProd, item ) =>
			{
				const discountedPrice = Number( getDiscountPrice(
					item?.pro_price,
					item?.pro_sale
				) );

				const sale = item?.pro_price - discountedPrice;
				const finalProductPrice = Number( (
					item?.pro_price
				).toFixed( 0 ) );
				const finalDiscountedPrice = Number( (
					discountedPrice * (props.currency?.currencyRate || 1)
				).toFixed( 0 ) );

				discountedPrice != null && discountedPrice != 0
					? ( cartTotalPrice +=
						finalDiscountedPrice * item?.quantity )
					: ( cartTotalPrice +=
						finalProductPrice * item?.quantity );
				totalDiscount += (sale || 0);
				newProd.push( {
					od_qty: item.quantity,
					od_product_id: item.id
				} );
				return newProd
			}, [] );
			try
			{
				dispatch( toggleShowLoading( true ) );
				let data = {
					...e,
					products: products,
					tst_total_money: cartTotalPrice,
					tst_status: 1,
					tst_type: 1,
				 }
				const response = await TRANSACTION_SERVICE.create( data );
				await timeDelay( 1000 );
				if ( response?.status === 'success' )
				{
					console.log('============ response: ', response);


					if ( props.paymentType === 1 )
					{
						await paymentByVNPay(response, cartTotalPrice);

					}
					message.success( 'Đơn hàng đã đặt thành công!' );
					// dispatch( deleteAllFromCart( addToast ) );
				} else
				{
					message.error( response?.message || 'error' );
				}
				dispatch( toggleShowLoading( false ) );
			} catch ( error )
			{
				message.error( error?.message || 'error' );
				dispatch( toggleShowLoading( false ) );
			}

		}

		dispatch( toggleShowLoading( false ) );
	}

	const paymentByVNPay = async ( response, cartTotalPrice ) =>
	{
		try {
			let newData = {
				order_id: response.data.id,
				url_return: process.env.REACT_APP_API + '/order/callback',
				amount: cartTotalPrice,
				service_code: "order",
				url_callback: process.env.REACT_APP_API + '/order/callback'
			}
			const responseService = await axios.post("https://123code.net/api/v1/payment/add", newData);
			console.log('================== response: ', responseService);
			if (responseService.data.link) {
				// data.link = response.data.link;
				window.open( responseService?.data?.link, '_blank ' );
			}

		} catch (err) {
			console.log('------------- ERROR CART',err);
		}
	}

	return (
		<Form
			className='p-3'
			name='form'
			form={ form }
			onFinish={ submitForm }
			onFieldsChange={ ( e ) => onFieldsChange( e, form ) }
			validateMessages={ validateMessages }
		>
			<Form.Item name="tst_name" label="Họ và Tên"
				rules={ [ { required: true, } ] }
				className=' d-block'>
				<Input className=' mb-0' placeholder='Nhâp Họ và Tên' />
			</Form.Item>

			<Form.Item name="tst_email" label="Email"
				rules={ [ { required: true, type: 'email' } ] }
				className=' d-block'>
				<Input type="email" className=' mb-0' placeholder='Nhập email' />
			</Form.Item>

			<Form.Item name="tst_phone" label="Số điện thoại"
				rules={ [ { required: true, pattern: REGEX_PHONE } ] }
				className=' d-block'>
				<Input className=' mb-0' placeholder='Nhập số điện thoại' />
			</Form.Item>

			<Form.Item name="tst_address" label="Địa chỉ"
				rules={ [ { required: true } ] }
				className=' d-block'>
				<Input className=' mb-0' placeholder='Nhập địa chỉ' />
			</Form.Item>

			<Form.Item name="tst_note" label="Ghi chú"
				className=' d-block'>
				<TextArea rows={ 5 } className=' mb-0' placeholder='Nhập ghi chú' />
			</Form.Item>
		</Form>
	);
}
