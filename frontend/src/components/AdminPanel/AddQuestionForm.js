import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AddQuestionForm = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [explanation, setExplanation] = useState(''); // Added explanation state
  const [hint, setHint] = useState(''); // Added hint state

  const handleAddQuestion = async () => {
    try {
      // Make an API call to add the new question using axios
      await axios.post('https://us-central1-cloudproject-394200.cloudfunctions.net/app/add_question', {
        question_text: question,
        category,
        option1: choices[0],
        option2: choices[1],
        option3: choices[2],
        option4: choices[3],
        answer: choices[correctAnswer],
        explanation, // Include explanation in the API request
        hint, // Include hint in the API request
      });

      // Clear the form fields
      setQuestion('');
      setChoices(['', '', '', '']);
      setCorrectAnswer(0);
      setCategory('');
      setDifficulty('');
      setExplanation('');
      setHint('');

      // Close the modal after adding the question
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  return (
    <div>
      <h2>Add New Trivia Question</h2>
      <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
        Add Question
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Add Question Modal"
      >
        <div className="modal-content">
          <span className="close-button" onClick={() => setModalOpen(false)}>
            &times;
          </span>
          <h2>Add New Question</h2>
          <form>
            <div className="form-group">
              <label>Question Text</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Choices</label>
              {choices.map((choice, index) => (
                <div key={index} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="correctAnswer"
                    checked={correctAnswer === index}
                    onChange={() => setCorrectAnswer(index)}
                  />
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <input
                type="text"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Explanation</label>
              <input
                type="text"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Hint</label>
              <input
                type="text"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
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

export default AddQuestionForm;
