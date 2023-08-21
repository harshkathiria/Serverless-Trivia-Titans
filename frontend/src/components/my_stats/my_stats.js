import React, { useState, useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import axios from "axios";

const customHeader = {
  'Content-Type': 'application/json'
}

export default function Stats() {

  // State to store the data received from the API
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    // Function to fetch data from the API
    async function fetchData() {
      try {
        const apiGatewayUrl = 'https://r8dry1y4vb.execute-api.us-east-1.amazonaws.com/getTeamsData'; // API Gateway URL
        const response = await axios.get(`${apiGatewayUrl}`, { headers: customHeader });
        setApiData(response.data); // Update the state with API response data
      } catch (error) {
        console.error('Error calling Lambda function:', error);
      }
    }

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once, similar to componentDidMount

  return (
    <div>
      <Header currentPage="/signup" />

      <div className="px-8 text-xl font-medium pt-5 bg-gray-100">Statistics</div>

      <div className="flex justify-center bg-gray-100 pb-10 pt-5 p-14">
        <div className="container mx-auto pr-4">
          <div className="w-56 bg-white max-w-xs mx-auto rounded-md overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-100 cursor-pointer">
            <div className="h-14 bg-gray-700 flex items-center justify-between">
              <p className="mr-0 text-white text-lg pl-5">Games Played</p>
            </div>

            <p className="py-4 text-xl ml-5">8</p>
          </div>
        </div>

        <div className="container mx-auto pr-4">
          <div className="w-56 bg-white max-w-xs mx-auto rounded-md overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-100 cursor-pointer">
            <div className="h-14 bg-green-600 flex items-center justify-between">
              <p className="mr-0 text-white text-lg pl-5">Win</p>
            </div>
            <p className="py-4 text-xl ml-5">6</p>
          </div>
        </div>

        <div className="container mx-auto pr-4">
          <div className="w-56 bg-white max-w-xs mx-auto rounded-md overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-100 cursor-pointer">
            <div className="h-14 bg-red-600 flex items-center justify-between">
              <p className="mr-0 text-white text-lg pl-5">Loss</p>
            </div>
            <p className="py-4 text-xl ml-5">2</p>
          </div>
        </div>

        <div className="container mx-auto pr-4">
          <div className="w-56 bg-white max-w-xs mx-auto rounded-md overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-100 cursor-pointer">
            <div className="h-14 bg-blue-500 flex items-center justify-between">
              <p className="mr-0 text-white text-lg pl-5">Win/Loss Ratio</p>
            </div>
            <p className="py-4 text-xl ml-5">3/1</p>
          </div>
        </div>

        <div className="container mx-auto pr-4">
          <div className="w-56 bg-white max-w-xs mx-auto rounded-md overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-100 cursor-pointer">
            <div className="h-14 bg-gray-700 flex items-center justify-between">
              <p className="mr-0 text-white text-lg pl-5">Total Points Earned</p>
            </div>
            <p className="py-4 text-xl ml-5">36</p>

          </div>
        </div>
      </div>

      <div className="px-8 text-xl font-medium bg-gray-100">Teams</div>

      <div className="flex justify-center bg-gray-100 py-10 p-5">

        {apiData.map((item, index) => (

          <div className="container mr-5 ml-2 mx-auto bg-white rounded-xl shadow-xl" key={index}>
            <div className="w-11/12 rounded-3xl mx-auto">
              <div className="bg-white my-6">
                <table className="text-left w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 bg-gray-700 rounded-lg font-bold uppercase text-sm text-white border-b border-grey-light">{item.teamName}</th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-grey-lighter">
                      <td className="py-4 px-6 border-b border-grey-light">{item.member1}</td>

                    </tr>
                    <tr className="hover:bg-grey-lighter">
                      <td className="py-4 px-6 border-b border-grey-light">{item.member2}</td>

                    </tr>
                    <tr className="hover:bg-grey-lighter">
                      <td className="py-4 px-6 border-b border-grey-light">{item.member3}</td>

                    </tr>
                    <tr className="hover:bg-grey-lighter">
                      <td className="py-4 px-6 border-b border-grey-light">{item.member4}</td>

                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}



