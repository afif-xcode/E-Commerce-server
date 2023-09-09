const express = require("express");
const router = express.Router();

const {
    createAddress,
    updateAddressById,
    getAddressById,
    deleteAddressById,
    getAllAddresses
} = require('../controllers/Address');

const { auth, isCustomer } = require("../middlewares/auth");

router.post("/createAddress", auth, isCustomer, createAddress)
router.put('/updateAddress', auth, isCustomer, updateAddressById);
router.get("/getAddress",auth, getAddressById)
router.delete("/deleteAddress", auth, isCustomer,deleteAddressById)
router.get("/getAllAddress",auth, getAllAddresses)


module.exports = router;
