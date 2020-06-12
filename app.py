from boggle import Boggle
from flask import Flask, request, render_template, redirect, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
debug = DebugToolbarExtension(app)
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

boggle_game = Boggle()
board = boggle_game.make_board()

@app.route('/')
def home():
    # session.clear()
    session['board'] = board
    games_played = session.get('games_played',0)
    high_score = session.get('high_score',0)
    return render_template('board.html',games_played=games_played,high_score=high_score)

@app.route('/check')
def home_post():
    guess = request.args.get('guess')
    session['guess'] = guess
    is_valid = boggle_game.check_valid_word(board,guess)
    return jsonify({'result': is_valid})

@app.route('/update', methods=['POST'])
def update():
    round_score = request.json['score']
    games_played = session.get('games_played',0)
    session['games_played'] = games_played + 1
    high_score = session.get('high_score',0)

    if round_score > high_score or not high_score:
        session['high_score'] = round_score
    return jsonify(high_score)