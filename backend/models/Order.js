const mongoose = require("mongoose");


const orderItemSchema = new mongoose.Schema({

    productId: {

        type: String,

        required: true

    },

    name: {

        type: String,

        required: true

    },

    brand: {

        type: String,

        default: "NovaMarket"

    },

    image: {

        type: String,

        default: ""

    },

    price: {

        type: Number,

        required: true

    },

    quantity: {

        type: Number,

        required: true,

        min: 1

    },

    total: {

        type: Number,

        required: true

    }

});


const orderSchema = new mongoose.Schema({

    orderId: {

        type: String,

        unique: true,

        required: true

    },


    customer: {

        name: {

            type: String,

            required: true

        },

        phone: {

            type: String,

            required: true

        },

        email: {

            type: String,

            default: ""

        },

        address: {

            type: String,

            required: true

        },

        city: {

            type: String,

            required: true

        },

        state: {

            type: String,

            required: true

        },

        pincode: {

            type: String,

            required: true

        }

    },


    items: [

        orderItemSchema

    ],


    subtotal: {

        type: Number,

        required: true

    },


    total: {

        type: Number,

        required: true

    },


    status: {

        type: String,

        enum: [

            "Pending",

            "Confirmed",

            "Processing",

            "Shipped",

            "Delivered",

            "Cancelled"

        ],

        default: "Pending"

    },


    paymentStatus: {

        type: String,

        enum: [

            "Pending",

            "Paid",

            "Failed"

        ],

        default: "Pending"

    },


    paymentMethod: {

        type: String,

        default: "Cash on Delivery"

    }

}, {

    timestamps: true

});


module.exports = mongoose.model(

    "Order",

    orderSchema

);