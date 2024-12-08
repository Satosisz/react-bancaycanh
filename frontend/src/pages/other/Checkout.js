import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { getDiscountPrice } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { checkTimeNow, customNumber } from "../../helpers/func";
import { CheckoutForm } from "../../components/checkout/checkoutForm";
import { SUCCESS_PAYMENT } from "../../helpers/constant";
import { Form, Input } from 'antd';
import { Voucher_Service } from "../../services/shop/voucher-service";
import { toggleShowLoading } from "../../redux/actions/common";
import { useToasts } from "react-toast-notifications";

const Checkout = ({ location, cartItems, currency, dispatch }) => {
	const { pathname } = location;
	let cartTotalPrice = 0;
	let voucherHeader = new URLSearchParams(window.location.search).get('voucher');
	const { addToast } = useToasts();
	const [submit, setSubmit] = useState(false);
	const [total, setTotal] = useState(0);
	const [amountVoucher, setAmountVoucher] = useState(null);
	const [paymentType, setPaymentType] = useState(1);
	const [voucher, setVoucher] = useState(null);
	const [form] = Form.useForm();

	useEffect(async () => {
		if (voucherHeader) {
			setVoucher(voucherHeader)
			await apVoucher(voucherHeader);
			form.setFieldsValue({
				voucher: voucherHeader
			});
		} else {
			setPrice();
		}

		return;
	}, [])

	const setPrice = (amount) => {
		var price = cartTotalPrice;
		if (amount) {
			price = (price * (100 - amount)) / 100
		}
		setTotal(price)
	}

	const apVoucher = async (voucher) => {
		const response = await Voucher_Service.detail({ voucher: voucher });
		setVoucher(voucher)
		var amount = 0;

		if (!voucher.split(' ').join('').length) {
			setPrice(0);
			setAmountVoucher(null)
			dispatch(toggleShowLoading(false))
			return;

		}
		if (response?.status === 'success') {
			var minimum = response?.content?.minimum;
			amount = response?.content?.amount;
			if (response?.content === null) {
				addToast("Không tìm thấy voucher", {
					appearance: "error",
					autoDismiss: true
				});
				setPrice(0);
				setAmountVoucher(null)
				dispatch(toggleShowLoading(false))
				return;
			}

			if (parseInt(cartTotalPrice) < parseInt(minimum)) {
				addToast("Đơn không đạt giá trị đơn hàng tối thiểu", {
					appearance: "error",
					autoDismiss: true
				});
				setPrice(0);
				setAmountVoucher(null)
				dispatch(toggleShowLoading(false))
				return;
			}
			setAmountVoucher(amount)
			addToast("Áp dụng voucher thành công", {
				appearance: "success",
				autoDismiss: true
			});
		}
		setPrice(amount);
	}
	const submitForm = async (e) => {
		dispatch(toggleShowLoading(true))
		await apVoucher(e.voucher)
		dispatch(toggleShowLoading(false))
	}


	return (
		<Fragment>
			<MetaTags>
				<title>AOBONGDA Checkout</title>
				<meta
					name="description"
					content="Checkout page of shop react minimalist eCommerce template."
				/>
			</MetaTags>
			<BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Trang chủ</BreadcrumbsItem>
			<BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
				Thủ tục thanh toán
			</BreadcrumbsItem>
			<LayoutOne headerTop="visible">
				{/* breadcrumb */}
				<Breadcrumb />
				<div className="checkout-area pt-95 pb-100">
					<div className="container">
						{cartItems && cartItems.length >= 1 ? (
							<div className="row">
								<div className="col-lg-7">
									<div className="billing-info-wrap">
										<h3>Chi tiết đơn hàng</h3>
										<CheckoutForm paymentType={paymentType} voucher={voucher} submit={submit} setSubmit={setSubmit} cartItem={cartItems} />
									</div>
								</div>

								<div className="col-lg-5">
									<div className="your-order-area">
										<h3>Đơn hàng</h3>
										<div className="your-order-wrap gray-bg-4">
											<div className="your-order-product-info">
												<div className="your-order-top">
													<ul>
														<li>Sản phẩm</li>
														<li>Giá</li>
													</ul>
												</div>
												<div className="your-order-middle">
													<ul>
														{cartItems.map((cartItem, key) => {
															const discountedPrice = (checkTimeNow(cartItem?.sale_to) && cartItem.pro_sale) ? Number(getDiscountPrice(
																cartItem.pro_price,
																cartItem.pro_sale
															)) : null;
															const finalProductPrice = Number((
																cartItem.pro_price
															).toFixed(0));
															const finalDiscountedPrice = Number((
																discountedPrice * currency.currencyRate
															).toFixed(0));
															discountedPrice !== null && discountedPrice !== 0
																? (cartTotalPrice +=
																	finalDiscountedPrice * cartItem.quantity)
																: (cartTotalPrice +=
																	finalProductPrice * cartItem.quantity);
															return (
																<li key={key}>
																	<span className="order-middle-left">
																		{cartItem.pro_name} X {cartItem.quantity}<br/>
																		<p>Màu: {cartItem.selectedProductColor}<br/>
																		Size: {cartItem.selectedProductSize}</p>
																	</span>{" "}
																	<span className="order-price">
																		{discountedPrice !== null && discountedPrice !== 0
																			? customNumber((finalDiscountedPrice * cartItem.quantity).toFixed(0), '₫')
																			: customNumber((finalProductPrice * cartItem.quantity).toFixed(0), '₫')}
																	</span>
																</li>
															);
														})}
													</ul>
												</div>
												<div className="your-order-middle">
													<ul className=" flex-start">
														<li>Voucher </li>
														<li><Form className="searchHeader"
															onFinish={submitForm}
															form={form}
															method="GET">
															<div className="flex-start">
																<Form.Item name="voucher"
																	className=' d-block'>
																	<Input placeholder='Voucher' />
																</Form.Item>
																<button type="submit" className="apvoucher">
																	Áp dụng
																</button>
															</div>
														</Form></li>
													</ul>
												</div>
												<div className="your-order-bottom">
													<ul>
														<li className="your-order-shipping">Phí giao hàng</li>
														<li>Miễn phí</li>
													</ul>
												</div>
												{
													amountVoucher &&
													<>
														<div className="your-order-bottom">
															<ul>
																<li className="your-order-shipping">Giảm giá</li>
																<li>{amountVoucher} %</li>
															</ul>
														</div>
													</>
												}
												<div className="your-order-total">
													<ul>
														<li className="order-total">Giá trị đơn hàng</li>
														<li>
															{customNumber(total.toFixed(0), '₫')}
														</li>
													</ul>
												</div>
											</div>
											<div className="payment-method"></div>
										</div>
										<div className="place-order mt-25">
											<button className="btn-hover" onClick={e => {
												setSubmit(true);
												setPaymentType(1);
											}}>
												Tiền mặt
											</button>
										</div>
										<div className="place-order mt-25">
											<button className="btn-hover btn-danger"
												onClick={e => {
													setSubmit(true);
													setPaymentType(2);
												}}>Thanh toán online</button>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="row">
								<div className="col-lg-12">
									<div className="item-empty-area text-center">
										<div className="item-empty-area__icon mb-30">
											<img src={SUCCESS_PAYMENT} width={80} height={80} alt='payment' className="d-block mx-auto" />
										</div>
										<div className="item-empty-area__text">
											Đơn hàng đặt thành công <br />{" "}
											<Link to={process.env.PUBLIC_URL + "/shop"}>
												TIẾP MỤC MUA SẮM
											</Link>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</LayoutOne>
		</Fragment>
	);
};

Checkout.propTypes = {
	cartItems: PropTypes.array,
	currency: PropTypes.object,
	location: PropTypes.object
};

const mapStateToProps = state => {
	return {
		cartItems: state.cartData,
		currency: state.currencyData
	};
};

export default connect(mapStateToProps)(Checkout);
