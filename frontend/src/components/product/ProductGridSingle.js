// @ts-nocheck
import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { checkTimeNow, customNumber } from "../../helpers/func";
import { getDiscountPrice } from "../../helpers/product";
import { buildImage, getItem, onErrorImage } from "../../services";
import ProductModal from "./ProductModal";
import Rating from "./sub-components/ProductRating";

const ProductGridSingle = ( {
	product,
	currency,
	addToCart,
	addToWishlist,
	addToCompare,
	cartItem,
	wishlistItem,
	compareItem,
	sliderClassName,
	spaceBottomClass
} ) =>
{
	const [ modalShow, setModalShow ] = useState( false );
	const { addToast } = useToasts();

	const discountedPrice = (checkTimeNow(product?.sale_to) && product.pro_sale) ? getDiscountPrice( product.pro_price, product?.pro_sale ) : null;
	const finalProductPrice = +( product.pro_price * currency.currencyRate ).toFixed( 0 );
	const finalDiscountedPrice = +(
		discountedPrice * currency.currencyRate
	).toFixed( 0 );

	const userId = getItem('id');

	return (
		product &&
		<Fragment>
			<div
				className={ `col-xl-3 col-md-6 col-lg-4 col-sm-6 ${ sliderClassName ? sliderClassName : ""
					}` }
			>
				<div
					className={ `product-wrap ${ spaceBottomClass ? spaceBottomClass : "" }` }
				>
					<div className="product-img">
						<Link to={ process.env.PUBLIC_URL + "/product/" + product.id }>
							<img
								className="default-img"
								src={ buildImage( product.pro_avatar ) }
								alt={ buildImage( product.pro_avatar ) }
								onError={ onErrorImage }
							/>
							{ product?.product_images?.length > 0 ? (
								<img
									className="hover-img"
									src={buildImage(product.product_images[ 0 ].path)}
									alt={buildImage(product.product_images[ 0 ].path)}
									onError={ onErrorImage }
								/>
							) : (
								""
							) }
						</Link>
						{ product?.pro_sale || product.pro_hot === 1 ? (
							<div className="product-img-badges">
								{ product?.pro_sale && (checkTimeNow(product?.sale_to) && product.pro_sale) ? (
									<span className="pink">-{ product?.pro_sale }%</span>
								) : (
									""
								) }
								{ product.pro_hot === 1 ? <span className="purple">Hot</span> : "" }
							</div>
						) : (
							""
						) }

						<div className="product-action">
							{
								userId != null && <div className="pro-same-action pro-wishlist">
								<button
									className={ wishlistItem !== undefined ? "active" : "" }
									disabled={ wishlistItem !== undefined }
									title={
										wishlistItem !== undefined
											? "Added to wishlist"
											: "Add to wishlist"
									}
									onClick={ () => addToWishlist( {...product, user_like: userId}, addToast ) }
								>
									<i className="pe-7s-like" />
								</button>
							</div>
							}
							<div className="pro-same-action pro-cart">
								{ product.affiliateLink ? (
									<a
										href={ product.affiliateLink }
										rel="noopener noreferrer"
										target="_blank"
									>
										{ " " }
										Buy now{ " " }
									</a>
								) : product.variation && product.variation.length >= 1 ? (
									<Link to={ `${ process.env.PUBLIC_URL }/product/${ product.id }` }>
										Select Option
									</Link>
								) : product.pro_amount && product.pro_amount > 0 ? (
									<button
										onClick={ () => addToCart( product, addToast ) }
										className={
											cartItem !== undefined && cartItem.quantity > 0
												? "active"
												: ""
										}
										disabled={ cartItem !== undefined && cartItem.quantity > 0 }
										title={
											cartItem !== undefined ? "Added to cart" : "Thêm giỏ hàng"
										}
									>
										{ " " }
										<i className="pe-7s-cart"></i>{ " " }
										{ cartItem !== undefined && cartItem.quantity > 0
											? "Added"
											: "Thêm giỏ hàng" }
									</button>
								) : (
									<button disabled className="active">
										Hết hàng
									</button>
								) }
							</div>
							{/* <div className="pro-same-action pro-quickview">
								<button onClick={ () => setModalShow( true ) } title="Quick View">
									<i className="pe-7s-look" />
								</button>
							</div> */}
						</div>
					</div>
					<div className="product-content text-center">
						<h3>
							<Link to={ process.env.PUBLIC_URL + "/product/" + product.id }>
								{ product.pro_name }
							</Link>
						</h3>
						{ product.rating && product.rating > 0 ? (
							<div className="product-rating">
								<Rating ratingValue={ product.rating } />
							</div>
						) : (
							""
						) }
						<div className="product-price">
							{ discountedPrice !== null ? (
								<Fragment>
									<span>{ customNumber( finalDiscountedPrice, 'đ' ) }</span>{ " " }
									<span className="old">
										{ customNumber( finalProductPrice, 'đ' ) }
									</span>
								</Fragment>
							) : (
								<span>{ customNumber( finalProductPrice, 'đ' ) } </span>
							) }
						</div>
					</div>
				</div>
			</div>
			{/* product modal */ }
			<ProductModal
				show={ modalShow }
				onHide={ () => setModalShow( false ) }
				product={ product }
				currency={ currency }
				discountedprice={ discountedPrice }
				finalproductprice={ finalProductPrice }
				finaldiscountedprice={ finalDiscountedPrice }
				cartitem={ cartItem }
				wishlistitem={ wishlistItem }
				compareitem={ compareItem }
				addtocart={ addToCart }
				addtowishlist={ addToWishlist }
				addtocompare={ addToCompare }
				addtoast={ addToast }
			/>
		</Fragment>
	);
};

ProductGridSingle.propTypes = {
	addToCart: PropTypes.func,
	addToCompare: PropTypes.func,
	addToWishlist: PropTypes.func,
	cartItem: PropTypes.object,
	compareItem: PropTypes.object,
	currency: PropTypes.object,
	product: PropTypes.object,
	sliderClassName: PropTypes.string,
	spaceBottomClass: PropTypes.string,
	wishlistItem: PropTypes.object
};

export default ProductGridSingle;
