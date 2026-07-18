const API_URL =

    "http://localhost:5000/api";


const loginForm =

    document.getElementById(

        "adminLoginForm"

    );


const loginMessage =

    document.getElementById(

        "loginMessage"

    );


loginForm.addEventListener(

    "submit",

    async function (event) {


        event.preventDefault();


        const username =

            document

                .getElementById(

                    "username"

                )

                .value

                .trim();


        const password =

            document

                .getElementById(

                    "password"

                )

                .value;


        loginMessage.textContent =

            "Logging in...";


        try {


            const response =

                await fetch(

                    `${API_URL}/auth/login`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":

                                "application/json"

                        },

                        body:

                            JSON.stringify({

                                username,

                                password

                            })

                    }

                );


            const data =

                await response.json();


            if (!response.ok) {

                throw new Error(

                    data.message ||

                    "Login failed"

                );

            }


            localStorage.setItem(

                "novamarket-admin-token",

                data.token

            );


            localStorage.setItem(

                "novamarket-admin",

                JSON.stringify(

                    data.admin

                )

            );


            loginMessage.style.color =

                "#8de0d5";


            loginMessage.textContent =

                "Login successful. Redirecting...";


            setTimeout(

                () => {

                    window.location.href =

                        "admin-dashboard.html";

                },

                700

            );


        } catch (error) {


            loginMessage.style.color =

                "#ff9b9b";


            loginMessage.textContent =

                error.message;


        }

    }

);