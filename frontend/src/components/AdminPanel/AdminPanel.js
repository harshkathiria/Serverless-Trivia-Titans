import React, { useState } from 'react';
import AddQuestionForm from './AddQuestionForm';
import CreateGameForm from './CreateQuizForm';
import QuestionList from './QuestionList';
import AnalyticsDashboard from './AnalyticsDashboard';
import GameList from './QuizList';
import Header from '../header/header';
import Footer from '../footer/footer'

import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Header currentPage="/administrator" />
    <div className="container mt-4">
      
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            Dashboard
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => handleTabChange('quiz')}
          >
            Quiz
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => handleTabChange('questions')}
          >
            Questions
          </a>
        </li>
      </ul>

      <div className="tab-content mt-4">
        <div
          id="dashboard"
          className={`tab-pane fade ${activeTab === 'dashboard' ? 'show active' : ''}`}
        >
          <AnalyticsDashboard />
        </div>
        <div id="quiz" className={`tab-pane fade ${activeTab === 'quiz' ? 'show active' : ''}`}>
          <CreateGameForm />
          <GameList />
        </div>
        <div
          id="questions"
          className={`tab-pane fade ${activeTab === 'questions' ? 'show active' : ''}`}
        >
          <AddQuestionForm />
          <QuestionList />
        </div>
      </div>
      
    </div>
    <Footer />
    </div>
  );
};

export default AdminPanel;
