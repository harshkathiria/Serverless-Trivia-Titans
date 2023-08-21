const axios = require("axios");
module.exports.handler = async (event) => {
  console.log(event.sessionState.intent.slots);
  console.log(JSON.stringify(event.interpretations));
  const interpretations = event.interpretations;
  let highestConfidence = -1;
  let intentName = "";

  interpretations.forEach((item) => {
    if (item.nluConfidence && item.nluConfidence > highestConfidence) {
      highestConfidence = item.nluConfidence;
      intentName = item.intent.name;
    }
  });
  if (intentName === "RegisterForQuiz") {
    console.log("RegisterForQuiz Intent");
    const quizSlot = event.sessionState.intent.slots.quizChoice;
    
    return await processRegisterQuiz(quizSlot);
  } else {
    console.log("Process Get Leaderboard Intent");
    return await processGetLeaderboard();
  }
};

const processRegisterQuiz = async (quizSlot) => {
  const frontend_base = "csci-5410-sdp-project-hijgpb3rba-uc.a.run.app";
  const response = await axios.get(
    "https://us-central1-cloudproject-394200.cloudfunctions.net/app/list_quizzes"
  );
  console.log(response);
  const quizzes = response.data.quizzes;
  console.log(quizzes);
  let quizString = "\n";
  for (let i = 1; i <= quizzes.length; i++) {
    console.log(`${i} - ${quizzes[i - 1]}`);
    quizString += `${i}. ${quizzes[i - 1].quiz_name}\n`;
  }
  console.log(quizString);
  if (quizSlot === null) {
    return {
      sessionState: {
        dialogAction: {
          slotToElicit: "quizChoice",
          type: "ElicitSlot",
        },
        intent: {
          confirmationState: "None",
          name: "RegisterForQuiz",
          state: "InProgress",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content:
            "Here are a list of quizzes, please select the choice:\n " +
            quizString,
        },
      ],
    };
  } else {
    const selectedChoice = +quizSlot.value.interpretedValue;
    const selectedQuiz = quizzes[selectedChoice - 1];
    console.log("Selected Choice: " + selectedChoice);
    console.log(JSON.stringify(selectedQuiz));
    console.log("Quiz ID: " + selectedQuiz.quiz_id);
    const quizId = selectedQuiz.quiz_id;
    return {
      sessionState: {
        dialogAction: {
          type: "ConfirmIntent",
        },
        intent: {
          confirmationState: "Confirmed",
          name: "RegisterForQuiz",
          state: "Fulfilled",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content: `I have registered you in the quiz, here is your joining link: https://${frontend_base}/room/${quizId}`,
        },
      ],
    };
  }
};

const processGetLeaderboard = async () => {
  const response = await axios.post(
    "https://no1vnt52wi.execute-api.us-east-1.amazonaws.com/dev/global-leaderboard",
    {}
  );
  console.log(response);
  const sortedArray = response.data.sort(
    (a, b) => parseFloat(b.score) - parseFloat(a.score)
  );
  let responseString = "\n";
  for (let i = 1; i <= sortedArray.length; i++) {
    console.log(`${i} - ${sortedArray[i - 1]}`);
    responseString += `${i}. ${sortedArray[i - 1].teamName} Score: ${sortedArray[i - 1].score}\n`;
  }
  return {
    sessionState: {
      dialogAction: {
        type: "ConfirmIntent",
      },
      intent: {
        confirmationState: "Confirmed",
        name: "GetLeaderboard",
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: `Here are the top entries of leaderboard\n ${responseString}`,
      },
    ],
  };
};
