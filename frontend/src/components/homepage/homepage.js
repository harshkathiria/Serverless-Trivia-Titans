import React from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import './homepage.css';
import Kommunicate from "../Kommunicate/Kommunicate";

const stats = [
  { name: 'Teams', value: '200+' },
  { name: 'Satisfied Players', value: '1300+' },
  { name: 'Topics', value: '40' },
  { name: 'Quizzes', value: '150+' },
]

export default function Landing() {

  return (
    <div>
      <Header currentPage="/" />
      {localStorage.getItem("isLoggedIn") && <Kommunicate/>}
      <div className="relative isolate overflow-hidden bg-gray-900 sm:py-56">
        <div
          className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div
          className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 d-flex flex-column justify-content-center align-items-center">
          <div className="col-9 mx-auto lg:mx-0 md:py-2">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Trivia Titans</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Multi-Cloud Serverless Collaborative Trivia Challenge Game.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none justify-content-center col-9">
            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4" style={{ backgroundColor: "#fff", padding: "2rem", opacity: 0.7, borderRadius: "5px" }}>
              {stats.map((stat) => (
                <div key={stat.name} className="flex flex-col-reverse justify-content-center align-items-center">
                  <dt className="text-base leading-7 text-gray-800">{stat.name}</dt>
                  <dd className="text-2xl font-bold leading-9 tracking-tight text-gray" style={{ alignContent: "center" }}>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}