from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///portfolio.db'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD')

# Initialize extensions
db = SQLAlchemy(app)
mail = Mail(app)

# Models


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    technologies = db.Column(db.String(200))
    github_link = db.Column(db.String(200))
    live_link = db.Column(db.String(200))
    image_url = db.Column(db.String(200))

# Routes


@app.route('/')
def home():
    projects = Project.query.all()
    return render_template('index.html', projects=projects)


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

        msg = Message('New Contact Form Submission',
                      sender=email,
                      recipients=[app.config['MAIL_USERNAME']])
        msg.body = f"""
        From: {name}
        Email: {email}
        Message: {message}
        """
        mail.send(msg)
        return jsonify({'success': True})

    return render_template('contact.html')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
