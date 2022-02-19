const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetail } = require("../controllers/productController");
const { isAuthenticatedUser } = require("../middleware/authentication");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticatedUser, createProduct);
router.route("/product/:id").get(getProductDetail).put(isAuthenticatedUser, updateProduct).delete(isAuthenticatedUser, deleteProduct);

module.exports = router;