import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatUI from './Chat';
import Header from './Header';
// import { quiz } from '../utility/questions';
import axios from 'axios';
import ExpandableTable from './ExpandableTable';
import { useNavigate } from 'react-router-dom';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import './Quiz.css';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import { useParams } from 'react-router-dom';

const QuizPage = () => {
  const { id } = useParams();
  const answerType = 'single'; // 'single' for single select, 'multi' for multi-select
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false); // Flag to show/hide correct answer
  const [quizDetail, setQuizDetail] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [mainQuizTimer, setMainQuizTimer] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(20); // Timer value in seconds
  const [pauseTimer, setPauseTimer] = useState(0); // Timer value in seconds
  const [showQuestionTimer, setShowQuestionTimer] = useState(true); // Timer value in seconds
  const [showPauseTimer, setShowPauseTimer] = useState(false); // Timer value in seconds
  const [isCurrentQuestionAnsweredCorrectly, setCurrentQuestionAnsweredCorrectly] = useState(false); // Timer value in seconds
  const [isCurrentQuestionAnswered, setCurrentQuestionAnswered] = useState(false); // Timer value in seconds
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState(Date.now()); // Timer value in seconds
  const [quizBoardRow, setQuizBoardRow] = useState([]);
  const [isLeaderBoardGenerating, setIsLeaderBoardGenerating] = useState(false); // LeaderBoard Navigation flag
  const difficulty = 15;
  const maxMarks = 20;
  const [isQuizReady, setQuizReady] = useState(false); // Timer value in seconds
  const [childValue, setChildValue] = useState('');
  const currentUserId = localStorage.getItem('user_id');
  const currentUserEmail = localStorage.getItem('user_email');
  const [categoryId, setCategoryId] = useState();
  const [teamDetail, setTeamDetail] = useState();
  const [userDetail, setUserDetail] = useState();
  const customHeader = {
    'Content-Type': 'application/json'
  }

  const handleChildValue = (value) => {
    if(value){
      onSocketOpen();
    }
    setChildValue(value);
  };

  let socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate()
  const scroll = useRef();
  const chatUIRef = useRef(null);

  const onHintClick = (evt) => { 
     if (chatUIRef.current) {
      const message = 'Hint:' + quizDetail?.questions[currentQuestion]?.hint;
      chatUIRef.current.childMethod(message);
    }
  };

   const onRequestHintClick = (evt) => { 
     if (chatUIRef.current) {
      const message = "Request: Hey I need some hints? Anyone!!";
      chatUIRef.current.childMethod(message);
    }
  };
  const teamId = teamDetail?.teamId;
  const userId =  currentUserId;
  const quizId = id;

  useEffect(() => {
    if (quizDetail && quizDetail.totalTimeInSeconds !== undefined) {
      setMainQuizTimer(quizDetail?.totalTimeInSeconds + quizDetail?.questions?.length * 10);
    }
  }, [quizDetail?.totalTimeInSeconds]);

  useEffect(() => {
    let interval = null;

    if (mainQuizTimer > 0) {
      interval = setInterval(() => {
        setMainQuizTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if(interval == 0) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [mainQuizTimer]);

 useEffect(() => {
    const interval = setInterval(() => {
      setQuestionTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    if (questionTimer === 0) {
      clearInterval(interval);
      setShowAnswer(true); // Show correct answer once questionTimer ends
      setShowPauseTimer(true); 
      setShowQuestionTimer(false);
      setPauseTimer(10);
      setCurrentQuestionStartTime(0);
    }

    return () => {
      clearInterval(interval);
    };
  }, [questionTimer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPauseTimer((prevTimer) => prevTimer - 1);
    }, 1000);

     if (pauseTimer === 0) {
      clearInterval(interval);
      setShowAnswer(false);
      setShowQuestionTimer(true); 
      setShowPauseTimer(false);
      setQuestionTimer(20); // Show correct answer once questionTimer ends
      setCurrentQuestion(currentQuestion+1);
      setSelectedChoices([]);
      setCurrentQuestionAnsweredCorrectly(false);
      setCurrentQuestionAnswered(false);
      setCurrentQuestionStartTime(Date.now());
    }

    return () => {
      clearInterval(interval);
    };
  }, [pauseTimer]);


const transformData = (data) => {
  return data.map((question) => {
    return {
      question: question.question_text,
      availableChoices: [
        question.option1,
        question.option2,
        question.option3,
        question.option4,
      ],
      correctAnswer: question.answer,
      hint: question.hint || '',
      subCategory: question.category,
      explanation: question.explanation || '',
      questionId: question.question_id,
    };
  });
};

useEffect(() => {
  if(teamDetail != null){
    onConnect();
  }
}, [teamDetail]);

  //Get quiz details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamReponse = await axios.post("https://k9e84ss46j.execute-api.us-east-1.amazonaws.com/dev/getuserteamdetails",{u_email : currentUserEmail });//currentUserEmail
        let tempTeamDetail = teamReponse?.data?.body?.data.map(team => {
          return {
            teamName: team.t_name,
            teamId: team.t_id,
            members: team.members,
            admin:team.admin,
          }
        });
        setTeamDetail(tempTeamDetail[0]);

        const userResponse = await axios.get("https://r8dry1y4vb.execute-api.us-east-1.amazonaws.com/getProfileData",{headers: customHeader});
        let userDetail = userResponse?.data.map(user => {
          return {
           userContact:user.userContact,
           userName:user.userFName + " " + user.userLName,
           userId: user.userId
          }
        });
        let quizId = id;
        const uDetail = userDetail.filter(user => user.userId == currentUserId);
        setUserDetail(uDetail[0]);
        const response = await axios.get(`https://us-central1-cloudproject-394200.cloudfunctions.net/app/get_quiz_questions/${quizId}`);
         const data = await response?.data;
        const processedQuizDetails = transformData(data?.questions||[]);
        setQuizDetail({quizId:quizId,questions: processedQuizDetails, totalTimeInSeconds: 79});
        setCategoryId(processedQuizDetails[0].subCategory);
        setQuizReady(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setQuizReady(false);
      }
    };
    fetchData();
  }, [id]);

  

   useEffect(() => {
    if (timeRemaining === 0 || currentQuestion === quizDetail?.questions?.length - 1) {
      setIsQuizOver(true);
    }
  }, [timeRemaining, currentQuestion]);


   useEffect(() => {
    return () => {
      socket.current?.close();
    };
  }, []);

  const onSocketOpen = useCallback(() => {
    setIsConnected(true);
    // if(socket.readyState == WebSocket.OPEN){
    //   console.log("SENDING WHEN CONNECTION IS OPEN");
    // const userInfo = {teamId: teamId, quizId:quizId, userId: userId};
    // console.log("USER INFO", userInfo);
    //   try{
    //   socket?.send(JSON.stringify({ action: '$connect', data: userInfo}));
    //   }catch(e){
    //     console.error(e);
    //   }
    // }
  });

  const onSocketClose = useCallback(() => {
    setIsConnected(false);
  }, []);

  const onSocketError = useCallback((error) => {
  }, []);

  const onSocketMessage = useCallback((dataStr) => {
    const data = JSON.parse(dataStr);
    setQuizBoardRow([]);
    setQuizBoardRow(data);
  }, []);


   const onConnect = useCallback(() => {
    const URL = `wss://qedjpastwc.execute-api.us-east-1.amazonaws.com/production?userId=${userId}&quizId=${quizId}&teamId=${teamDetail?.teamId}`;
    if (socket.readyState !== WebSocket.OPEN) {
      socket = new WebSocket(URL);
      // socket.addEventListener('open', onSocketOpen);
      socket.addEventListener('close', onSocketClose);
      socket.addEventListener('message', (event) => {
        onSocketMessage(event.data);
      });
       socket.addEventListener('error', onSocketError);
    }
  });

  const onGenerateLeaderboard = async() => {
      const payload = {
        teamId: teamId,
        categoryId:categoryId,
        quizId:quizId,
        teamDetail: teamDetail,
      };
    try{
      setIsLeaderBoardGenerating(true);
      await axios.post("https://no1vnt52wi.execute-api.us-east-1.amazonaws.com/dev/new-leaderboard-creation", payload);
      navigate('/leaderboard');
    }catch(e){
      console.log(e);
    }finally{
      setIsLeaderBoardGenerating(false);
    }
  }

  const onDisconnect = useCallback(() => {
    if (isConnected) {
    const userInfo = {teamId: teamId, quizId:quizId, userId: userId};
    socket?.current?.send(JSON.stringify({ action: '$disconnect',  data: userInfo}));
    socket?.current?.close();
    }
  }, [isConnected, socket]);

  const submitAnswer = async() => {
    try {
        setCurrentQuestionAnswered(true);
        let marksObtained = 0;
      if(selectedChoices.includes(quizDetail?.questions[currentQuestion].correctAnswer)){
        setCurrentQuestionAnsweredCorrectly(true);
        marksObtained = calculateMarks(currentQuestionStartTime, Date.now());
      }else{
        setCurrentQuestionAnsweredCorrectly(false);
      }

      const submitAnswerParams = {
        teamId: teamId,
        quizId: quizId,
        userId: userId,
        categoryId:categoryId,
        timestamp: Date.now(),
        answerChoice: selectedChoices,
        questionId: quizDetail?.questions[currentQuestion].questionId,
        currentQuestionStartTime: currentQuestionStartTime,
        marks: marksObtained.toFixed(2),
        'teamId#userId#questionId': `${teamId}#${userId}#${quizDetail?.questions[currentQuestion].questionId}`,
        userDetail: userDetail,
        teamDetail: teamDetail,
      };

    await axios.post("https://no1vnt52wi.execute-api.us-east-1.amazonaws.com/dev/submit-answers", submitAnswerParams);
    } catch (error) {
    console.error('Error saving details:', error);
    }
  }

  const calculateMarks = (questionStartTimeTimestamp, questionAnsweredtTimeTimestamp) => {
        const timeDifferenceMs = questionAnsweredtTimeTimestamp - questionStartTimeTimestamp;
        const timeDifferenceSec = timeDifferenceMs / 1000;
        let currentQuestionMarks = 0;
        currentQuestionMarks =  (maxMarks - timeDifferenceSec) + difficulty;
        return currentQuestionMarks;

  }

  const handleChoiceSelection = (choice) => {
    if (answerType === 'single') {
      // Single select logic
      setSelectedChoices([choice]);
    } else {
      // Multi-select logic
      if (selectedChoices.includes(choice)) {
        setSelectedChoices(selectedChoices.filter((selectedChoice) => selectedChoice !== choice));
      } else {
        setSelectedChoices([...selectedChoices, choice]);
      }
    }
  };

  return (
   <>
    <Header />
  {quizDetail && isQuizReady ? (<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
     <div className="top-0 left-0 overflow-auto w-80 mr-auto mt-0 h-72">
    {quizBoardRow.length > 0 ? <ExpandableTable rows={quizBoardRow}></ExpandableTable> : ''}
  </div>
  <div className="top-0 right-0" >
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-3xl absolute top-20 right-4">
      {mainQuizTimer}
    </div>
  </div>
      {isQuizOver ? (
            <div className="max-w-lg p-8 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Generate LeaderBoard</h1>
            <div className="flex justify-center mt-4">
              <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={onGenerateLeaderboard}>
                {isLeaderBoardGenerating ? "Generating LeaderBoard ..." : "Go to Leaderboard"}
              </button>
            </div>
            <div className="text-center mt-8">
              <p className="text-lg font-bold">Woo-hoo! You have completed the quiz.</p>
              <p className="text-lg">Let's move to the leaderboard to view your performance!</p>
            </div>
          </div>
  ) : <div className="max-w-4xl p-8 bg-white rounded shadow">
        {/* <></> */}
        <div className="flex items-center mb-6">
          <div className = "w-20">
            {showQuestionTimer && (<div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg">
            {questionTimer}
          </div>)}
           {showPauseTimer && (<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white font-bold text-lg ml-auto">
            {pauseTimer}
          </div>)}
          </div>
          
          <h1 className="text-2xl font-bold ml-4">{quizDetail?.questions[currentQuestion]?.question}</h1>
         <div className="ml-auto" onClick={onHintClick}>
          <div className="tooltip-new">
            <span className="tooltip-text-new">Share Hints..</span>
            <TipsAndUpdatesIcon style={{ color: 'goldenrod' }} />

          </div>
        </div>
        <div className="ml-auto" onClick={onRequestHintClick}>
          <div className="tooltip-new">
            <LiveHelpIcon style={{ color: 'grey' }} />
            <span className="tooltip-text-new">Request For Hint from team members..</span>
          </div>
        </div>
        
        </div>
        <ul className="grid grid-cols-2 gap-4">
          {quizDetail?.questions[currentQuestion]?.availableChoices.map((choice, index) => (
            <li
              key={index}
              className={`p-4 rounded border border-gray-300 cursor-pointer ${
                selectedChoices.includes(choice) ? 'bg-pink-500 text-white' : ''
              } ${(isCurrentQuestionAnswered && !isCurrentQuestionAnsweredCorrectly && choice == quizDetail?.questions[currentQuestion].correctAnswer) ? 'bg-green-500 text-white' :'' }`}
              onClick={() => handleChoiceSelection(choice)}
            >
              {choice}
            </li>
          ))}
        </ul>
        {
          isCurrentQuestionAnswered && (isCurrentQuestionAnsweredCorrectly ? (
          <div className="mt-4 text-center">
            <p className="text-lg bg-green-500 font-bold">You answered it correctly</p>
          </div>
        ):(
          <div className="mt-4 text-center">
            <p className="text-lg bg-red-500 font-bold">You answered it Wrong! Better Luck Next Time!!</p>
          </div>
        )
        )}
        {showAnswer && (
          <div className="mt-4 text-center">
            <p className="text-lg font-bold">Correct Answer:</p>
            <p>{quizDetail?.questions[currentQuestion]?.correctAnswer}</p>
             <p className="text-lg font-bold">Explanation:</p>
            <p>{quizDetail?.questions[currentQuestion]?.explanation}</p>
          </div>
        )}
        {!isCurrentQuestionAnswered && !showAnswer && selectedChoices.length > 0 && (
          <div className="flex justify-center mt-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={submitAnswer}>
              Submit
            </button>
          </div>
        )}
      </div>}
       <span ref={scroll}></span>
      <ChatUI onValueChange={handleChildValue} scroll={scroll} ref={chatUIRef} teamDetail = {teamDetail} userDetail = {userDetail}  quizDetail = {quizDetail}/> 
    </div>):<h1> Quiz Loading </h1>}
   </>
  );
};

export default QuizPage;
