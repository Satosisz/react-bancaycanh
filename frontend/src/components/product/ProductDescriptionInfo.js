import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { checkTimeNow, customNumber } from "../../helpers/func";
import { getProductCartQuantity } from "../../helpers/product";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { getItem } from "../../services";
import { StarIcons } from "../common/star";
import { MENU_SERVICE } from "../../services/shop/menu-service";

const ProductDescriptionInfo = ({
	product,
	discountedPrice,
	currency,
	finalDiscountedPrice,
	finalProductPrice,
	cartItems,
	wishlistItem,
	compareItem,
	addToast,
	addToCart,
	addToWishlist,
	addToCompare
}) => {
	const [selectedProductColor, setSelectedProductColor] = useState("Đen");
	const [selectedProductSize, setSelectedProductSize] = useState("37");
	const [quantityCount, setQuantityCount] = useState(1);

	const productCartQty = getProductCartQuantity(
		cartItems,
		product,
		selectedProductColor,
		selectedProductSize
	);

	let rating_number = 0;
	if (product?.pro_review_star && product?.pro_review_total) {
		rating_number = Number(Math.round(product?.pro_review_star / product?.pro_review_total));
	}
	const checkTime = (checkTimeNow(product?.sale_to) && product.pro_sale);
	const userId = getItem('id');

	const [menus, setMenus] = useState([]);
	useEffect(async () => {
		getMenus();
	}, [])

	const getMenus = async () => {
		const response = await MENU_SERVICE.list();
		setMenus(response);
	};

	const handleSetAttributes = (slug, attributeId) => {
		if (slug == 'mau') {
			setSelectedProductColor(attributeId);
		} else {
			setSelectedProductSize(attributeId)
		}
	}
	return (
		<div className="product-details-content ml-70">
			<h2>{product.pro_name}</h2>
			<div className="product-details-price">
				{product?.pro_sale && checkTime ? (
					<Fragment>
						<span>{customNumber(finalDiscountedPrice, 'đ')}</span>{" "}
						<span className="old">
							{customNumber(finalProductPrice, 'đ')}
						</span>
					</Fragment>
				) : (
					<span className="not-sale">{customNumber(finalProductPrice, 'đ')} </span>
				)}
			</div>
			<div className="pro-details-rating-wrap">
				<div className="pro-details-rating">
					<StarIcons rating_number={rating_number} />
				</div>
			</div>

			<div className="pro-details-list">
				<p>{product.shortDescription}</p>
			</div>

			<div className="pro-details-cart btn-hover pro-attributes">
				{menus && menus.map((menu, key) => {

					return (
						<div key={key} className="d-flex w-100">
							<p>{menu.name}</p>
							{
								menu.attributes && menu.attributes.map((attribute, key2) => {
									return (
										<span key={key2}
											onClick={() =>
												handleSetAttributes(menu.slug, attribute.name)
											}
											className={ selectedProductColor == attribute.name || selectedProductSize == attribute.name ? 'red' : ''}
										>{attribute.name}</span>
									);
								})
							}
						</div>
					);
				})}
			</div>

			<div className="pro-details-quality">
				<div className="cart-plus-minus">
					<button
						onClick={() =>
							setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
						}
						className="dec qtybutton"
					>
						-
					</button>
					<input
						className="cart-plus-minus-box"
						type="text"
						value={quantityCount}
						readOnly
					/>
					<button
						onClick={() =>
							setQuantityCount(
								quantityCount < product.pro_amount - productCartQty
									? quantityCount + 1
									: quantityCount
							)
						}
						className="inc qtybutton"
					>
						+
					</button>
				</div>
				<div className="pro-details-cart btn-hover">
					{product.pro_amount && product.pro_amount > 0 ? (
						<button
							onClick={() =>
								addToCart(
									product,
									addToast,
									quantityCount,
									selectedProductColor,
									selectedProductSize
								)
							}
							disabled={productCartQty >= product.pro_amount}
						>
							{" "}
							Thêm giỏ hàng{" "}
						</button>
					) : (
						<button disabled>Out of stock</button>
					)}
				</div>
				{
					userId != null && <div className="pro-details-wishlist btn-hover">
						<button
							className={wishlistItem !== undefined ? "active" : ""}
							disabled={wishlistItem !== undefined}
							title={
								wishlistItem !== undefined
									? "Added to wishlist"
									: "Add to wishlist"
							}
							onClick={() => addToWishlist({ ...product, user_like: userId }, addToast)}
						>
							<i className="pe-7s-like" />
						</button>
					</div>
				}

			</div>
			{product.category ? (
				<div className="pro-details-meta">
					<span>Danh mục :</span>
					<ul>
						<li >
							<Link to={process.env.PUBLIC_URL + "/shop" + '?category_id=' + product?.category?.id}>
								{product?.category?.c_name}
							</Link>
						</li>
					</ul>
				</div>
			) : (
				""
			)}

		</div>
	);
};

ProductDescriptionInfo.propTypes = {
	addToCart: PropTypes.func,
	addToWishlist: PropTypes.func,
	addToast: PropTypes.func,
	cartItems: PropTypes.array,
	compareItem: PropTypes.array,
	currency: PropTypes.object,
	discountedPrice: PropTypes.number,
	finalDiscountedPrice: PropTypes.number,
	finalProductPrice: PropTypes.number,
	product: PropTypes.object,
	wishlistItem: PropTypes.object
};

const mapDispatchToProps = dispatch => {
	return {
		addToCart: (
			item,
			addToast,
			quantityCount,
			selectedProductColor,
			selectedProductSize
		) => {
			dispatch(
				addToCart(
					item,
					addToast,
					quantityCount,
					selectedProductColor,
					selectedProductSize
				)
			);
		},
		addToWishlist: (item, addToast) => {
			dispatch(addToWishlist(item, addToast));
		},
	};
};

export default connect(null, mapDispatchToProps)(ProductDescriptionInfo);
