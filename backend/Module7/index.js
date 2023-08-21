const express = require("express");
const { v4: uuidv4 } = require('uuid');
const functions = require('firebase-functions')

const app = express();
const cors = require('cors');
const { quizCollection, questionCollection } = require("./db/db");

// Enable CORS and parse incoming JSON data
app.use(cors());
app.use(express.json());

// Route to add a new question
app.post('/add_question', async (req, res) => {
  const data = req.body;

  const question_id = uuidv4();
  const question_text = data.question_text;
  const option1 = data.option1;
  const option2 = data.option2;
  const option3 = data.option3;
  const option4 = data.option4;
  const answer = data.answer;
  const category = data.category;
  const explanation = data.explanation;
  const hint = data.hint;

  try {
    // Add the question data to Firestore
    await questionCollection.doc(question_id).set({
      question_id,
      question_text,
      option1,
      option2,
      option3,
      option4,
      answer,
      category,
      explanation,
      hint, 
    });

    res.status(201).json({ message: 'Question added successfully!', question_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding the question.' });
  }
});

// Route to update an existing question
app.put('/update_question/:question_id', async (req, res) => {
  const question_id = req.params.question_id;
  const data = req.body;

  const question_text = data.question_text;
  const option1 = data.option1;
  const option2 = data.option2;
  const option3 = data.option3;
  const option4 = data.option4;
  const answer = data.answer;
  const category = data.category;
  const explanation = data.explanation;
  const hint = data.hint;

  try {
    await questionCollection.doc(question_id).update({
      question_text,
      option1,
      option2,
      option3,
      option4,
      answer,
      category,
      explanation,
      hint, 
    });

    res.status(200).json({ message: 'Question updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating the question.' });
  }
});

// Route to delete a question by its ID
app.delete('/delete_question/:question_id', async (req, res) => {
  const question_id = req.params.question_id;

  try {

    await questionCollection.doc(question_id).delete();

    res.status(200).json({ message: 'Question deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting the question.' });
  }
});

// Route to create a quiz based on a specified category
app.post('/create_quiz_from_category', async (req, res) => {
  const data = req.body;

  const quiz_id = uuidv4();
  const quiz_name = data.quiz_name;
  const start_date = data.start_date;
  const end_date = data.end_date;
  const quiz_category = data.quiz_category;
  const difficulty_level = data.difficulty_level;
  const total_points = data.total_points;
  const quiz_description = data.quiz_description;
  const total_num_questions = parseInt(data.total_num_questions);

  try {

    const querySnapshot = await questionCollection.where('category', '==', quiz_category).get();
    const questions = querySnapshot.docs.map((doc) => doc.data());

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: 'No questions found in the selected category!' });
    }


    if (total_num_questions > questions.length) {
      return res.status(500).json({ error: 'Insufficient questions in the category. Add more questions first.' });
    }


    const selected_questions = shuffleArray(questions).slice(0, total_num_questions);


    const question_ids = selected_questions.map((question) => question.question_id);


    await quizCollection.doc(quiz_id).set({
      quiz_id,
      quiz_name,
      start_date,
      end_date,
      quiz_category,
      difficulty_level,
      total_points,
      quiz_description,
      total_num_questions,
      questions: question_ids,
    });

    res.status(201).json({ message: 'Quiz created successfully!', quiz_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating the quiz.' });
  }
});

// Helper function to shuffle an array randomly
function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}


const { DateTime } = require('luxon'); 

// Route to list quizzes based on optional parameters like difficulty_level and category
app.get('/list_quizzes/:difficulty_level?/:category?', async (req, res) => {
  const difficulty_level = req.params.difficulty_level;
  const category = req.params.category;

  try {
    let query = quizCollection;

    if (difficulty_level && category) {
      query = query.where('quiz_category', '==', category).where('difficulty_level', '==', difficulty_level);
    } else if (difficulty_level) {
      query = query.where('difficulty_level', '==', difficulty_level);
    } else if (category) {
      query = query.where('quiz_category', '==', category);
    }

    const querySnapshot = await query.get();
    const quizzes = querySnapshot.docs.map((doc) => doc.data());


    quizzes.forEach((quiz) => {
      const startDate = DateTime.fromISO(quiz.start_date);
      const endDate = DateTime.fromISO(quiz.end_date);
      const totalSeconds = endDate.diff(startDate, 'seconds').seconds;
      quiz.total_time = Math.floor(totalSeconds); 
    });

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching quizzes.' });
  }
});

// Route to get all questions from the database
app.get('/get_all_questions', async (req, res) => {
  try {
    const querySnapshot = await questionCollection.get();
    const questions = querySnapshot.docs.map((doc) => doc.data());

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found!' });
    }

    res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching questions.' });
  }
});

// Route to get a single question by its ID
app.get('/get_question/:question_id', async (req, res) => {
  const question_id = req.params.question_id;

  try {
    const docSnapshot = await questionCollection.doc(question_id).get();
    const question = docSnapshot.data();

    if (!question) {
      return res.status(404).json({ error: 'Question not found!' });
    }

    res.status(200).json({ question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching the question.' });
  }
});

// Route to edit an existing quiz by its ID
app.put('/edit_quiz/:quiz_id', async (req, res) => {
  const quiz_id = req.params.quiz_id;
  const data = req.body;

  const quiz_name = data.quiz_name;
  const start_date = data.start_date;
  const end_date = data.end_date;
  const quiz_category = data.quiz_category;
  const difficulty_level = data.difficulty_level;
  const total_points = data.total_points;
  const quiz_description = data.quiz_description;
  const total_num_questions = parseInt(data.total_num_questions); 

  try {

    const querySnapshot = await questionCollection.where('category', '==', quiz_category).get();
    const questions = querySnapshot.docs.map((doc) => doc.data());

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: 'No questions found in the selected category!' });
    }

    if (total_num_questions > questions.length) {
      return res.status(500).json({ error: 'Insufficient questions in the category. Add more questions first.' });
    }

    const selected_questions = questions.sort(() => Math.random() - 0.5).slice(0, total_num_questions);

    const question_ids = selected_questions.map((question) => question.question_id);

    await quizCollection.doc(quiz_id).update({
      quiz_name,
      start_date,
      end_date,
      quiz_category,
      difficulty_level,
      total_points,
      quiz_description,
      questions: question_ids,
      total_num_questions,
    });

    res.status(200).json({ message: 'Quiz updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating the quiz.' });
  }
});

// Route to delete a quiz by its ID
app.delete('/delete_quiz/:quiz_id', async (req, res) => {
  const quiz_id = req.params.quiz_id;

  try {
    const quizDoc = await quizCollection.doc(quiz_id).get();
    if (!quizDoc.exists) {
      return res.status(404).json({ error: 'Quiz not found!' });
    }

    await quizCollection.doc(quiz_id).delete();

    res.status(200).json({ message: 'Quiz deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting the quiz.' });
  }
});

// Route to get the questions of a quiz by its ID
app.get('/get_quiz_questions/:quiz_id', async (req, res) => {
  const quiz_id = req.params.quiz_id;

  try {
    const quizDoc = await quizCollection.doc(quiz_id).get();
    const quiz = quizDoc.data();

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found!' });
    }

    const question_ids = quiz.questions || [];

    const questions = [];
    for (const question_id of question_ids) {
      const questionDoc = await questionCollection.doc(question_id).get();
      const question = questionDoc.data();
      if (question) {
        questions.push(question);
      }
    }

    const startDate = new Date(quiz.start_date);
    const endDate = new Date(quiz.end_date);
    const total_time = Math.floor((endDate - startDate) / 1000);

    res.status(200).json({ quiz_id, questions, total_time });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching quiz questions.' });
  }
});

// const PORT = process.env.PORT || 3300 ;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

exports.app = functions.https.onRequest(app);