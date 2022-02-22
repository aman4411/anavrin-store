const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetail, createProductReview, getProductReviews, deleteProductReview } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authentication");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteProductReview);
router.route("/product/review").put(isAuthenticatedUser,createProductReview);
router.route("/product/:id").get(getProductDetail);
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles('admin'), createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser,authorizeRoles('admin'), deleteProduct);




module.exports = router;