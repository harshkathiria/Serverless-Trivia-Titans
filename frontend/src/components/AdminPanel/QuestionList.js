import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const QuestionList = () => {
  const [questionList, setQuestionList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState({
    question_text: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
    explanation: '', // Add explanation to the state
    hint: '', // Add hint to the state
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get('https://us-central1-cloudproject-394200.cloudfunctions.net/app/get_all_questions')
      .then((response) => setQuestionList(response.data.questions))
      .catch((error) => console.error('Error fetching question list:', error));
  }, []);

  useEffect(() => {
    const filteredQuestions = questionList.filter((question) => {
      if (question && question.question_text) {
        return question.question_text.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });
    setFilteredQuestions(filteredQuestions);
  }, [searchQuery, questionList]);

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async () => {
    try {
      // Make an API call to update the question using axios
      await axios.put(`https://us-central1-cloudproject-394200.cloudfunctions.net/app/update_question/${editingQuestion.question_id}`, editingQuestion);

      // After successful update, update the question list with the edited question
      const updatedQuestionList = questionList.map((question) =>
        question.question_id === editingQuestion.question_id ? editingQuestion : question
      );
      setQuestionList(updatedQuestionList);

      // Close the modal after saving
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      // Make an API call to delete the question using axios
      await axios.delete(`https://us-central1-cloudproject-394200.cloudfunctions.net/app/delete_question/${questionId}`);

      // After successful deletion, update the question list to remove the deleted question
      setQuestionList((prevQuestionList) =>
        prevQuestionList.filter((question) => question.question_id !== questionId)
      );
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditingQuestion((prevEditingQuestion) => ({
      ...prevEditingQuestion,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>Question List</h2>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </div>
      <table className="table table-bordered">
        <tbody>
          {filteredQuestions.length === 0 ? (
            <tr>
              <td colSpan="7">No matching results</td>
            </tr>
          ) : (
            filteredQuestions.map((question) => (
              <tr key={question.question_id}>
                <td>{question.question_text}</td>
                <td>
                  <ul>
                    <li>{question.option1}</li>
                    <li>{question.option2}</li>
                    <li>{question.option3}</li>
                    <li>{question.option4}</li>
                  </ul>
                </td>
                <td>{question.answer}</td>
                <td>{question.explanation}</td> {/* Display Explanation */}
                <td>{question.hint}</td> {/* Display Hint */}
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEditQuestion(question)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteQuestion(question.question_id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleModalClose}
          contentLabel="Edit Modal"
        >
          <div className="modal-content">
            <span className="close-button" onClick={handleModalClose}>
              &times;
            </span>
            <h2>Edit Modal</h2>
            <form>
              <div className="form-group">
                <label>Question Text</label>
                <input
                  type="text"
                  name="question_text"
                  value={editingQuestion.question_text}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Option 1</label>
                <input
                  type="text"
                  name="option1"
                  value={editingQuestion.option1}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Option 2</label>
                <input
                  type="text"
                  name="option2"
                  value={editingQuestion.option2}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Option 3</label>
                <input
                  type="text"
                  name="option3"
                  value={editingQuestion.option3}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Option 4</label>
                <input
                  type="text"
                  name="option4"
                  value={editingQuestion.option4}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Answer</label>
                <input
                  type="text"
                  name="answer"
                  value={editingQuestion.answer}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Explanation</label>
                <input
                  type="text"
                  name="explanation"
                  value={editingQuestion.explanation}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Hint</label>
                <input
                  type="text"
                  name="hint"
                  value={editingQuestion.hint}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <button type="button" onClick={handleSaveQuestion} className="btn btn-primary">
                  Save
                </button>
                <button type="button" onClick={handleModalClose} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuestionList;
