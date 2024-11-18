```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv('CORS_ORIGIN', '*'),
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb',
    region_name=os.getenv('AWS_REGION', 'us-east-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)
table = dynamodb.Table(os.getenv('DYNAMODB_TABLE', 'Tasks'))

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()})

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        response = table.scan()
        return jsonify(response.get('Items', []))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.json
        if not data or 'title' not in data:
            return jsonify({"error": "Title is required"}), 400

        task_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        
        item = {
            'id': task_id,
            'title': data['title'],
            'completed': False,
            'created_at': timestamp,
            'updated_at': timestamp
        }
        
        table.put_item(Item=item)
        return jsonify(item), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tasks/', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.json
        timestamp = datetime.utcnow().isoformat()
        
        response = table.update_item(
            Key={'id': task_id},
            UpdateExpression='SET title = :title, completed = :completed, updated_at = :timestamp',
            ExpressionAttributeValues={
                ':title': data.get('title'),
                ':completed': data.get('completed', False),
                ':timestamp': timestamp
            },
            ReturnValues='ALL_NEW'
        )
        
        return jsonify(response['Attributes'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tasks/', methods=['DELETE'])
def delete_task(task_id):
    try:
        table.delete_item(Key={'id': task_id})
        return '', 204
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development')
```
