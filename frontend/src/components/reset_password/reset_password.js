import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import { database } from "../config";
import { sendPasswordResetEmail } from "firebase/auth";

export default function Reset() {

    // constants for navigation, email and it's error
    const history = useNavigate();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // target email value on change
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError("");
    };

    // function to submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation for email format
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            setEmailError("Invalid email format");
            return;
        }

        // reset password function call using GCP Firabase Authentication
        const email_id = e.target.email.value;
        sendPasswordResetEmail(database, email_id).then(data => {
            alert("Password Reset link sent to your registered email.")
            history("/login")
        }).catch(err => {
            alert(err.code)
        })

    };

    return (
        <div>
            <Header currentPage="/login" />

            <form
                className="max-w-sm bg-white pt-20 pb-96 mb-36 m-auto"
                onSubmit={(e) => handleSubmit(e)}
            >
                <div className="mx-14 ml-0">
                    <h2 className="text-base font-semibold leading-7 text-xl text-gray-900">
                        Reset Password
                    </h2>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 w-max">
                        <div className="sm:col-span-4 ">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md ring-1 ring-gray-300">
                                    <input
                                        type="text"
                                        name="email"
                                        onChange={handleEmailChange}
                                        value={email}
                                        id="outlined-basic"
                                        required
                                        label="Email"
                                        variant="outlined"
                                        className="block flex-1 border-0 bg-transparent py-1.5 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                {emailError && (
                                    <div className="text-red-500 mt-2">{emailError}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-x-6">
                        <button
                            type="submit"
                            className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Reset
                        </button>
                    </div>

                </div>
            </form>
            <Footer />
        </div>
    );
}