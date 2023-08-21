import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#root');

const CreateQuizForm = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const [quizName, setQuizName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [quizCategory, setQuizCategory] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [totalNumQuestions, setTotalNumQuestions] = useState('');
  const [startTime, setStartTime] = useState(null); // New state for the time

  const handleAddQuestion = async () => {
    try {
      await axios.post('https://us-central1-cloudproject-394200.cloudfunctions.net/app/create_quiz_from_category', {
        quiz_name: quizName,
        start_date: startDate ? startDate.toISOString() : '',
        end_date: endDate ? endDate.toISOString() : '',
        start_time: startTime ? startTime.toISOString() : '', // Convert time object to string for API
        quiz_category: quizCategory,
        difficulty_level: difficultyLevel,
        total_points: totalPoints,
        quiz_description: quizDescription,
        total_num_questions: totalNumQuestions,
      });

      // Clear the form fields
      setQuizName('');
      setStartDate(null);
      setEndDate(null);
      setQuizCategory('');
      setDifficultyLevel('');
      setTotalPoints('');
      setQuizDescription('');
      setTotalNumQuestions('');
      setStartTime(null);

      // Close the modal after adding the question
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding quiz:', error);
    }
  };

  return (
    <div>
      <h2>Add New Trivia Quiz</h2>
      <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
        Add Quiz
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Add Quiz Modal"
      >
        <div className="modal-content">
          <span className="close-button" onClick={() => setModalOpen(false)}>
            &times;
          </span>
          <h2>Add New Quiz</h2>
          <form>
            <div className="form-group">
              <label>Quiz Name</label>
              <input
                type="text"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Quiz Category</label>
              <input
                type="text"
                value={quizCategory}
                onChange={(e) => setQuizCategory(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Difficulty Level</label>
              <input
                type="text"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Total Points</label>
              <input
                type="number"
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Quiz Description</label>
              <textarea
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Total Number of Questions</label>
              <input
                type="number"
                value={totalNumQuestions}
                onChange={(e) => setTotalNumQuestions(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect // Enable time selection
                timeFormat="HH:mm" // Display time in 24-hour format
                timeIntervals={15} // Set time interval for minutes selection
                dateFormat="yyyy-MM-dd HH:mm" // Display both date and time
                className="form-control"
                utcOffset={0}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect // Enable time selection
                timeFormat="HH:mm" // Display time in 24-hour format
                timeIntervals={15} // Set time interval for minutes selection
                dateFormat="yyyy-MM-dd HH:mm" // Display both date and time
                className="form-control"
                utcOffset={0}
              />
            </div>

            <div className="form-group">
              <button type="button" onClick={handleAddQuestion} className="btn btn-primary">
                Add
              </button>
              <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateQuizForm;