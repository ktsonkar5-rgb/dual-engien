const express = require("express");

const router = express.Router();

const Order = require("../models/Order");
const protectAdmin = require("../middleware/authMiddleware");


/* =========================================
   GENERATE ORDER ID
========================================= */

function generateOrderId() {

    const randomNumber =

        Math.floor(

            100000 +

            Math.random() *

            900000

        );


    return `NOVA-${randomNumber}`;

}


/* =========================================
   CREATE NEW ORDER
========================================= */

router.post(

    "/",

    async (req, res) => {


        try {


            const {

                customer,

                items,

                subtotal,

                total

            } = req.body;


            if (

                !customer ||

                !items ||

                !items.length

            ) {

                return res.status(400).json({

                    message:

                        "Customer and order items are required."

                });

            }


            const orderItems =

                items.map(item => ({

                    productId:

                        String(

                            item.productId ||

                            item.id

                        ),


                    name:

                        item.name,


                    brand:

                        item.brand || "NovaMarket",


                    image:

                        item.image || "",


                    price:

                        Number(

                            item.price

                        ) || 0,


                    quantity:

                        Number(

                            item.quantity

                        ) || 1,


                    total:

                        (

                            Number(

                                item.price

                            ) || 0

                        ) *

                        (

                            Number(

                                item.quantity

                            ) || 1

                        )

                }));


            const safeTotal =

                orderItems.reduce(

                    (

                        total,

                        item

                    ) => {

                        return total +

                            item.total;

                    },

                    0

                );


            const order =

                new Order({

                    orderId:

                        generateOrderId(),


                    customer,


                    items:

                        orderItems,


                    subtotal:

                        safeTotal,


                    total:

                        safeTotal

                });


            const savedOrder =

                await order.save();


            res.status(201).json({

                success: true,

                message:

                    "Order created successfully.",

                order:

                    savedOrder

            });


        } catch (error) {


            console.error(

                "ORDER CREATION ERROR:",

                error

            );


            res.status(500).json({

                success: false,

                message:

                    "Failed to create order."

            });

        }

    }

);


/* =========================================
   GET ALL ORDERS
========================================= */

router.get(

    "/",

    protectAdmin,

    async (req, res) => {


        try {


            const orders =

                await Order

                    .find()

                    .sort({

                        createdAt: -1

                    });


            res.json({

                success: true,

                orders

            });


        } catch (error) {


            res.status(500).json({

                success: false,

                message:

                    "Failed to fetch orders."

            });

        }

    }

);


/* =========================================
   GET SINGLE ORDER
========================================= */

router.get(

    "/:orderId",

    protectAdmin,

    async (req, res) => {


        try {


            const order =

                await Order.findOne({

                    orderId:

                        req.params.orderId

                });


            if (!order) {

                return res.status(404).json({

                    message:

                        "Order not found."

                });

            }


            res.json({

                success: true,

                order

            });


        } catch (error) {


            res.status(500).json({

                message:

                    "Failed to fetch order."

            });

        }

    }

);


/* =========================================
   UPDATE ORDER STATUS
========================================= */

router.patch(

    "/:orderId/status",

    protectAdmin,

    async (req, res) => {


        try {


            const {

                status

            } = req.body;


            const order =

                await Order.findOneAndUpdate(

                    {

                        orderId:

                            req.params.orderId

                    },


                    {

                        status

                    },


                    {

                        new: true

                    }

                );


            if (!order) {

                return res.status(404).json({

                    message:

                        "Order not found."

                });

            }


            res.json({

                success: true,

                order

            });


        } catch (error) {


            res.status(500).json({

                message:

                    "Failed to update order status."

            });

        }

    }

);


/* =========================================
   DELETE ORDER
========================================= */

router.delete(

    "/:orderId",

    protectAdmin,

    async (req, res) => {


        try {


            const deletedOrder =

                await Order.findOneAndDelete({

                    orderId:

                        req.params.orderId

                });


            if (!deletedOrder) {

                return res.status(404).json({

                    message:

                        "Order not found."

                });

            }


            res.json({

                success: true,

                message:

                    "Order deleted successfully."

            });


        } catch (error) {


            res.status(500).json({

                message:

                    "Failed to delete order."

            });

        }

    }

);


module.exports = router;