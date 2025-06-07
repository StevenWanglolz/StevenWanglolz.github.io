# Portfolio

This repository contains a simple Flask-based portfolio website. It shows personal information, projects loaded from a SQLite database, and includes a contact form that can send email notifications.

## Setup

1. **Install dependencies**

   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Environment variables**

   Create a `.env` file based on the existing sample. Provide values for:

   - `SECRET_KEY` – Flask secret key
   - `EMAIL_USER` and `EMAIL_PASSWORD` – credentials for sending contact emails
   - `PERSONAL_NAME` – your name as it should appear on the site

3. **Initialize the database**

   When you run the app for the first time, the database `instance/portfolio.db` will be created automatically and sample projects will be inserted.

   ```bash
   python app.py
   ```

   You can edit `app.py` or use the SQLite database directly to add your own projects.

4. **Run the development server**

   ```bash
   flask --app app run
   ```

   The site will be available at `http://127.0.0.1:5000/` by default.

## Customising Your Portfolio

- **Personal information** – Update the templates in the `templates/` folder. For example, change `base.html` to display your name, and edit `about.html` and `contact.html` with your details.
- **Projects** – Modify the `Project` entries in the database to show your own work. Each project includes a title, description, technology list, GitHub link, live demo link and optional image.
- **Styles** – Adjust `static/css/style.css` or add new CSS/JS files under `static/` to change the look and feel.

## Learning Goals

This project is ideal for practising:

- Flask routing and templating
- Database interaction using SQLAlchemy
- Creating responsive front end pages with Bootstrap

Feel free to experiment and extend the application as you develop your portfolio.
