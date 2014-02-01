var CricketGame = (function() {
'use strict';

/**
 * CricketGame - Bot player that plays a game of cricket
 * @constructor
 */
function CricketGame(player1, player2, marks) {
    this.Marks = marks || CricketGame.Marks;
    this.Score1 = new CricketScore(this.Marks);
    this.Score2 = new CricketScore(this.Marks);

    this.Player1 = player1;
    this.Player2 = player2;

    this.PlayerToMove = 1;
    this.GameUpdated = function(game) { };
    this.GameOver = function() { };
    this.IsWon = false;
    this.Winner = null;
}

/** Default marks to play a game of cricket */
CricketGame.Marks = [20, 19, 18, 17, 16, 15, 25];

/** Begin the game */
CricketGame.prototype.Start = function() {
    this.GameUpdated(this);
    this.Player1.TakeTurn(this);
};

/** Player's turn is over. Update the game state */
CricketGame.prototype.EndTurn = function(player) {

    // Mark the end of turn on the players score
    var score = this.GetScore(player);
    score.EndTurn();

    // Get the opponents score
    var playerNum = this.GetPlayerNum(player);
    var opponent = this.GetOpponent(player);
    var opponentNum = this.GetPlayerNum(opponent);

    // Check if the game has been won
    if (this.CheckForWin(player) === true) {
        this.IsWon = true;
        this.Winner = playerNum;
        this.GameOver();
    }
    this.GameUpdated(this);

    // Game is already won, nothing left to do
    if (this.IsWon === true) return;

    // It wasn't this player's turn, nothing left to do
    if (playerNum !== this.PlayerToMove) return;

    // It's the next players turn
    this.PlayerToMove = opponentNum;
    this.GameUpdated(this);
    var nextPlayer = (this.PlayerToMove === 1) ? this.Player1 : this.Player2;
    nextPlayer.TakeTurn(this);
};

/** Returns true if the given player has won the game */
CricketGame.prototype.CheckForWin = function(player) {
    var score = this.GetScore(player);
    var opponent = this.GetOpponent(player);
    var opponentScore = this.GetScore(opponent);

    var myPoints = score.GetPoints();
    var theirPoints = opponentScore.GetPoints();

    // If the player is ahead in points and has all the marks closed
    // and the game isn't already won then they have won the game
    return (myPoints >= theirPoints && score.IsClosed() && !this.IsWon);
};

/** Get the score object for the given player */
CricketGame.prototype.GetScore = function(player) {
    var num = this.GetPlayerNum(player);
    if (num === 1) return this.Score1;
    else if (num === 2) return this.Score2;
    else throw 'Invalid Player';
};

/** Get the opponent player object for the given player */
CricketGame.prototype.GetOpponent = function(player) {
    var playerNum = this.GetPlayerNum(player);
    if (playerNum === 1) return this.Player2;
    else if (playerNum === 2) return this.Player1;
    else throw 'Invalid player';
};

/** Get the player number (1 or 2) for the given player */
CricketGame.prototype.GetPlayerNum = function(player) {
    if (player === this.Player1) return 1;
    else if (player === this.Player2) return 2;
    else throw 'Invalid Player';
};

/**
 * Apply the number of marks to the players score
 * @param {Object} player - Cricket Player.
 * @param {number} mark - Mark that has been hit (20, 19, 18...).
 * @param {number} hits - Number of times the mark was hit.
 * @param {number} darts - Number of darts used to achieve the hits.
 */
CricketGame.prototype.ApplyMark = function(player, mark, hits, darts) {
    var marks = [];
    marks[mark] = hits;
    this.ApplyTurn(player, marks, darts);
};

/** Apply a set of hits to a player's score
 * @param {Object} player - Cricket Player.
 * @param {Array} marks - List of marks and the number of hits to each.
 * @param {number} darts - Number of darts used to achieve the hits.
 */
CricketGame.prototype.ApplyTurn = function(player, marks, darts) {
    var score = this.GetScore(player);
    var opponent = this.GetOpponent(player);
    var opponentScore = this.GetScore(opponent);
    var playerMarks = score.GetMarks();
    var opponentMarks = opponentScore.GetMarks();

    // If the mark is closed by opponent only 3 hits will count
    for (var m in marks) {
        if (opponentMarks[m] >= 3) {
            var max = Math.max(0, 3 - playerMarks[m]);
            marks[m] = Math.min(marks[m], max);
        }
    }
    // Apply the turn to the game score
    score.ApplyTurn(marks, darts);
    this.GameUpdated(this);
};

/** Cancel the players most recent turn */
CricketGame.prototype.CancelTurn = function(player) {
    // Cancel the last turn
    var score = this.GetScore(player);
    score.CancelTurn();

    // If the player has won the game canceling the turn
    // may change that. Recheck if the game is won.
    var playerNum = this.GetPlayerNum(player);
    if (this.IsWon && this.Winner === playerNum) {
        this.IsWon = false;
        this.Winner = null;
        if (this.CheckForWin(player)) {
            this.IsWon = true;
            this.Winner = playerNum;
        }
    }
    // Fire game updated event
    this.GameUpdated(this);
};

/**
 * Updates the number of darts used on the most recent turn.
 * Used at the end of the game if the player doesn't use all three darts
 */
CricketGame.prototype.SetDartsLastTurn = function(player, darts) {
    var score = this.GetScore(player);
    var lastTurn = score.GetLastTurn();
    lastTurn.Darts = darts;
    this.GameUpdated(this);
};

return CricketGame;
}());
