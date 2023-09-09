const express = require("express");
const router = express.Router();

const {
    createOrder
} = require("../controllers/Orders");
const { auth, isCustomer } = require("../middlewares/auth");

router.post('/creatOrder', auth, isCustomer, createOrder);

module.exports = router;
