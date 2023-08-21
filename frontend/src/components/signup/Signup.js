import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import { database } from "../config";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp() {

  // constants for various values and it's validatioln errors
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [food, setFood] = useState("");
  const [friend, setFriend] = useState("");
  const [birth, setBirth] = useState("");
  let user_id;

  // target email value on change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

   // target password value on change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

   // target confirm password value on change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

   // target food answer value on change
  const handleFoodChange = (e) => {
    setFood(e.target.value);
  };

   // target friend answer value on change
  const handleFriendChange = (e) => {
    setFriend(e.target.value);
  };

   // target birth place answer value on change
  const handleBirthChange = (e) => {
    setBirth(e.target.value);
  };

   // function to be called on Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation for email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email format");
      return;
    }

    // Custom validation for passwords
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    // confirm password validations
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    // condition to set different answers for all three questions
    if (food == friend || food == birth || friend == birth) {
      alert("All three answers should be unique. None of them can be same.")
    }
    else {
      // Proceed with form submission if all validations pass

      // signupo function using email and poassword using GCP Firebase Authentication
      await createUserWithEmailAndPassword(database, email, password).then((data) => {
        console.log(data, "authData");
        user_id = data.user.uid;
      }).catch(err => {
        alert(err.code)
      });

      // Prepare the data object for the API POST call
      const postData = {
        "userId": user_id,
        "food": food,
        "friend": friend,
        "birth": birth
      };

      // post API request call
      await fetch("https://r8dry1y4vb.execute-api.us-east-1.amazonaws.com/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData)

      }).then((res) => {
        console.log(res)
        alert("Registration Successful.")
        history("/login")
      })
    }
  };

  return (
    <div>
      <Header currentPage="/signup" />
      <form
        className="max-w-sm bg-white pt-12 pb-20 m-auto"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="mx-8">
          <h2 className="text-base font-semibold leading-7 text-xl text-gray-900">
            Registration
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-4">
            <div className="sm:col-span-4 w-full">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  id="outlined-basic"
                  required
                  label="Email"
                  variant="outlined"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="block flex-1 border-0 bg-transparent py-1.5 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
              {emailError && (
                <div className="text-red-500 mt-2">{emailError}</div>
              )}
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  required
                  label="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {passwordError && (
                <div className="text-red-500 mt-2">{passwordError}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="time"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  required
                  label="Confirm Password"
                  type="password"
                  name="confirm_password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {confirmPasswordError && (
                <div className="text-red-500 mt-2">{confirmPasswordError}</div>
              )}
            </div>
          </div>

          <h2 className="text-base font-semibold leading-7 text-xl mt-10 text-gray-900">
            Security Question & Answers
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-4">
            <div className="sm:col-span-4 w-full">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                What is your favourite food?
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  required
                  type="text"
                  onChange={handleFoodChange}
                  value={food}
                  name="ans1"
                  className="block flex-1 border-0 bg-transparent py-1.5 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4 w-full">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Who is your best friend?
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  required
                  type="text"
                  onChange={handleFriendChange}
                  value={friend}
                  name="ans1"
                  className="block flex-1 border-0 bg-transparent py-1.5 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4 w-full">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                What is your birth place?
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  required
                  type="text"
                  onChange={handleBirthChange}
                  value={birth}
                  name="ans1"
                  className="block flex-1 border-0 bg-transparent py-1.5 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-x-6">
            <a
              href="/login"
              className="text-sm no-underline font-semibold leading-6 text-gray-800 hover:underline"
            >
              Already have an account? Login
            </a>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
}