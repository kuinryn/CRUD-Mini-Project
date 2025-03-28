from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

# CORS Configuration
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],  # Allow all in development
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["*"],
        "supports_credentials": True,
        "expose_headers": ["*"]
    }
})

# In-memory database
memos = [
    {"id": 1, "title": "First Memo", "content": "This is my first memo"},
    {"id": 2, "title": "Second Memo", "content": "Another important note"}
]

# GET all memos
@app.route('/api/memos', methods=['GET'])
def get_memos():
    return jsonify(memos)

# GET single memo
@app.route('/api/memos/<int:memo_id>', methods=['GET'])
def get_memo(memo_id):
    memo = next((m for m in memos if m['id'] == memo_id), None)
    return jsonify(memo) if memo else ('Not found', 404)

# CREATE memo
@app.route('/api/memos', methods=['POST'])
def create_memo():
    new_memo = request.get_json()
    new_memo['id'] = max(m['id'] for m in memos) + 1 if memos else 1
    memos.append(new_memo)
    return jsonify(new_memo), 201

# UPDATE memo
@app.route('/api/memos/<int:memo_id>', methods=['PUT'])
def update_memo(memo_id):
    memo = next((m for m in memos if m['id'] == memo_id), None)
    if not memo:
        return 'Not found', 404
    data = request.get_json()
    memo.update(data)
    return jsonify(memo)

# DELETE memo
@app.route('/api/memos/<int:memo_id>', methods=['DELETE'])
def delete_memo(memo_id):
    global memos
    memos = [m for m in memos if m['id'] != memo_id]
    return jsonify({'message': 'Memo deleted'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)