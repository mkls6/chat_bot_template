from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('bot_page.html')


@app.route('/api/bot', methods=['POST'])
def bot_answer():
    return request.data


if __name__ == '__main__':
    app.run()
