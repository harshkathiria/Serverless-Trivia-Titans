import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import moment from 'moment-timezone';

const QuizList = () => {
  const [quizList, setQuizList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    quizId: null,
    quizName: '',
    quizCategory: '',
    difficultyLevel: '',
    startDate: new Date(),
    endDate: new Date(),
    totalPoints: '',
    quizDescription: '',
    totalNumQuestions: '',
  });
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios
      .get('https://us-central1-cloudproject-394200.cloudfunctions.net/app/list_quizzes')
      .then((response) => setQuizList(response.data.quizzes))
      .catch((error) => console.error('Error fetching quiz list:', error));
  }, []);

  const handleEditGame = (quizId) => {
    const quizToEdit = quizList.find((quiz) => quiz.quiz_id === quizId);
    if (quizToEdit) {
      const startDate = new Date(quizToEdit.start_date); // Parse the start date
      const endDate = new Date(quizToEdit.end_date); // Parse the end date

      setEditFormData({
        quizId: quizToEdit.quiz_id,
        quizName: quizToEdit.quiz_name,
        quizCategory: quizToEdit.quiz_category,
        difficultyLevel: quizToEdit.difficulty_level,
        startDate: startDate,
        endDate: endDate,
        totalPoints: quizToEdit.total_points,
        quizDescription: quizToEdit.quiz_description,
        totalNumQuestions: quizToEdit.total_num_questions,
      });
      setModalOpen(true);
    }
  };

  const handleDeleteGame = (quizId) => {
    axios
      .delete(`https://us-central1-cloudproject-394200.cloudfunctions.net/app/delete_quiz/${quizId}`)
      .then((response) => {
        setQuizList((prevQuizList) => prevQuizList.filter((quiz) => quiz.quiz_id !== quizId));
      })
      .catch((error) => console.error('Error deleting quiz:', error));
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setQuestions([]); // Reset questions when closing the modal
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleDateChange = (name, date) => {
    setEditFormData({
      ...editFormData,
      [name]: date,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formattedFormData = {
      quiz_name: editFormData.quizName,
      start_date: moment(editFormData.startDate).tz('America/New_York').toISOString(),
      end_date: moment(editFormData.endDate).tz('America/New_York').toISOString(),
      quiz_category: editFormData.quizCategory,
      quiz_category: editFormData.quizCategory,
      difficulty_level: editFormData.difficultyLevel,
      total_points: editFormData.totalPoints,
      quiz_description: editFormData.quizDescription,
      total_num_questions: editFormData.totalNumQuestions,
    };

    axios
      .put(`https://us-central1-cloudproject-394200.cloudfunctions.net/app/edit_quiz/${editFormData.quizId}`, formattedFormData)
      .then((response) => {
        setQuizList((prevQuizList) =>
          prevQuizList.map((quiz) =>
            quiz.quiz_id === editFormData.quizId ? { ...quiz, ...formattedFormData } : quiz
          )
        );
        setModalOpen(false);
      })
      .catch((error) => console.error('Error updating quiz:', error));
  };

  const handleViewQuestions = (quizId) => {
    axios
      .get(`https://us-central1-cloudproject-394200.cloudfunctions.net/app/get_quiz_questions/${quizId}`)
      .then((response) => {
        setQuestions(response.data.questions);
        setModalOpen(true);
      })
      .catch((error) => console.error('Error fetching quiz questions:', error));
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredQuizList = quizList.filter(
    (quiz) =>
      quiz.quiz_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.quiz_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.difficulty_level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Quiz List</h2>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search quizzes..."
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Quiz Name</th>
            <th>Category</th>
            <th>Difficulty Level</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuizList.map((quiz) => (
            <tr key={quiz.quiz_id}>
              <td>{quiz.quiz_name}</td>
              <td>{quiz.quiz_category}</td>
              <td>{quiz.difficulty_level}</td>
              <td>{quiz.start_date}</td>
              <td>{quiz.end_date}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => handleEditGame(quiz.quiz_id)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleViewQuestions(quiz.quiz_id)}
                >
                  <i className="bi bi-eye"></i>
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteGame(quiz.quiz_id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onRequestClose={handleModalClose}>
        <div className="modal-content">
          <span className="close" onClick={handleModalClose}>
            &times;
          </span>
          {questions.length > 0 ? (
            <>
              <h2>Quiz Questions</h2>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Question Text</th>
                    <th>Category</th>
                    <th>Options</th>
                    <th>Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr key={question.question_id}>
                      <td>{question.question_text}</td>
                      <td>{question.category}</td>
                      <td>
                        <ul>
                          <li>{question.option1}</li>
                          <li>{question.option2}</li>
                          <li>{question.option3}</li>
                          <li>{question.option4}</li>
                        </ul>
                      </td>
                      <td>{question.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <h2>Edit Quiz</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Quiz Name</label>
                  <input
                    type="text"
                    name="quizName"
                    value={editFormData.quizName}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="quizCategory"
                    value={editFormData.quizCategory}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty Level</label>
                  <input
                    type="text"
                    name="difficultyLevel"
                    value={editFormData.difficultyLevel}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <DatePicker
                    selected={editFormData.startDate}
                    onChange={(date) => handleDateChange('startDate', date)}
                    showTimeSelect // Enable time selection
                    timeFormat="HH:mm" // Display time in 24-hour format
                    timeIntervals={15} // Set time interval for minutes selection
                    dateFormat="yyyy-MM-dd HH:mm" // Display both date and time
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <DatePicker
                    selected={editFormData.endDate}
                    onChange={(date) => handleDateChange('endDate', date)}
                    showTimeSelect // Enable time selection
                    timeFormat="HH:mm" // Display time in 24-hour format
                    timeIntervals={15} // Set time interval for minutes selection
                    dateFormat="yyyy-MM-dd HH:mm" // Display both date and time
                    className="form-control"
                    utcOffset={0}
                  />
                </div>
                <div className="form-group">
                  <label>Total Points</label>
                  <input
                    type="number"
                    name="totalPoints"
                    value={editFormData.totalPoints}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Quiz Description</label>
                  <textarea
                    name="quizDescription"
                    value={editFormData.quizDescription}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Total Number of Questions</label>
                  <input
                    type="number"
                    name="totalNumQuestions"
                    value={editFormData.totalNumQuestions}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default QuizList;