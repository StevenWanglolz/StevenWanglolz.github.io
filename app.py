from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'I didn't solve my leetcode problem today 4/6/2024'


if __name__ == '__main__':
    app.run()
