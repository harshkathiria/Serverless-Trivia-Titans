import React from 'react';
import logo from '../../assets/logo2.png';

export default function Header() {

    return (
        <footer className="relative bottom-0 bg-gray-200 w-full">
            <div className="p-4">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center sm:mb-0">
                        <img src={logo} className="h-10 mr-3" alt="Logo" />
                        <span className="self-center text-lg font-semibold whitespace-nowrap text-gray-800">Trivia Titans</span>
                    </div>
                    <ul className="flex absolute right-2 flex-wrap items-center mb-6 text-sm font-medium text-gray-800 sm:mb-0 dark:text-gray-400">
                        <li>
                            <a href="#" className="mr-1 hover:no-underline no-underline text-gray-800 hover:bg-gray-800 hover:text-gray-100 py-2 px-4 rounded">About</a>
                        </li>
                        <li>
                            <a href="#" className="mr-1 hover:no-underline no-underline text-gray-800 hover:bg-gray-800 hover:text-gray-100 py-2 px-4 rounded">FAQ</a>
                        </li>
                        <li>
                            <a href="#" className="no-underline hover:no-underline text-gray-800 hover:bg-gray-800 hover:text-gray-100 py-2 px-4 rounded">Contact Us</a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}