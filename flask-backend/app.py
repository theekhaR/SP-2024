from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/job', methods=['GET'])
def get_job():
    job_data = {
        "title": "Frontend Software Developer - Junior Web Development Position - React/JavaScript",
        "description": "We are seeking a motivated Junior Frontend Developer to build responsive, user-friendly web applications using React and JavaScript.",
        "company": "MyCompany Limited Co.",
        "company_logo": "your-company-logo-url",
        "listing_image": "your-image-url",
        "posted_days_ago": "2 days ago",
        "duration": "Full-Time",
        "position_level": "Intermediate",
        "work_experience": "0 - 3 years",
        "location": "Bangkok",
        "requirements": [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam."
        ]
    }
    return jsonify(job_data)


if __name__ == "__main__":
    app.run(debug=True)
