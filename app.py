from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Got interviewed at Microsoft 4/11/2024'


if __name__ == '__main__':
    app.run()
