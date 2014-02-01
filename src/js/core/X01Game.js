var X01Game = (function() {
'use strict';

/**
 * X01Game - Executes a game of X01
 * @constructor
 * @param {number} points - Number of points to start the game .
 * @param {boolean} isDoubleIn - Is a double required to start the game .
 * @param {boolean} isDoubleOut - Is a double required to finish the game .
 * @param {Object} player1 - Player that starts first .
 * @param {Object} player2 - Player that starts second .
 */
function X01Game(points, isDoubleIn, isDoubleOut, player1, player2) {
    this.IsDoubleInRequired = isDoubleIn;
    this.IsDoubleOutRequired = isDoubleOut;

    this.Score1 = new X01Score(points);
    this.Score2 = new X01Score(points);

    this.Player1 = player1;
    this.Player2 = player2;

    this.PlayerToMove = 1;
    this.StartingPlayer = this.PlayerToMove;
    this.GameUpdated = function(game) { };
    this.IsWon = false;
    this.Winner = null;
}

/**
 * Commits the current turn to the player's and updates the game status.
 * Checks if the player has won the game and initiates the next turn.
 */
X01Game.prototype.EndTurn = function(player) {
    // Mark the end of turn on the players score
    this.GetScore(player).EndTurn();
    console.log(this.GetScore(player).GetStats());

    // Game is over. No more turns allowed
    if (this.IsWon) return;

    // Check if the game has been won
    var playerNum = this.GetPlayerNum(player);
    if (this.GetScore(player).IsScoreWon()) {
        this.IsWon = true;
        this.Winner = playerNum;
        // Record what time the game ended
        this.EndTime = new Date();
    }
    this.GameUpdated(this);
    if (this.IsWon === true) {
        return;
    }
    // It wasn't this player's turn, nothing left to do
    if (playerNum !== this.PlayerToMove) return;

    // It's the next players turn
    var nextPlayer = (playerNum % 2) + 1;
    this.PlayerToMove = nextPlayer;
    this.GameUpdated(this);

    if (nextPlayer === 1) this.Player1.TakeTurn(this);
    else if (nextPlayer === 2) this.Player2.TakeTurn(this);
    else throw 'Invalid Player';
};

/** Gets the score object for the given player */
X01Game.prototype.GetScore = function(player) {
    var num = this.GetPlayerNum(player);
    if (num === 1) return this.Score1;
    else if (num === 2) return this.Score2;
    else throw 'Invalid Player';
};

/** Gets the player number (player 1, player 2) for the given player */
X01Game.prototype.GetPlayerNum = function(player) {
    if (player === this.Player1) return 1;
    else if (player === this.Player2) return 2;
    else throw 'Invalid Player';
};

/** Starts the game */
X01Game.prototype.Start = function() {
    // Record the starting time of the game
    this.StartTime = new Date();
    this.GameUpdated(this);
    this.StartingPlayer = this.PlayerToMove;
    if (this.PlayerToMove === 1) this.Player1.TakeTurn(this);
    else if (this.PlayerToMove === 2) this.Player2.TakeTurn(this);
    else throw "PlayerToMove is invalid";
};

/**
 * Applies the given number of points to a player's current turn
 * @param {Object} player - Player adding the points to their score .
 * @param {number} points - Number of points to add to the turn .
 * @param {number} darts - Number of darts used to score the points .
 * @param {boolean} isDoubleIn - True if the player hit a double .
 */
X01Game.prototype.ApplyPoints = function(player, points, darts, isDoubleIn) {
    var score = this.GetScore(player);
    score.ApplyPoints(points, darts, isDoubleIn);
    this.GameUpdated(this);
};

/** Cancels the last turn taken by the given player */
X01Game.prototype.CancelTurn = function(player) {
    // Get the player's score and cancel the last turn
    var score = this.GetScore(player);
    score.CancelTurn();

    // If the player had won the game, recheck the win status
    var playerNum = this.GetPlayerNum(player);
    if (this.IsWon && this.Winner === playerNum) {
        this.IsWon = false;
        this.Winner = null;
        if (score.IsScoreWon()) {
            this.IsWon = true;
            this.Winner = playerNum;
        }
    }
    this.GameUpdated(this);
};

/**
 * Updates the number of darts used on the most recent turn.
 * Used at the end of the game if the player doesn't use all three darts
 */
X01Game.prototype.SetDartsLastTurn = function(player, darts) {
    var score = this.GetScore(player);
    var lastTurn = score.GetLastTurn();
    lastTurn.Darts = darts;
    this.GameUpdated(this);
};

return X01Game;
}());
