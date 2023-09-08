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

router.post("/createaddress", auth, isCustomer, createAddress)
router.put('/updateaddress', auth, isCustomer, updateAddressById);
router.get("/getaddress",auth, getAddressById)
router.delete("/deleteaddress", auth, isCustomer,deleteAddressById)
router.get("/getalladdress",auth, getAllAddresses)


module.exports = router;
