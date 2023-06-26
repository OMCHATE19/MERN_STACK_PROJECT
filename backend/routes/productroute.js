const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct} = require("../controllers/productcontroller");
const { get } = require("../app");
const router=express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/new").post(createProduct);
router.route("/product/:id").put(updateProduct).delete(deleteProduct);

module.exports = router

