import React, { useState, useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useNavigate } from "react-router-dom";
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
        const apiGatewayUrl = 'https://r8dry1y4vb.execute-api.us-east-1.amazonaws.com/getTeamsData'; // Replace with your API Gateway URL
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

      <div className="">
        <div className="px-8 text-xl pt-5 font-medium bg-gray-100">Achievements</div>

        <div className="flex justify-center bg-gray-100 pb-10 pt-5 p-5">
          <div className="container w-4/12 mr-5 ml-2 rounded-2xl mx-auto bg-white shadow-xl">
            <div className="w-11/12 rounded-lg mx-auto">
              <div className="bg-white my-6">
                <table className="text-left w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 bg-gray-700 font-bold uppercase text-sm text-white border-b border-grey-light">Users</th>
                      <th className="py-4 px-6 text-center bg-gray-700 font-bold uppercase text-sm text-white border-b border-grey-light">Achievements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiData.map((item, index) => (
                      <tr className="hover:bg-grey-lighter" key={index}>
                        <td className="py-4 px-6 border-b border-grey-light">{item.member1}</td>
                        <td className="py-4 px-6 text-center border-b border-grey-light">
                          {item.achievements}
                        </td>
                      </tr>
                    ))}
                    {apiData.map((item, index) => (
                      <tr className="hover:bg-grey-lighter" key={index}>
                        <td className="py-4 px-6 border-b border-grey-light">{item.member2}</td>
                        <td className="py-4 px-6 text-center border-b border-grey-light">
                          {item.achievements}
                        </td>
                      </tr>
                    ))}
                    {apiData.map((item, index) => (
                      <tr className="hover:bg-grey-lighter" key={index}>
                        <td className="py-4 px-6 border-b border-grey-light">{item.member3}</td>
                        <td className="py-4 px-6 text-center border-b border-grey-light">
                          {item.achievements}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
