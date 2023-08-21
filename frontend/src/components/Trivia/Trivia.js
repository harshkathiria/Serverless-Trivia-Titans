import React, { useState, useEffect } from "react";
import "./Trivia.css";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../header/header";
import Footer from "../footer/footer";

export default function Trivia() {
  const [games, setGames] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  // const [modalShow, setShow] = useState(false);

  useEffect(() => {
    const testUrl = `https://drz42y1qfl.execute-api.us-east-1.amazonaws.com/test/getgames`;
    axios
      .get(
        `https://us-central1-cloudproject-394200.cloudfunctions.net/app/list_quizzes`
      )
      .then((res) => {
        console.log(res);
        const quizes = res.data.quizzes.map((quiz) => {
          quiz.timeFrame = `${Math.ceil(quiz.total_time / 60)} mins`;
          return quiz;
        });
        setGames(quizes);
      });
  }, []);
  const navigate = useNavigate();

  const handleFilterApply = (category, difficulty) => {
    difficulty = difficulty.toUpperCase();
    console.log(category, difficulty);
    axios
      .get(
        `https://us-central1-cloudproject-394200.cloudfunctions.net/app/list_quizzes`
      )
      .then((res) => {
        let quizzes = res.data.quizzes;
        console.log(quizzes);
        if (category !== "") {
          quizzes = quizzes.filter((quiz) => quiz.quiz_category === category);
        }
        console.log(quizzes);

        if (difficulty !== "") {
          quizzes = quizzes.filter(
            (quiz) => quiz.difficulty_level.toUpperCase() === difficulty
          );
        }
        console.log(quizzes);

        const quizzesWithTimeFrame = quizzes.map((quiz) => ({
          ...quiz,
          timeFrame: `${Math.ceil(quiz.total_time / 60)} mins`,
        }));

        setGames(quizzesWithTimeFrame);
      });
    setShowFilter(false);
  };

  // const games = [{
  //     "id": "1",
  //     "name": "World Capitals",
  //     "difficulty": "Medium",
  //     "description": "Test your knowledge of world capitals in this geography-themed trivia game.",
  //     "category": "Geography",
  //     "timeFrame": "10 minutes",
  //     "active": true,
  //     "startingTime": "1690491677000",
  //     "tags": { "isNew": true, "promoted": true }
  // },
  // {
  //     "id": "2",
  //     "name": "Classic Movie Quotes",
  //     "difficulty": "Easy",
  //     "description": "Guess the movie from famous quotes in this fun trivia challenge about classic films.",
  //     "category": "Movies",
  //     "timeFrame": "5 minutes",
  //     "active": true,
  //     "startingTime": "1690494917000",
  //     "tags": { "isNew": true, "promoted": false }
  // },
  // {
  //     "id": "3",
  //     "name": "History's Greatest Inventions",
  //     "difficulty": "Hard",
  //     "description": "Explore the most significant inventions that shaped human history in this educational trivia game.",
  //     "category": "History",
  //     "timeFrame": "15 minutes",
  //     "active": true,
  //     "startingTime": "1690494917000",
  //     "tags": { "isNew": false, "promoted": true }
  // },
  // {
  //     "id": "4",
  //     "name": "Science Wonders",
  //     "difficulty": "Medium",
  //     "description": "Discover the marvels of the scientific world and test your knowledge in this trivia challenge.",
  //     "category": "Science",
  //     "timeFrame": "8 minutes",
  //     "active": true,
  //     "startingTime": "1690494917000",
  //     "tags": { "isNew": false, "promoted": false }
  // },
  // {
  //     "id": "5",
  //     "name": "Pop Music Hits",
  //     "difficulty": "Easy",
  //     "description": "Guess the popular songs and artists from the past and present in this music trivia extravaganza.",
  //     "category": "Music",
  //     "timeFrame": "6 minutes",
  //     "active": true,
  //     "startingTime": "1690494917000",
  //     "tags": { "isNew": true, "promoted": true }
  // },
  // {
  //     "id": "6",
  //     "name": "Famous Paintings",
  //     "difficulty": "Hard",
  //     "description": "Test your art knowledge by identifying famous paintings and their artists in this trivia challenge.",
  //     "category": "Art",
  //     "timeFrame": "12 minutes",
  //     "active": true,
  //     "startingTime": "1690494917000",
  //     "tags": { "isNew": false, "promoted": false }
  // },
  // {
  //     "id": "7",
  //     "name": "Sports Legends",
  //     "difficulty": "Medium",
  //     "description": "Explore the achievements of sports legends and relive iconic moments in this sports-themed trivia game.",
  //     "category": "Sports",
  //     "timeFrame": "10 minutes",
  //     "active": true,
  //     "startingTime": "1690494917000",
  //     "tags": { "isNew": true, "promoted": false }
  // }
  // ];
  const [modalShow, setShow] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const handleCardClick = (gameId) => {
    setActiveGame(gameId);
    setShow(true);
    console.log("gameId: " + gameId);
  };

  const handleJoinGame = async (quizId, startingTime) => {
    console.log(startingTime);
    const startDate = new Date(startingTime);
    console.log("time");
    startDate.setHours(startDate.getHours() + 3); // Add 3 Hours to get in Atlantic Timezone
    console.log(startDate);

    const startDateSeconds = startDate.getTime() / 1000;
    const currentTimeSeconds = new Date() / 1000;

    console.log(startDateSeconds);
    console.log(currentTimeSeconds);

    console.log(localStorage.getItem("user_id"));
    await axios.post(
      `https://z26u4jiti2.execute-api.us-east-1.amazonaws.com/dev/register-quiz`,
      {
        quizId: quizId,
        userId: localStorage.getItem("user_id"),
        email: localStorage.getItem("user_email"),
      }
    );
    navigate(`/room/${quizId}`);
    // if (startDateSeconds - currentTimeSeconds >= 120) {
    //     navigate(`/room/${quizId}`);
    // } else {
    //     console.log("Game Expired");
    //     console.log("Quiz Started: " + new Date(startDateSeconds * 1000));
    //     console.log("Current Time: " + new Date(currentTimeSeconds * 1000));
    // }
  };
  const toggleFilter = () => {
    setShowFilter(!showFilter); // Step 2: Function to toggle filter visibility
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleFilterApply(category, difficulty);
  };

  return (
    <>
    <Header currentPage="/trivia"/>
      <div className="container-fluid my-12">
        <div className="row">
          <div className="col-12">
            <div className="row my-2">
              <div className="col-12 text-center">
                <h1 className="trivia-title font-monospace">Trivia Titans</h1>
                <span
                  className="d-inline-block align-self-center"
                  onClick={toggleFilter}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-funnel fs-3"></i>
                </span>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              {games?.map((game) => (
                <div
                  onClick={() => handleCardClick(game.quiz_id)}
                  key={game.quiz_id}
                  className="col-3 m-2 card justify-content-center"
                  style={{ height: "5em" }}
                >
                  <div className="card-title m-0">
                    <span>{game.quiz_name}</span>
                  </div>
                  <div className="card-metrics">
                    <span>
                      {game.quiz_category} || {game.difficulty_level} ||{" "}
                      {game.timeFrame}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="md"
        show={modalShow}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header className="card-title" closeButton>
          {games.find((game) => game.quiz_id === activeGame)?.quiz_name}
        </Modal.Header>
        <Modal.Body>
          <div>
            {
              games.find((game) => game.quiz_id === activeGame)
                ?.quiz_description
            }
          </div>
          <hr />
          <div className="d-flex justify-content-left">
            <div className="m-2">
              {games.find((game) => game.quiz_id === activeGame)?.quiz_category}
            </div>
            <div className="m-2">
              {
                games.find((game) => game.quiz_id === activeGame)
                  ?.difficulty_level
              }
            </div>
            <div className="m-2">
              {games.find((game) => game.quiz_id === activeGame)?.timeFrame}
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-outline-success join-btn  d-flex justify-content-end"
              onClick={() =>
                handleJoinGame(
                  games.find((game) => game.quiz_id === activeGame)?.quiz_id,
                  games.find((game) => game.quiz_id === activeGame)?.start_date
                )
              }
            >
              Join
            </button>
          </div>
        </Modal.Body>
      </Modal>
      {showFilter && (
        <div className="container mt-5">
          <div className="row filter-container">
            <form onSubmit={handleFormSubmit} className="p-5 border rounded">
              <div className="form-group my-2">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="sports">Sports</option>
                  <option value="history">History</option>
                  <option value="general knowledge">General Knowledge</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="technology">Technology</option>
                  <option value="science">Science</option>
                  <option value="literature">Literature</option>
                  <option value="music">Music</option>
                  <option value="food and drink">Food and Drink</option>
                  <option value="geography">Geography</option>
                </select>
              </div>
              <div className="form-group my-2">
                <label htmlFor="difficulty">Difficulty:</label>
                <select
                  id="difficulty"
                  className="form-control"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Apply
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer/>
    </>
  );
}
