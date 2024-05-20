import PropTypes from "prop-types";
import React from "react";
import { checkTimeNow } from "../../helpers/func";
import { buildImage } from "../../services";

const ProductImageFixed = ({ product }) => {
  return (
    <div className="product-large-image-wrapper">
      {product?.pro_sale || product.pro_hot === 1 ? (
        <div className="product-img-badges">
          {product?.pro_sale && (checkTimeNow(product?.sale_to) && product.pro_sale) ? (
            <span className="pink">-{product?.pro_sale}%</span>
          ) : (
            ""
          )}
          {product.pro_hot === 1 ? <span className="purple">Hot</span> : ""}
        </div>
      ) : (
        ""
      )}

      <div className="product-fixed-image">
        {buildImage(product.pro_avatar) ? (
          <img
            src={buildImage(product.pro_avatar)}
            alt=""
            className="img-fluid"
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

ProductImageFixed.propTypes = {
  product: PropTypes.object
};

export default ProductImageFixed;
