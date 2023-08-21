import json
from google.cloud import firestore

def get_collection(request):
    db = firestore.Client()
    collection_name = 'User'  # Replace with the actual name of your Firestore collection
    docs = db.collection(collection_name).get()
    
    # Convert Firestore documents to Python dictionaries
    data = [doc.to_dict() for doc in docs]
    
    # Return JSON response
    return json.dumps(data)