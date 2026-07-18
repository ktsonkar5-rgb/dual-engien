const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(

    {

        name: {

            type: String,

            required: true,

            trim: true

        },


        brand: {

            type: String,

            default: "NOVA MARKET",

            trim: true

        },


        model: {

            type: String,

            default: ""

        },


        price: {

            type: Number,

            required: true

        },


        category: {

            type: String,

            required: true

        },


        store: {

            type: String,

            enum: [

                "electronics",

                "riding"

            ],

            default: "electronics"

        },


        image: {

            type: String,

            required: true

        },


        description: {

            type: String,

            default: ""

        },


        keywords: {

            type: String,

            default: ""

        },


        featured: {

            type: Boolean,

            default: false

        },


        inStock: {

            type: Boolean,

            default: true

        },


        rating: {

            type: Number,

            default: 0

        }

    },

    {

        timestamps: true

    }

);


module.exports = mongoose.model(

    "Product",

    productSchema

);