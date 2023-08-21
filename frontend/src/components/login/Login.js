import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import { auth, provider, database } from "../config";
import { signInWithEmailAndPassword, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

export default function Login() {

  // constant variables for navigation, email, password and it's respective error.
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // email value target change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  // password value target change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend validation for email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email format");
      return;
    }

    // validation for password length
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    // Proceed with form submission if all validations pass

    // function to login with credentials option
    signInWithEmailAndPassword(database, email, password).then((data) => {
      console.log(data, "authData");
      localStorage.setItem("user_id", data.user.uid);
      localStorage.setItem("user_email", data.user.email);
      history("/QnA");
    }).catch(err => {
      alert(err.code)
    });
  };

  // function to login with google
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider).then((data) => {
      localStorage.setItem("user_id", data.user.uid);
      window.localStorage.setItem("isLoggedIn", "true");
      history('/')
    }).catch((err) => {
      console.log(err.code);
    })
  }

  // function to login with facebook
  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider).then((data) => {
      localStorage.setItem("user_id", data.user.uid);
      window.localStorage.setItem("isLoggedIn", "true");
      history("/");
    }).catch((err) => {
      console.log(err.code);
    })
  }

  return (
    <div>
      <Header currentPage="/login" />

      <form
        className="max-w-sm bg-white pt-12 m-auto"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="mx-14 ml-0">
          <h2 className="text-base font-semibold leading-7 text-xl text-gray-900">
            Login
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

            <div className="sm:col-span-4 ">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <div className="flex rounded-md ring-1 ring-gray-300">
                  <input
                    name="password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    label="Password"
                    type="password"
                    className="block flex-1 border-0 bg-transparent py-1.5 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
                {passwordError && (
                  <div className="text-red-500 mt-2">{passwordError}</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-x-6">
            <a
              href="/signup"
              className="text-sm no-underline font-semibold leading-6 text-gray-800 hover:underline"
            >
              Don't have an account? Register
            </a>
          </div>

          <div className="flex items-center justify-center gap-x-6">
            <a
              href="/reset"
              className="text-sm no-underline font-semibold leading-6 text-gray-800 hover:underline"
            >
              Forgot Password? Reset
            </a>
          </div>
        </div>
      </form>
      <div className="mt-6 mr-10 flex items-center justify-center gap-x-6">
        <button onClick={handleGoogleLogin} type="button" className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
          <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z">
            </path>
          </svg>
          Sign in with Google
        </button>
      </div>

      <div className="mt-4 mr-10 pb-64 flex items-center justify-center gap-x-6">
        <button onClick={signInWithFacebook} type="button" className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2">
          <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"></path></svg>
          Sign in with Facebook
        </button>
      </div>
      <Footer />
    </div>
  );
}