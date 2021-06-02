import os
import flask
import hashlib
import datetime

from flask import Flask, render_template, request, redirect
from flask_login import login_required, LoginManager, login_user, UserMixin
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

db = SQLAlchemy()
db.init_app(app)

login_manager = LoginManager()
login_manager.login_message = u'Login before continuing'
login_manager.login_view = 'login_view'
login_manager.init_app(app)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    hash = db.Column(db.String(100))
    salt = db.Column(db.String(100))


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/')
@login_required
def hello_world():
    return render_template('bot_page.html')


@app.route('/login_page')
def login_view():
    return render_template('login.html')


@app.route('/register', methods=['POST'])
def register():
    email = request.form.get('email')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first()

    if user:
        flask.flash('Such user already exists!')
        return redirect('/login_page')

    salt = str(datetime.datetime.utcnow())
    password_hash = hashlib.sha256((password + salt).encode('utf-8'))
    password_hash = password_hash.hexdigest()

    new_user = User(email=email, salt=salt, hash=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return redirect('/')


@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False
    user = User.query.filter_by(email=email).first()

    if (not user or
            user.hash != hashlib.sha256(
                (password + user.salt).encode('utf-8')).hexdigest()):
        flask.flash('Please check your login details and try again.')
        return redirect('/login_page')
    login_user(user, remember=remember)
    return redirect('/')


@app.route('/api/bot', methods=['POST'])
def bot_answer():
    return request.data


if __name__ == '__main__':
    app.run()
