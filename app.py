from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration with default values
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///portfolio.db'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER', '')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD', '')
app.config['PERSONAL_NAME'] = os.getenv('PERSONAL_NAME', 'Your Name')

# Initialize extensions
db = SQLAlchemy(app)
mail = Mail(app)

# Provide the personal name to all templates
@app.context_processor
def inject_personal_info():
    return dict(personal_name=app.config['PERSONAL_NAME'])

# Models


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    technologies = db.Column(db.String(200))
    github_link = db.Column(db.String(200))
    live_link = db.Column(db.String(200))
    image_url = db.Column(db.String(200))

# Sample data for development


def add_sample_projects():
    if Project.query.count() == 0:
        sample_projects = [
            Project(
                title="Portfolio Website",
                description="A modern portfolio website built with Flask and Bootstrap",
                technologies="Python, Flask, Bootstrap, SQLite",
                github_link="https://github.com/yourusername/portfolio",
                live_link="https://your-portfolio.com",
                image_url="https://via.placeholder.com/300x200"
            ),
            Project(
                title="Task Manager",
                description="A full-stack task management application",
                technologies="Python, Flask, SQLAlchemy, JavaScript",
                github_link="https://github.com/yourusername/task-manager",
                live_link="https://task-manager.com",
                image_url="https://via.placeholder.com/300x200"
            )
        ]
        db.session.add_all(sample_projects)
        db.session.commit()

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
        try:
            name = request.form.get('name')
            email = request.form.get('email')
            message = request.form.get('message')

            if not all([name, email, message]):
                return jsonify({'success': False, 'error': 'All fields are required'})

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
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})

    return render_template('contact.html')

# Error handlers


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        add_sample_projects()  # Add sample projects for development
    app.run(debug=True)
