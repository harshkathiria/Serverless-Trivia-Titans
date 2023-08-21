import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header/header";
import Footer from "../footer/footer";
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ButtonBase, Avatar } from '@material-ui/core';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import useStyles from './Profile.styles'

var user_email = localStorage.getItem('user_email') // get user email from local storage.

const customHeader = {
  'Content-Type': 'application/json'
}

// AWS configuration for image storage to S3 bucket.
AWS.config.update({
  region: 'us-east-1',
  credentials: new AWS.Credentials({
    accessKeyId: 'ASIA5EBYPYWAFHTK2JTV',
    secretAccessKey: 'gP5hc4hmK7o4jPs6n2nVMPVc8iLI6wkwikYQ/0tH',
    sessionToken:
      'FwoGZXIvYXdzELT//////////wEaDNAx0w3YTroYIeP/kiLAAd/IERpfvhCjjWymyws4jy259dxAp7aXBAZF7+Lk9P8EokatBiN6bCEQ621uyVv16IwTl31kEv6TJlWr/PyfletcfL4yuSZPEJXPysjujRaRo/aPDPTma+KcHmM76QJohPwfbadjWEGxr32QAEIXbPnHyd1ihX2emGyx/hCUglg+68ibnrl557wMwHljv1oF2orCeU4F98T4xjqmBcOZmduPD7yfnLyRuXN/ezguTe2xblUbj+iDJz81P+hh4Y4n7ii+n7qmBjIt6vZeViwc6DTgRfuBeWkAeLOTC5FL4tvTDj2OgKois63zhZTrSiMF0WcmViib'
  })
});

const S3 = new AWS.S3();

function Profile() {

  const classes = useStyles();
  const [image, setImage] = useState(null);

  // target image file on change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // function to upload file to S3 bucket
  const handleUpload = async () => {

    if (image) {
      const uuid1 = uuidv4();
      const fileExtension = image.name.split('.').pop();
      // Create the new file name with UUID in between
      const fileName = `${image.name}-${uuid1}.${fileExtension}`;

      // try catch block for uploading image logic
      try {
        const uploadParams = {
          Bucket: 'profile-sdp24',
          Key: fileName,
          Body: image,
          ContentType: image.type
        };

        const uploadResult = await S3.upload(uploadParams).promise();

        if (uploadResult && uploadResult.Location) {
          return uploadResult.Location;
        }

        else {
          console.error('Error uploading image to S3.');
        }

      } catch (error) {
        console.error(error);
      }
    }
  };

  var [user, setUser] = useState({}); // User state

  // constant variables for first name, last name, contact and it's respective errors
  const [fname, setFName] = useState("");
  const [fnameError, setFNameError] = useState("");
  const [lname, setLName] = useState("");
  const [lnameError, setLNameError] = useState("");
  const [contact, setTel] = useState("");

  useEffect(() => {
    // Function to fetch data from the API
    async function fetchData() {
      try {
        const apiGatewayUrl = 'https://r8dry1y4vb.execute-api.us-east-1.amazonaws.com/getProfileData'; // API Gateway URL
        const response = await axios.get(`${apiGatewayUrl}`, { headers: customHeader });
        var user = {}
        const user_id = localStorage.getItem("user_id")
        response.data.map((i) => {
          if (i.userId == user_id) {
            user = i
          }
        })
        console.log(user)
        setFName(user.userFName)
        setLName(user.userLName)
        setTel(user.userContact)
        window.localStorage.setItem("picture", user.userProfile);
        // Update the state with API response data
      } catch (error) {
        console.error('Error calling Lambda function:', error);
      }
    }

    // Calling the fetchData function when the component mounts
    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once, similar to componentDidMount

  // target first name value on change
  const handleFNameChange = (e) => {
    setFName(e.target.value);
    setFNameError("");
  };

  // target last name value on change
  const handleLNameChange = (e) => {
    setLName(e.target.value);
    setLNameError("");
  };

  // target phone number value on change
  const handleTelChange = (e) => {
    setTel(e.target.value);
  };

  // function to submit the form which will upload image to S3 and data to DynamoDB
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];

    // Frontend validation for first name format
    const fnamePattern = /^[A-Za-z]+$/;
    if (!fnamePattern.test(fname)) {
      errors.push("First name must contain letters only.");
      setFNameError("Must contain letters only.");
    } else {
      setFNameError("");
    }

    // Frontend validation for last name format
    const lnamePattern = /^[A-Za-z]+$/;
    if (!lnamePattern.test(lname)) {
      errors.push("Last name must contain letters only.");
      setLNameError("Must contain letters only.");
    } else {
      setLNameError("");
    }

    // If there are validation errors, return and do not proceed with form submission

    if (errors.length > 0) {
      return;
    }

    // If no validation errors, it will proceed with uploading image and data storing in DynamoDB
    const url = await handleUpload();
    console.log(url);

    // user id and email from local storage
    var user_id = localStorage.getItem('user_id')
    var user_email = localStorage.getItem('user_email')

    // Prepare the data object for the API POST call
    const postData = {
      "userId": user_id,
      "userEmail": user_email,
      "fname": fname,
      "lname": lname,
      "contact": contact,
      "picture": url,
      "email": user_email,
    }

    const customHeader = {
      'Content-Type': 'application/json'
    }

    try {
      const apiGatewayUrl = 'https://r8dry1y4vb.execute-api.us-east-1.amazonaws.com/profile'; // API Gateway URL

      const response = await axios.post(`${apiGatewayUrl}`, postData, { headers: customHeader });

      console.log(response.data); // Response data from the Lambda function
      localStorage.setItem("userData", JSON.stringify(response.data));
      setUser(response.data); // Update user state with the updated user data
      alert("Updated Successful")
    }

    catch (error) {
      console.error('Error calling Lambda function:', error);
    }

    user = localStorage.getItem("userData");
  };

  return (
    <div>
      <Header currentPage="/login" />

      <form onSubmit={(e) => handleSubmit(e)} className="max-w-sm bg-white mx-auto mt-10 mb-32">
        <div className="mx-8">
          <h2 className="text-base font-semibold leading-7 text-xl text-gray-900">
            Profile
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-4">
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Profile Picture
              </label>

              <div className="mt-2 flex rounded-md">
                <div className={classes.imageSelectorContainer}>
                  <ButtonBase className={classes.imageSelector} component="label">
                    {image ? (
                      <img
                        className={classes.image}
                        src={URL.createObjectURL(image)}
                        alt="Selected"
                      />
                    ) : (
                      <Avatar className={classes.avatar}>
                        <PhotoCameraIcon fontSize="large" />
                      </Avatar>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={classes.imageInput}
                    />
                  </ButtonBase>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>

              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  label="First Name"
                  name="firstName"
                  onChange={handleFNameChange}
                  value={fname}
                  required
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              {fnameError && (
                <div className="text-red-500 mt-2 text-xs">{fnameError}</div>
              )}

            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="time"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  label="Last Name"
                  name="lastName"
                  onChange={handleLNameChange}
                  value={lname}
                  required
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              {lnameError && (
                <div className="text-red-500 mt-2 text-xs">{lnameError}</div>
              )}

            </div>

            <div className="sm:col-span-4 w-full">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  label="Email"
                  type="email"
                  value={user_email}
                  name="email"
                  disabled
                  className="block flex-1 border-0 bg-transparent py-1.5 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="time"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Contact
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-gray-300">
                <input
                  label="Last Name"
                  name="lastName"
                  required
                  type="tel"
                  onChange={handleTelChange}
                  value={contact}
                  placeholder="012-345-6789"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <small>Format: 012-345-6789</small>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-x-6">
            <button
              variant="contained"
              type="submit"
              className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Update Profile
            </button>
          </div>
        </div>
      </form>

      <div className="fixed bottom-0 bg-gray-200 w-full">
        <Footer />
      </div>
    </div>
  );
}

export default Profile;