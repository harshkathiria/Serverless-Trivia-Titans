import base64
import json
import logging
from flask import Response
from google.cloud import firestore
from google.cloud import language_v1

def tag_trivia_questions(event):
    # Define the predefined categories
    predefined_categories = {
        'Sports': ['sports', 'football', 'basketball', 'tennis', 'soccer', 'cricket', 'hockey'],
        'History': ['history', 'world wars', 'ancient civilizations', 'famous leaders', 'historical events'],
        'General Knowledge': ['general knowledge', 'trivia', 'random facts', 'did you know'],
        'Entertainment': ['entertainment', 'movies', 'music', 'celebrities', 'TV shows'],
        'Technology': ['technology', 'computers', 'internet', 'gadgets', 'software', 'programming'],
        'Science': ['science', 'chemistry', 'physics', 'biology', 'astronomy', 'scientific discoveries'],
        'Literature': ['literature', 'books', 'authors', 'poetry', 'novels', 'literary works'],
        'Music': ['music', 'musicians', 'bands', 'genres', 'songs', 'concerts'],
        'Food and Drink': ['food and drink', 'cuisine', 'recipes', 'cooking', 'beverages'],
        'Geography': ['geography', 'countries', 'cities', 'landmarks', 'maps', 'continents']
    }

    # Initialize Firestore client
    db = firestore.Client()

    # Get the questions collection reference
    questions_ref = db.collection('Questions')

    # Get all documents in the collection
    try:
        questions = questions_ref.stream()
    except Exception as e:
        logging.error("Error fetching documents from Firestore:", exc_info=True)
        return

    # Create a client for the Natural Language API
    language_client = language_v1.LanguageServiceClient()

    for question_doc in questions:
        # Get the question document data
        question_data = question_doc.to_dict()
        question_id = question_doc.id
        question_content = question_data.get('question', '')

        # Use the Natural Language API to classify the question content into categories
        document = language_v1.Document(content=question_content, type_=language_v1.Document.Type.PLAIN_TEXT)
        try:
            classification = language_client.classify_text(request={'document': document})
        except Exception as e:
            logging.error(f"Error classifying text for question ID '{question_id}':", exc_info=True)
            continue

        # Initialize the category variable
        category = None

        # Extract the top category
        if classification.categories:
            top_category = classification.categories[0].name
            # Check if the top category matches any of the predefined categories
            for category_name, keywords in predefined_categories.items():
                for keyword in keywords:
                    if keyword in top_category.lower():
                        category = category_name
                        break
                if category:
                    break

        # If category is still None, set it to "Not categorized"
        if category is None:
            category = "Not categorized"

        # Update the Firestore document to include the 'category' field
        try:
            question_ref = questions_ref.document(question_id)
            question_ref.update({'category': category})
            logging.info(f"Question with ID '{question_id}' classified into category: {category}")
        except Exception as e:
            logging.error(f"Error updating question with ID '{question_id}' in Firestore:", exc_info=True)
            continue

    logging.info("Tagging process completed successfully")

    # Return an HTTP 200 response indicating success
    return Response("Tagging process completed successfully", status=200, mimetype='text/plain')

# Configure logging
logging.basicConfig(level=logging.INFO)