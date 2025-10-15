from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)
db = client['livestream_app']
overlays_collection = db['overlays']

@app.route("/")
def home():
    return "Hello, Livestream App!"

# Get all overlays
@app.route("/api/overlays", methods=["GET"])
def get_overlays():
    overlays = list(overlays_collection.find({}, {'_id': 0}))
    return jsonify(overlays)

# Create a new overlay
@app.route("/api/overlays", methods=["POST"])
def create_overlay():
    data = request.json
    overlays_collection.insert_one(data)
    return jsonify({"msg": "Overlay created"}), 201

# Get overlay by id
@app.route("/api/overlays/<int:overlay_id>", methods=["GET"])
def get_overlay(overlay_id):
    overlay = overlays_collection.find_one({"id": overlay_id}, {'_id': 0})
    if overlay:
        return jsonify(overlay)
    else:
        return jsonify({"msg": "Overlay not found"}), 404

# Update overlay by id
@app.route("/api/overlays/<int:overlay_id>", methods=["PUT"])
def update_overlay(overlay_id):
    data = request.json
    result = overlays_collection.update_one({"id": overlay_id}, {"$set": data})
    if result.matched_count:
        return jsonify({"msg": "Overlay updated"})
    else:
        return jsonify({"msg": "Overlay not found"}), 404

# Delete overlay by id
@app.route("/api/overlays/<int:overlay_id>", methods=["DELETE"])
def delete_overlay(overlay_id):
    result = overlays_collection.delete_one({"id": overlay_id})
    if result.deleted_count:
        return jsonify({"msg": "Overlay deleted"})
    else:
        return jsonify({"msg": "Overlay not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
