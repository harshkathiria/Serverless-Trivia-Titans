import React, { useEffect, useState, Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/logo.png';
import icon from '../../assets/icon.jpg';
import { signOut } from 'firebase/auth';
import { database } from '../config';
import { useNavigate } from 'react-router-dom';
import Notification from '../notification/notification';
import axios from "axios";

const customHeader = {
  'Content-Type': 'application/json'
}

// navigation set according to user personas.
const guestNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Login/SignUp', href: '/login' },
];

const adminNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/administrator' },
];

const userNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Teams', href: '/TeamManagement' },
  { name: 'Game Lobby', href: '/trivia' },
  { name: 'Leaderboard', href: '/leaderboard' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Header(props) {

  useEffect(() => {
    // Function to fetch data from the API
    async function fetchData() {
      try {
        const apiGatewayUrl = 'https://r8dry1y4vb.execute-api.us-east-1.amazonaws.com/getProfileData'; // API Gateway URL
        const response = await axios.get(`${apiGatewayUrl}`, { headers: customHeader });
        var user = {}
        const user_id = localStorage.getItem("user_id")
        response.data.map((i) => {
          if (i.userId === user_id) {
            user = i
          }
        })
        window.localStorage.setItem("picture", user.userProfile);
        // Update the state with API response data
      } catch (error) {
        console.error('Error calling Lambda function:', error);
      }
    }

    // Calling the fetchData function when the component mounts
    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once, similar to componentDidMount

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = () => {
    axios
      .get('https://6sfixah4gq6ogcjuqrrtoewxeq0xwkgn.lambda-url.us-east-1.on.aws/') // API endpoint
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

  const { currentPage } = props;  // check for current page using props
  var flag = localStorage.getItem('isLoggedIn') // check user is logged in or not
  var user_id = localStorage.getItem('user_id') // user id from local storage
  var email = localStorage.getItem('user_email') // user email from local storage
  var navigation;
  var picture = localStorage.getItem('picture') // profile picture link from local storage

  // condition to check which user is logged in and set navigation options according to that
  if (!flag) {
    navigation = guestNavigation;
  }
  else if (flag && user_id === "C8291eUxuGhNIRlQfJJfy89BEjv2" && email === "admin@triviatitans.com") {
    navigation = adminNavigation;
  }
  else {
    navigation = userNavigation;
  }

  const updatedNavigation = navigation.map((item) => {
    if (item.href === currentPage) {
      return { ...item, current: true };
    }
    return { ...item, current: false };
  });

  const history = useNavigate()

  // logout function
  const emailLogout = () => {
    signOut(database).then(val => {
      console.log(val, "val")
      localStorage.clear();
      history('/')
    })
  }

  return (
    <div className="sticky top-0 bg-gray-800 z-50">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-full">
              <div className="relative flex h-24 items-center justify-between mx-3">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="hidden h-12 w-18 lg:block"
                      src={logo} alt=""
                    />
                  </div>

                  <div className="hidden sm:ml-6 mt-2 sm:block">
                    <div className="flex space-x-1 ">
                      {updatedNavigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current ? 'bg-gray-900 no-underline hover:no-underline text-white' : 'text-gray-300 no-underline hover:no-underline hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    type="button"
                    onClick={toggleNotificationList}
                    className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <Notification />

                  {showNotifications && (
                    <div className="notification-list bg-white">
                      <h3>Notifications</h3>
                      <ul>
                        {notifications.map((notification) => (
                          <li key={notification.id}>{notification.message}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      {(flag && user_id === "C8291eUxuGhNIRlQfJJfy89BEjv2" && email === "admin@triviatitans.com") ?

                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-9 w-9 rounded-full"
                            src={icon}
                            alt=""
                          />
                        </Menu.Button>

                        : flag ?

                          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-9 w-9 rounded-full"
                              src={picture}
                              alt=""
                            />
                          </Menu.Button>
                          :
                          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-9 w-9 rounded-full"
                              src={icon}
                              alt=""
                            />
                          </Menu.Button>
                      }
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      {(flag && user_id === "C8291eUxuGhNIRlQfJJfy89BEjv2" && email === "admin@triviatitans.com") ?

                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href='#'
                                onClick={emailLogout}
                                className={classNames(active ? 'bg-gray-200 hover:no-underline' : '', 'no-underline hover:no-underline hover:text-black block px-4 py-2 text-sm text-gray-700')}
                              >
                                Sign Out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>

                        : flag ?

                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="/profile"
                                  className={classNames(active ? 'bg-gray-200 hover:no-underline' : '', 'no-underline hover:no-underline hover:text-black block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Your Profile
                                </a>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="/my_stats"
                                  className={classNames(active ? 'bg-gray-200 hover:no-underline' : '', 'no-underline hover:no-underline hover:text-black block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Statistics & Teams
                                </a>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="/achievements"
                                  className={classNames(active ? 'bg-gray-200 hover:no-underline' : '', 'no-underline hover:no-underline hover:text-black block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Achievements
                                </a>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href='#'
                                  onClick={emailLogout}
                                  className={classNames(active ? 'bg-gray-200 hover:no-underline' : '', 'no-underline hover:no-underline hover:text-black block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Sign Out
                                </a>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                          :
                          <div></div>
                      }
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 no-underline text-white' : 'text-gray-300 no-underline hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}