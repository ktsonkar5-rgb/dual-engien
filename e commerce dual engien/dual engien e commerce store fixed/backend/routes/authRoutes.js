const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");


const router = express.Router();

function requireSetupKey(req, res, next) {
    const setupKey = req.get("x-setup-key");

    const correctSetupKey =
        process.env.ADMIN_SETUP_KEY;

    if (!correctSetupKey) {
        return res.status(500).json({
            message:
                "ADMIN_SETUP_KEY is missing in the .env file"
        });
    }

    if (
        !setupKey ||
        setupKey.trim() !== correctSetupKey.trim()
    ) {
        return res.status(403).json({
            message:
                "Invalid or missing admin setup key"
        });
    }

    next();
}


/* =========================================
   CREATE ADMIN
   USE ONLY ONCE
========================================= */

router.post(

    "/create-admin",

    requireSetupKey,

    async (req, res) => {

        try {

            const {

                username,

                password

            } = req.body;


            if (

                !username ||

                !password

            ) {

                return res.status(400).json({

                    message:

                        "Username and password are required"

                });

            }


            const existingAdmin =

                await Admin.findOne({

                    username

                });


            if (existingAdmin) {

                return res.status(400).json({

                    message:

                        "Admin already exists"

                });

            }


            const hashedPassword =

                await bcrypt.hash(

                    password,

                    12

                );


            const admin =

                await Admin.create({

                    username,

                    password:

                        hashedPassword

                });


            res.status(201).json({

                message:

                    "Admin created successfully",

                adminId:

                    admin._id

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                message:

                    "Server error"

            });

        }

    }

);


/* =========================================
   ADMIN LOGIN
========================================= */

router.post(

    "/login",

    async (req, res) => {

        try {

            const {

                username,

                password

            } = req.body;


            if (

                !username ||

                !password

            ) {

                return res.status(400).json({

                    message:

                        "Username and password are required"

                });

            }


            const admin =

                await Admin.findOne({

                    username

                });


            if (!admin) {

                return res.status(401).json({

                    message:

                        "Invalid username or password"

                });

            }


            const isPasswordCorrect =

                await bcrypt.compare(

                    password,

                    admin.password

                );


            if (!isPasswordCorrect) {

                return res.status(401).json({

                    message:

                        "Invalid username or password"

                });

            }


            const token =

                jwt.sign(

                    {

                        id:

                            admin._id,

                        username:

                            admin.username

                    },

                    process.env.JWT_SECRET,

                    {

                        expiresIn:

                            "7d"

                    }

                );


            res.json({

                message:

                    "Login successful",

                token,

                admin: {

                    id:

                        admin._id,

                    username:

                        admin.username

                }

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                message:

                    "Server error"

            });

        }

    }

);


module.exports = router;