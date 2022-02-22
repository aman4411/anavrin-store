const express = require('express');
const { newOrder, getOrderDetail, getMyOrders } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authentication');
const router = express.Router();

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getOrderDetail);
router.route('/orders/me').get(isAuthenticatedUser,getMyOrders);

module.exports = router;