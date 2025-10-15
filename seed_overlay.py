from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['livestream_app']
overlays = db['overlays']

# Remove any previous test data:
overlays.delete_many({"id": 1})

overlay_doc = {
    "id": 1,
    "type": "text",
    "content": "Sample Overlay",
    "position": {"x": 100, "y": 150},
    "size": {"width": 200, "height": 50}
}

overlays.insert_one(overlay_doc)
print("Sample overlay inserted.")
