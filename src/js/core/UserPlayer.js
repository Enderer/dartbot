var UserPlayer = (function() {

/**
 * User Player
 * Represents a player played by a user. Scores are entered manually.
 * @constructor
 */
function UserPlayer(name) {
    this.Name = name;
}

UserPlayer.prototype.TakeTurn = function() { };

return UserPlayer;
}());


var DummyPlayer = (function() {

/**
 * Dummy Player
 * Used for unit testing.  No scores are entered. Ends turn automatically.
 * @constructor
 */
function DummyPlayer() {}

DummyPlayer.prototype.TakeTurn = function(game) {
    game.EndTurn(this);
};

return DummyPlayer;
}());
