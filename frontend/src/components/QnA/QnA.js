import React, { useState, useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function QnA() {

  const history = useNavigate();

  const [answer, setAnswer] = useState("");
  const [randomIndex, setRandomIndex] = useState(0);

  // Function to generate a random index
  const generateRandomIndex = (max) => {
    return Math.floor(Math.random() * max);
  };

  // Function to set a random index on component mount
  useEffect(() => {
    const totalDivs = 3; // The total number of questions
    const randomIdx = generateRandomIndex(totalDivs);
    setRandomIndex(randomIdx);
  }, []);

  // target answer value on change
  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  // function to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    var user_id = localStorage.getItem('user_id')

    // Prepare the data object for the API POST call
    const postData = {
      "userId": user_id,
      "answer": answer
    }

    const customHeader = {
      'Content-Type': 'application/json'
    }

    try {
      const apiGatewayUrl = 'https://r8dry1y4vb.execute-api.us-east-1.amazonaws.com/verify-mfa'; // API Gateway URL

      const response = await axios.post(`${apiGatewayUrl}`, postData, { headers: customHeader });

      console.log(response.data); // Response data from the Lambda function

      if (response.data.flagValue) {
        localStorage.setItem("flag", response.data.flagValue);
        alert("Login Successful.")
        window.localStorage.setItem("isLoggedIn", "true");
        history("/")
      }
      else {
        alert("Wrond Answer, Please try again!")
      }

    } catch (error) {
      console.error('Error calling Lambda function:', error);
    }

  }

  return (
    <div>
      <Header currentPage="/signup" />
      <form
        className="max-w-sm bg-white pt-12 pb-96 mb-44 m-auto"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="mx-8">
          <h2 className="text-base font-semibold leading-7 text-xl text-gray-900">
            Two-Factor Authentication
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-4">

            <div className={`sm:col-span-4 w-full ${randomIndex === 0 ? '' : 'hidden'}`}>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                What is your favourite food?
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  required
                  type="text"
                  onChange={handleAnswerChange}
                  value={answer}
                  name="ans1"
                  className="block flex-1 border-0 bg-transparent py-1.5 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className={`sm:col-span-4 w-full ${randomIndex === 1 ? '' : 'hidden'}`}>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Who is your best friend?
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  required
                  type="text" onChange={handleAnswerChange}
                  value={answer}
                  name="ans1"
                  className="block flex-1 border-0 bg-transparent py-1.5 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className={`sm:col-span-4 w-full ${randomIndex === 2 ? '' : 'hidden'}`}>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                What is your birth place?
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  required
                  type="text" onChange={handleAnswerChange}
                  value={answer}
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
              Login
            </button>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
}



