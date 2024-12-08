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
import { Auth_Service } from "../../services/shop/auth-service";
import { Voucher_Service } from "../../services/shop/voucher-service";

export const CheckoutForm = (props) => {
	const [form] = useForm();

	const { addToast } = useToasts();

	const dispatch = useDispatch();


	useEffect(async () => {
		const response = await Auth_Service.profile();
		if (response?.status == 'success') {
			let obj = {
				tst_name: response?.data?.name,
				tst_email: response?.data?.email,
				tst_phone: response?.data?.phone,
				tst_address: response?.data?.address,
			}
			form.setFieldsValue(obj);
		}
	}, [])

	useEffect(() => {
		if (props.submit) {
			form.submit();
			props.setSubmit(false)
		}
	}, [props.submit])

	const submitForm = async (e) => {
		let cartTotalPrice = 0;
		let totalDiscount = 0;
		if (props.cartItem?.length > 0) {
			let products = props.cartItem.reduce((newProd, item) => {
				const discountedPrice = Number(getDiscountPrice(
					item?.pro_price,
					item?.pro_sale
				));

				const sale = item?.pro_price - discountedPrice;
				const finalProductPrice = Number((
					item?.pro_price
				).toFixed(0));
				const finalDiscountedPrice = Number((
					discountedPrice * (props.currency?.currencyRate || 1)
				).toFixed(0));

				discountedPrice != null && discountedPrice != 0
					? (cartTotalPrice +=
						finalDiscountedPrice * item?.quantity)
					: (cartTotalPrice +=
						finalProductPrice * item?.quantity);
				totalDiscount += (sale || 0);
				newProd.push({
					od_qty: item.quantity,
					od_product_id: item.id,
					color: item.selectedProductColor,
					size: item.selectedProductSize,
				});
				return newProd
			}, []);
			try {
				dispatch(toggleShowLoading(true));
				if (props.voucher) {
					const response = await Voucher_Service.detail({ voucher: props.voucher });
					if (response?.status === 'success') {
						var minimum = response?.content?.minimum;
						if (response?.content === null) {
							addToast("Không tìm thấy voucher", {
								appearance: "error",
								autoDismiss: true
							});
							dispatch(toggleShowLoading(false))
							return;
						}

						if (parseInt(cartTotalPrice) < parseInt(minimum)) {
							addToast("Đơn không đạt giá trị đơn hàng tối thiểu", {
								appearance: "error",
								autoDismiss: true
							});
							dispatch(toggleShowLoading(false))
							return;
						}
					}
				}
				e.voucher = props.voucher
				let data = {
					...e,
					products: products,
					tst_total_money: cartTotalPrice,
					tst_status: 1,
					tst_type: props.paymentType,
				}
				const response = await TRANSACTION_SERVICE.create(data);
				await timeDelay(1000);
				dispatch(toggleShowLoading(false));
				if (response?.status === 'success') {
					dispatch(deleteAllFromCart(addToast));
					console.log('============ response: ', response);

					if (response.vnp_Url) {
						window.location.href = response.vnp_Url;
					}
					message.success('Đơn hàng đã đặt thành công!');
					await timeDelay(1000);

				} else {
					message.error(response?.message || 'error');
				}
			} catch (error) {
				message.error(error?.message || 'error');
			}

		}

	}

	return (
		<Form
			className='p-3'
			name='form'
			form={form}
			onFinish={submitForm}
			onFieldsChange={(e) => onFieldsChange(e, form)}
			validateMessages={validateMessages}
		>
			<Form.Item name="tst_name" label="Họ và Tên"
				rules={[{ required: true, }]}
				className=' d-block'>
				<Input className=' mb-0' placeholder='Nhâp Họ và Tên' />
			</Form.Item>

			<Form.Item name="tst_email" label="Email"
				rules={[{ required: true, type: 'email' }]}
				className=' d-block'>
				<Input type="email" className=' mb-0' placeholder='Nhập email' />
			</Form.Item>

			<Form.Item name="tst_phone" label="Số điện thoại"
				rules={[{ required: true, pattern: REGEX_PHONE }]}
				className=' d-block'>
				<Input className=' mb-0' placeholder='Nhập số điện thoại' />
			</Form.Item>

			<Form.Item name="tst_address" label="Địa chỉ"
				rules={[{ required: true }]}
				className=' d-block'>
				<Input className=' mb-0' placeholder='Nhập địa chỉ' />
			</Form.Item>

			<Form.Item name="tst_note" label="Ghi chú"
				className=' d-block'>
				<TextArea rows={5} className=' mb-0' placeholder='Nhập ghi chú' />
			</Form.Item>
		</Form>
	);
}
