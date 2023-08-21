import './App.css';
import React from 'react';
import './index.css';
import 'tailwindcss/tailwind.css';
import HomePage from "./components/homepage/homepage";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Quiz from './components/Quiz';
import LeaderBoard from './components/LeaderBoard';
import Profile from "./components/profile/Profile";
import QnA from "./components/QnA/QnA";
import Reset from "./components/reset_password/reset_password";
import TeamManagementForm from './components/TeamManagementForm';
import AdminPanel from './components/AdminPanel/AdminPanel'
import Stats from "./components/my_stats/my_stats";
import Achievements from "./components/achievements/achievements";
import Trivia from './components/Trivia/Trivia'
import WaitingRoom from './components/WaitingRoom/WaitingRoom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginRedirect from "./components/LoginRedirects/LoginRedirect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/reset" element={<Reset />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/qna" element={<QnA />} />

        <Route path="/achievements" element={<LoginRedirect />}>
          <Route index element={<Achievements />} />
        </Route>

        <Route path="/my_stats" element={<LoginRedirect />}>
          <Route index element={<Stats />} />
        </Route>

        <Route path="/profile" element={<LoginRedirect />}>
          <Route index element={<Profile />} />
        </Route>

        <Route path="/trivia" element={<LoginRedirect />}>
          <Route index element={<Trivia />} />
        </Route>

        <Route path="/room/:quizId" element={<LoginRedirect />}>
          <Route index element={<WaitingRoom />} />
        </Route>

        <Route path="/livequiz/:id" element={<LoginRedirect />}>
          <Route index element={<Quiz />} />
        </Route>

        <Route path="/leaderboard" element={<LoginRedirect />}>
          <Route index element={<LeaderBoard />} />
        </Route>

        <Route path="/TeamManagement" element={<LoginRedirect />}>
          <Route index element={<TeamManagementForm />} />
        </Route>

        <Route path="/administrator" element={<LoginRedirect />}>
          <Route index element={<AdminPanel />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;