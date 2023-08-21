import React, { useState, useEffect } from "react";
import "./WaitingRoom.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../header/header";
import Footer from "../footer/footer";

const WaitingRoom = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [playersJoined, setPlayersJoined] = useState([]);
  useEffect(() => {
    let intervalId = setInterval(() => {
      axios
        .post(
          `https://z26u4jiti2.execute-api.us-east-1.amazonaws.com/dev/get-participants`,
          { quizId: quizId }
        )
        .then((res) => {
          const players = res.data.map((player) => {
            player.name = player.email.split("@")[0];
            return player;
          });
          console.log(players);
          setPlayersJoined(players);
        });
    }, 2000); // 2000 milliseconds = 2 seconds
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [quizId]);
    setTimeout(() => {
      navigate(`/livequiz/${quizId}`);
    }, 30 * 1000);
  // let playersJoined = [
  //     {
  //         name: "John Doe",
  //         email: "john.doe@example.com",
  //     },
  //     {
  //         name: "Jane Smith",
  //         email: "jane.smith@example.com",
  //     },
  //     {
  //         name: "Michael Johnson",
  //         email: "michael.johnson@example.com",
  //     },
  //     {
  //         name: "Emily Brown",
  //         email: "emily.brown@example.com",
  //     },
  //     {
  //         name: "Robert Wilson",
  //         email: "robert.wilson@example.com",
  //     },
  //     {
  //         name: "Sophia Martinez",
  //         email: "sophia.martinez@example.com",
  //     },
  //     {
  //         name: "William Taylor",
  //         email: "william.taylor@example.com",
  //     },
  //     {
  //         name: "Olivia Anderson",
  //         email: "olivia.anderson@example.com",
  //     },
  //     {
  //         name: "James Garcia",
  //         email: "james.garcia@example.com",
  //     },
  //     {
  //         name: "Ava Lopez",
  //         email: "ava.lopez@example.com",
  //     },
  // ];

  return (
    <>
    <Header/>
      <div className="row d-flex text-center my-5">
        <h3 style={{ color: "#574aa7" }}>
          Waiting for other players to join :)
        </h3>
      </div>
      <div className="row">
        <div
          className="col-4 offset-4"
          style={{ height: "21em", overflow: "scroll" }}
        >
          {playersJoined.map((player) => (
            <>
              <div className="text-center">{player.name}</div>
              <hr />
            </>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-center spinner-container my-5">
        <div className="loading-spinner"></div>
      </div>
      <button className="action-button">{playersJoined.length}</button>
      <Footer/>
    </>
  );
};

export default WaitingRoom;
