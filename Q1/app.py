from distutils.command.build_scripts import first_line_re
from distutils.log import debug
from flask import Flask, request, jsonify, make_response, render_template, session, redirect
import jwt
import requests
from datetime import datetime, timedelta
from functools import wraps
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ['KEY']

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/carpark_system'
app.config["SQLALCHEMY_TRACK_MODIFICATION"] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    __tablename__ = "user_table"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    password = db.Column(db.String())
    email = db.Column(db.String())
    contact_no = db.Column(db.String())

    def __init__(self, first_name, last_name, password, email, contact_no):
        self.first_name = first_name
        self.last_name = last_name
        self.password = password
        self.email = email
        self.contact_no = contact_no

    def json(self):
        return {"user_id": self.user_id, "first_name": self.first_name, "last_name": self.last_name, "password": self.password, "email": self.email, "contact_no": self.contact_no}

def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        
        token = None

        if not session.get('token'):
            return redirect("/login")
        else:
            token = session.get('token')

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except jwt.ExpiredSignatureError:
            if "logged_in" in session:
                session.pop("logged_in", None)
                session.pop("token", None)
                session.pop("email", None)
                session.pop("contact_no", None)
                session.pop("first_name", None)
                session.pop("last_name", None)
            return redirect("/login") # "Token expired. Get new one"
        except jwt.InvalidTokenError:
            return redirect("/login") # 'Invalid token. Please log in again.'
        except:
            return jsonify({'Message': 'Invalid token'}), 403
        return func(*args, **kwargs)
    return decorated

# Test Pages
# A public route is available for everyone
@app.route('/public')
def public():
    return 'Public can view this'

# An auth route that is only available when there's a token
@app.route('/auth')
@token_required
def auth():
    return 'JWT is verified. Welcome to your dashboard !  '

# View Member Details (Home Page)
@app.route('/home')
@token_required
def home(): 
    if not session.get('logged_in'):
        return redirect("/login")
    else:
        contact_no = session.get("contact_no")
        email = session.get('email')
        first_name = session.get('first_name')
        last_name = session.get('last_name')
        return render_template('view_detail.html', contact_no=contact_no, email=email, first_name=first_name, last_name=last_name)

# Register Page
@app.route('/register')
def register():
    if not session.get('logged_in'):
        return render_template('register.html')
    else:
        return redirect("/home")

@app.route("/user/create", methods=["POST"])
def create_user():
    '''
    This will return create user into the db
    '''
    try:
        data = request.get_json()
        
        first_name = data["first_name"]
        last_name = data["last_name"]
        contact_no = data["contact_no"]
        email = data["email"]
        password = data["password"]

        # check if email alr exist
        email_exists = User.query.filter_by(email=email).first() is not None
        if email_exists:
            return jsonify({"message": "Email has been used", "type": "fail", "reason": "email"}), 200
        
        # Bycrypt pw
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        user_data = {
            "first_name": first_name.title(), 
            "last_name": last_name.title(), 
            "password": hashed_password, 
            "email": email,
            "contact_no": contact_no
        }
        
        user = User(**user_data)

        db.session.add(user)
        db.session.commit()

        # Prep data to return
        user_data_queried = User.query.filter_by(email=email).first()

        user_information = {"user_id":user_data_queried.user_id,"first_name": user_data_queried.first_name, "last_name": user_data_queried.last_name, "email": user_data_queried.email, "contact_no": user_data_queried.contact_no}

        # Create JWT Token
        token = jwt.encode({
                'user': user_data_queried.email,
                #'exp': datetime.utcnow() + timedelta(seconds=10)
                'exp': datetime.utcnow() + timedelta(days=2)
            },
        app.config['SECRET_KEY'])
        session['logged_in'] = True
        # print("token: ",token.decode('utf-8'))
        session["token"] =  token.decode('utf-8') # store token
        session["email"] = user_data_queried.email
        session["first_name"] = user_data_queried.first_name
        session["last_name"] = user_data_queried.last_name
        session["contact_no"] = user_data_queried.contact_no

    except Exception as e:
        return jsonify({"message": e, "type": "error"}), 500
    return jsonify({"message": "Successfully created user", "type": "success", "user_information": user_information}), 200

# Login Page
@app.route('/login')
def login(): 
    if not session.get('logged_in'):
        return render_template('login.html')
    else:
        return redirect("/home")

@app.route('/user/login', methods=['POST'])
def login_user():
    '''
    This will authenticate the user
    '''
    
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    user_data = User.query.filter_by(email=email).first()

    # Verify account
    if not user_data:
        return jsonify({"message": "Username cannot be found", "type": "fail", "reason": "username"}), 200
    else:
        password_ok = bcrypt.check_password_hash(user_data.password, password)

        if not password_ok:
            return jsonify({"message": "Password is wrong", "type": "fail", "reason": "password"}), 200
        else:
            session['logged_in'] = True
            
            token = jwt.encode({
                'user': user_data.email,
                #'exp': datetime.utcnow() + timedelta(seconds=10)
                'exp': datetime.utcnow() + timedelta(days=2)
            },
            app.config['SECRET_KEY'])
            # print("token: ",token.decode('utf-8'))
            session["token"] =  token.decode('utf-8') # store token
            session["email"] = user_data.email
            session["contact_no"] = user_data.contact_no
            session["first_name"] = user_data.first_name
            session["last_name"] = user_data.last_name
            
            user_information = {"user_id": user_data.user_id, "first_name": user_data.first_name, "last_name": user_data.last_name, "email": user_data.email, "contact_no": user_data.contact_no}
            return jsonify({"message": "Login successful", "type": "success", "user_information": user_information}), 200

# Get Carpark Availability
@app.route("/carpark")
@token_required
def carpark():
    return render_template("carpark_availability.html")

# Logout
@app.route('/logout')
def logout():
    if "logged_in" in session:
        session.pop("logged_in", None)
        session.pop("token", None)
        session.pop("email", None)
        session.pop("contact_no", None)
        session.pop("first_name", None)
        session.pop("last_name", None)

    return redirect("/login")


if __name__ == "__main__":
    app.run(debug=True)