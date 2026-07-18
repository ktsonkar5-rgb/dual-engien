const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const protectAdmin = require("../middleware/authMiddleware");

/* GET ALL PRODUCTS - PUBLIC */
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
});

/* GET SINGLE PRODUCT - PUBLIC */
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }
});

/* CREATE PRODUCT - ADMIN ONLY */
router.post("/", protectAdmin, async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("CREATE PRODUCT ERROR:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/* UPDATE PRODUCT - ADMIN ONLY */
router.put("/:id", protectAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error("UPDATE PRODUCT ERROR:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/* DELETE PRODUCT - ADMIN ONLY */
router.delete("/:id", protectAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }
});

module.exports = router;
