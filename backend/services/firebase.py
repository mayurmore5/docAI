import firebase_admin
from firebase_admin import credentials, firestore, auth
from config import settings
import os

db = None

def initialize_firebase():
    global db
    if not firebase_admin._apps:
        if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            print("Firebase initialized successfully.")
        else:
            print(f"Warning: Firebase credentials not found at {settings.FIREBASE_CREDENTIALS_PATH}. Firebase features will fail.")

def get_db():
    if db is None:
        initialize_firebase()
    return db

def verify_token(token: str):
    if not firebase_admin._apps:
        initialize_firebase()
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None
