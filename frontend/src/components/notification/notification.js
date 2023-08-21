import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = () => {
    axios
      .get('https://6sfixah4gq6ogcjuqrrtoewxeq0xwkgn.lambda-url.us-east-1.on.aws/') // Replace with your actual API endpoint
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
      });
  };

  const toggleNotificationList = () => {
    setShowNotifications((prevState) => !prevState);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  return (
    <div>
      <style>
        {`
          .notification-button {
            margin-bottom: 10px;
            color: white;
            background-color: #007bff;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
          }

          .notification-button:hover {
            background-color: #0056b3;
          }

          .notification-list {
            border: 1px solid #ccc;
            padding: 10px;
            margin-top: 200px;
          }
        `}
      </style>
      {/* <button className="notification-button" onClick={toggleNotificationList}>
        <FontAwesomeIcon icon={faBell} style={{ marginRight: '5px' }} />
      </button> */}
      {showNotifications && (
        <div className="notification-list">
          <h2>------Notifications------</h2>
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id}>{notification.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
