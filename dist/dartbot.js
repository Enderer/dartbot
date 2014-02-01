var Board = (function() {
'use strict';

/**
 * Board
 * Represents a dart board defined by a collection of rings and segments.
 * Provides functions for calculating hits and getting target points and
 * score values for certain areas of the board.
 * @constructor
 */
function Board() { }

/** Radius of the outer board edge */
Board.Radius = 225;

/** List of rings and their outer radius */
Board.Rings = [
    6.35,       // Double Bull
    16,         // Single Bull
    99,         // Skinny Single
    107,        // Treble
    162,        // Fat Single
    170         // Double and edge of score-able area
];

/** List of sectors and their point values */
Board.Sectors = [
    20, 5, 12, 9, 14, 11, 8, 16, 7, 19,
    3, 17, 2, 15, 10, 6, 13, 4, 18, 1
];

/** The size of the angle for a single board sector */
Board.SectorWidth = (2 * Math.PI) / Board.Sectors.length;

/** Converts radians to degrees */
Board.RadiansToDegrees = function(radians) {
    return radians * (180 / Math.PI);
};

/** Gets the point value for the sector at the given index */
Board.GetSectorValue = function(sectorIndex) {
    return Board.Sectors[sectorIndex];
};

/** Get the index of the sector that has the given value */
Board.GetSectorIndex = function(sectorValue) {
    for (var i = 0; i < Board.Sectors.length; i++) {
        if (Board.Sectors[i] === sectorValue) { return i; }
    }
    // Board doesn't contain a sector with this value
    throw 'No sector on the board has this value ' + sectorValue;
};

/** Gets a hit object describing the area of the board the point is located */
Board.GetHit = function(point) {
    // Rotate the board so the first sector is centered vertically
    var pi2 = Math.PI * 2;
    var rotateAngle = (Math.PI / 2) - (Board.SectorWidth / 2);
    var nAngle = point.Angle - rotateAngle;

    // Make sure the angle is between 0 and 2 pi
    if (Math.abs(nAngle) > pi2) { nAngle = nAngle % pi2; }
    if (nAngle < 0) { nAngle = pi2 + nAngle; }

    // Get the ring and sector the point falls on
    var sectorIndex = Math.floor(nAngle / Board.SectorWidth);
    var ring = RingType.OOB;
    for (var r = 0; r < Board.Rings.length; r++) {
        if (Board.Rings[r] > point.Radius) {
            ring = r;
            break;
        }
    }
    return new Hit(sectorIndex, ring, point);
};

/**
 *  Gets the point coordinate of the position in the center of a
 *  given area of the board defined by the sector and ring
 */
Board.GetTargetPoint = function(sector, ring) {
    var rightBound = Board.SectorWidth * sector;
    var targetBound = rightBound + (Board.SectorWidth / 2);
    var rotateAngle = (Math.PI / 2) - (Math.PI / Board.Sectors.length);
    targetBound += rotateAngle;
    var radius = Board.GetRingCenter(ring);
    return new PolarPoint(radius, targetBound);
};

/** Gets the distance from center that is the center point of the ring */
Board.GetRingCenter = function(ring) {
    if (ring === RingType.DoubleBull || ring === RingType.SingleBull) return 0;
    if (ring === RingType.OOB) return Board.Rings[Board.Rings.length - 1] + 5;
    var thisRing = Board.Rings[ring];
    var lastRing = Board.Rings[ring - 1];
    return ((thisRing - lastRing) / 2) + lastRing;
};

/** Gets the point value that corresponds to the given area of the board */
Board.GetHitPoints = function(hit) {
    var points = Board.GetSectorValue(hit.SectorIndex);
    var mult = Board.GetRingMultiple(hit.Ring);

    // Get the point multiplier based on the ring segment. Double=2,Treble=3...
    var thin = RingType.ThinSingle,
        fat = RingType.FatSingle;
    if (hit.Ring === RingType.OOB) mult = 0;
    else if (hit.Ring === RingType.Double) mult = 2;
    else if (hit.Ring === RingType.Treble) mult = 3;
    else if (hit.Ring === RingType.SingleBull) mult = 1;
    else if (hit.Ring === RingType.DoubleBull) mult = 2;
    else if (hit.Ring === thin || hit.Ring === fat) mult = 1;
    else throw 'Invalid Segment Type';

    // Calculate the points hit this throw
    if (hit.Ring === RingType.SingleBull) return 25;
    if (hit.Ring === RingType.DoubleBull) return 50;
    return points * mult;
};

/** Gets the multiple for a ring of the board (single, double, triple) */
Board.GetRingMultiple = function(ring) {
    var mult = 1;
    if (ring === RingType.OOB) { mult = 0; }
    else if (ring === RingType.Double) { mult = 2; }
    else if (ring === RingType.Treble) { mult = 3; }
    else if (ring === RingType.SingleBull) { mult = 1; }
    else if (ring === RingType.DoubleBull) { mult = 2; }
    else if (ring === RingType.FatSingle || ring === RingType.ThinSingle) {
        mult = 1;
    }
    else throw 'Invalid Segment Type';
    return mult;
};

return Board;
}());

var RingType = {
    DoubleBull: 0,
    SingleBull: 1,
    ThinSingle: 2,
    Treble: 3,
    FatSingle: 4,
    Double: 5,
    OOB: 6
};
;var CricketBot = (function() {
'use strict';

/**
 * CricketBot
 * Bot player that plays a game of cricket
 * @constructor
 * @param {number} mean - Mean skill parameter.
 * @param {number} stdev - Standard deviation skill parameter.
 * @param {string} name - Name of the player.
 */
function CricketBot(mean, stdev, name) {
    this.Mean = mean;
    this.Stdev = stdev;
    this.Name = name;
}

/** Preset skill levels */
CricketBot.Players = [
    { name: 'User Player' },
    { name: 'Level 1', mean: 5,  stdev: 4 },
    { name: 'Level 2', mean: 11, stdev: 12 },
    { name: 'Level 3', mean: 12, stdev: 17 },
    { name: 'Level 4', mean: 18, stdev: 20 },
    { name: 'Level 5', mean: 23, stdev: 20 },
    { name: 'Level 6', mean: 32, stdev: 20 },
    { name: 'Level 7', mean: 35, stdev: 20 }
];

/** Tells the player to begin its turn */
CricketBot.prototype.TakeTurn = function(game) {
    var delay = X01Bot.Delay * 2;
    var player = this;
    if (delay > 0) {
        setTimeout(function() {
            return function() {
                CricketBot.TakeThrows(player, game, 3);
            };
        }(), delay);
    }
    else CricketBot.TakeThrows(this, game, 3);
};

/** Player takes one throw of its turn */
CricketBot.TakeThrows = function(player, game, dartsLeft) {
    
    // Acquire a target and attempt a throw at it
    var target = player.AcquireTarget(game, dartsLeft);
    var hit = player.AttemptThrow(target);

    // Determine the number of points the hit is worth
    var points = Board.GetSectorValue(hit.SectorIndex);
    var mult = Board.GetRingMultiple(hit.Ring);
    if (hit.Ring === RingType.DoubleBull || hit.Ring === RingType.SingleBull) {
        points = 25;
    }
    // Apply the hit to the score and decrement the darts left
    var marks = [];
    marks[points] = mult;
    game.ApplyTurn(player, marks, 1);
    --dartsLeft;

    // If no more darts are left or the game has been won end the turn
    if (dartsLeft <= 0 || game.CheckForWin(player) === true) {
        game.EndTurn(player);
    }

    // Take the next throw
    else {
        var delay = X01Bot.Delay;
        if (delay > 0) {
            setTimeout(function() {
                CricketBot.TakeThrows(player, game, dartsLeft);
            }, delay);
        }
        else CricketBot.TakeThrows(player, game, dartsLeft);
    }
};

/** Player attempts a throw at the target and returns the actual hit */
CricketBot.prototype.AttemptThrow = function(targetHit) {
    var target = Board.GetTargetPoint(targetHit.SectorIndex, targetHit.Ring);
    var angle = Random.GetUniform() * Math.PI * 2;
    var radius = Random.GetNormal(this.Mean, this.Stdev);
    var offsetPoint = new PolarPoint(radius, angle);
    var hitPoint = PolarPoint.AddPoints(target, offsetPoint);
    var actualHit = Board.GetHit(hitPoint);
    return actualHit;
};

/**
 * Player picks a target point to throw at based on the game score
 * @param {Object} game - The current game being played.
 * @param {number} dartsLeft - Number of darts left this turn.
 */
CricketBot.prototype.AcquireTarget = function(game, dartsLeft) {
    var target,
        opponent = game.GetOpponent(this),
        myScore = game.GetScore(this),
        theirScore = game.GetScore(opponent),
        myMarks = myScore.GetMarks(),
        theirMarks = theirScore.GetMarks();

    /** Determine which marks are open or can be scored on */
    var myExposed = [];     // Marks I have open that my opponent closed
    var theirExposed = [];  // Marks I have closed that my opponent has open
    var openMarks = [];     // Marks both players still have open

    for (var m = 0; m < game.Marks.length; m++) {
        var mark = game.Marks[m],
            mine = myMarks[mark],
            their = theirMarks[mark];
        if (mine < 3 && their >= 3) { myExposed.push(mark); }
        if (mine >= 3 && their < 3) { theirExposed.push(mark); }
        if (mine < 3 && their < 3) { openMarks.push(mark); }
    }

    // Determine who is ahead in points and who has exposed marks
    // and if you can close all of your open marks with the darts left
    var myPoints = myScore.GetPoints(),
        theirPoints = theirScore.GetPoints(),
        aheadPoints = (myPoints >= theirScore.GetPoints()),
        iAmExposed = myExposed.length > 0,
        theyAreExposed = theirExposed.length > 0,
        canClose = dartsLeft >= myExposed.length;

    // Pick a target
    // Close open marks if you are ahead in points
    if (aheadPoints && iAmExposed && (canClose || myPoints - theirPoints >= 100)) { 
        target = myExposed[0];
    }
    // Shoot for points
    else if (!aheadPoints && theyAreExposed) {
        target = theirExposed[0];
    }
    else if (aheadPoints && theyAreExposed && iAmExposed && !canClose) {
        target = theirExposed[0];
    }

    // Shoot ahead to close open marks
    else if (openMarks.length > 0) { target = openMarks[0]; }

    // Logic failed to pick a target
    else { throw 'Failed to acquire target'; }

    // Return the target. If target is 25 shoot at the double bull
    if (target === 25) { return new Hit(0, RingType.DoubleBull); }
    return new Hit(Board.GetSectorIndex(target), RingType.Treble);
};

return CricketBot;
}());
;var CricketGame = (function() {
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
;var CricketScore = (function() {
'use strict';

/**
 * CricketScore
 * Records a players score for a cricket game.  Provides functionality for
 * applying and canceling turns and calculating points and stats
 * @constructor
 */
function CricketScore(marks) {
    this.TurnStack = [];
    this.IsTurnStarted = false;
    this.Marks = marks;
    //[20, 19, 18, 17, 16, 15, 25];
    this.BlankMarks = [];
    for (var m in this.Marks) this.BlankMarks[this.Marks[m]] = 0;
}

// Applies the marks and number of darts to the current turn
CricketScore.prototype.ApplyTurn = function(marks, darts) {
    // Last turn was finished. Start a new turn
    if (this.IsTurnStarted === false) {
        this.TurnStack.push({ Marks: [], Darts: 0 });
        this.IsTurnStarted = true;
    }
    // Get the current turn and add the darts and marks
    var turn = this.TurnStack[this.TurnStack.length - 1];
    turn.Darts += darts;
    for (var m in marks) {
        // Only score marks that matter in this game
        if (this.BlankMarks[m] === undefined) continue;
        // Initialize the mark to 0
        if (turn.Marks[m] === undefined) turn.Marks[m] = 0;
        // Increment the number times it was hit this turn
        turn.Marks[m] += marks[m];
    }
};

// Ends the current turn
CricketScore.prototype.EndTurn = function() {
    this.IsTurnStarted = false;
};

// Cancels the current turn
CricketScore.prototype.CancelTurn = function() {
    this.TurnStack.pop();
    this.IsTurnStarted = false;
};

// Gets a flattened list of all marks hit this game
CricketScore.prototype.GetMarks = function() {
    var marks = this.BlankMarks.slice();
    for (var t in this.TurnStack)
        for (var m in this.TurnStack[t].Marks)
            marks[m] += this.TurnStack[t].Marks[m];
    return marks;
};

// Gets the points scored this game
CricketScore.prototype.GetPoints = function() {
    var points = 0;
    var marks = this.GetMarks();
    for (var m in marks)
        points += m * Math.max(marks[m] - 3, 0);
    return points;
};

// Gets the total number of darts thrown this game
CricketScore.prototype.NumberOfDarts = function() {
    var darts = 0;
    for (var t in this.TurnStack)
        darts += this.TurnStack[t].Darts;
    return darts;
};

// Gets the total number of marks scored this game
CricketScore.prototype.NumberOfMarks = function() {
    var marks = 0;
    for (var t in this.TurnStack)
        for (var m in this.TurnStack[t].Marks)
            marks += this.TurnStack[t].Marks[m];
    return marks;
};

// Gets the average number of marks scored per turn
CricketScore.prototype.MarksPerRound = function() {
    var darts = this.NumberOfDarts();
    var marks = this.NumberOfMarks();
    if (darts <= 0) return 0;
    return (marks / darts) * 3;
};

// Returns true if all numbers have been closed
CricketScore.prototype.IsClosed = function() {
    var marks = this.GetMarks();
    for (var m in marks) if (marks[m] < 3)
        return false;
    return true;
};

/** Get the last turn taken */
CricketScore.prototype.GetLastTurn = function() {
    if (this.TurnStack.length === 0) return null;
    return this.TurnStack[this.TurnStack.length - 1];
};

CricketScore.prototype.GetTally = function() {
    var tally = { };
    for (var i = 0; i < 10; i++) tally[i] = 0;

    for (var t in this.TurnStack) {
        var marks = 0;
        for (var m in this.TurnStack[t].Marks) {
            marks += this.TurnStack[t].Marks[m];
        }
        tally[marks] += 1;
    }
    return tally;
};

return CricketScore;
}());
;/**
 * @license DartBot v1.1.0
 * Copyright (c) 2011, 2013. All rights reserved.
 * Website: http://www.dartbot.com/ .
 */
var DartBot = { };


;var Hit = (function() {
'use strict';

/**
 * Hit - Represents a hit to a specific area of the board.
 * The area is represented by the sector and ring type
 * @constructor
 * @param {number} sector .
 * @param {number} ring .
 * @param {Object=} point .
 */
function Hit(sector, ring, point) {
    this.SectorIndex = sector;
    this.Ring = ring;
    this.Point = point || Board.GetTargetPoint(sector, ring);
}

/** Does this hit count as a double in **/
Hit.prototype.IsDouble = function() {
    return this.Ring === RingType.Double || this.Ring === RingType.DoubleBull;
};

/** Returns a string representation of the hit */
Hit.prototype.toString = function() {
    // Bullseye and out of bounds
    if (this.Ring === RingType.DoubleBull) return 'DB';
    else if (this.Ring === RingType.SingleBull) return 'SB';
    else if (this.Ring === RingType.OOB) return 'OOB';

    var s = [];
    s[RingType.ThinSingle] = 'S';
    s[RingType.Treble] = 'T';
    s[RingType.FatSingle] = 'S';
    s[RingType.Double] = 'D';

    var str = s[this.Ring];
    str += Board.GetSectorValue(this.SectorIndex);
    return str;
};

/** Returns true if hits are equal */
Hit.prototype.equals = function(hit) {
    if (this.Ring !== hit.Ring) return false;
    else if (this.Ring === RingType.DoubleBull) return true;
    else if (this.Ring === RingType.SingleBull) return true;
    else if (this.Ring === RingType.OOB) return true;
    return this.SectorIndex === hit.SectorIndex;
};

return Hit;
}());
;var PolarPoint = (function() {
'use strict';

/**
 * PolarPoint
 * Represents a point in space defined by polar coordinates (radius, angle)
 * @constructor
 */
function PolarPoint(radius, angle) {
    this.Radius = radius;
    this.Angle = angle;
 }

// Gets a Cartesian point (x, y) from the polar point
PolarPoint.GetCartesian = function(point) {
    return {
        X: PolarPoint.GetCartesianX(point),
        Y: PolarPoint.GetCartesianY(point)
    };
 };

// Get the X value of the Cartesian point
PolarPoint.GetCartesianX = function(point) {
    return point.Radius * Math.cos(point.Angle);
};

// Get the Y value of the Cartesian point
 PolarPoint.GetCartesianY = function(point) {
    return point.Radius * Math.sin(point.Angle);
 };

// Gets a polar point from Cartesian coordinates
PolarPoint.GetFromCartesian = function(x, y) {
    var radiusHit = Math.sqrt((x * x) + (y * y));
    var angleHit = Math.atan2(y, x);

    if (radiusHit < 0) {
        radiusHit = Math.abs(radiusHit);
        angleHit += Math.PI;
    }
    if (angleHit < 0) angleHit += (Math.PI * 2);
    return new PolarPoint(radiusHit, angleHit);
};

// Returns a polar point that is the vector of the two other points
PolarPoint.AddPoints = function(point1, point2) {
    // Convert Polar coordinates to Cartesian grid
    var xOff = PolarPoint.GetCartesianX(point2);
    var yOff = PolarPoint.GetCartesianY(point2);
    var xTarg = PolarPoint.GetCartesianX(point1);
    var yTarg = PolarPoint.GetCartesianY(point1);
    // Add target and offset vectors to get our actual hit
    var xHit = xTarg + xOff;
    var yHit = yTarg + yOff;
    // Create the point and convert it back to polar system
    return PolarPoint.GetFromCartesian(xHit, yHit);
};

return PolarPoint;
}());
;var Random = (function() {

/**
 * Random
 * Random number generator for creating random numbers with various
 * distributions. Includes uniform, normal, and lognormal
 * @constructor
 */
function Random() {

}

Random.GetUniform = function() {
    return Math.random();
};

Random.GetNormal = function(mean, stdev) {
    var u1 = Random.GetUniform();
    var u2 = Random.GetUniform();

    var r = Math.sqrt(-2.0 * Math.log(u1));
    var theta = 2.0 * Math.PI * u2;
    var normal = r * Math.sin(theta);
    normal = mean + stdev * normal;
    return normal;
};

Random.GetLognormal = function(mean, stdev) {
    var normal = Random.GetNormal(mean, stdev);
    var logNormal = Math.exp(normal);
    return logNormal;
};

return Random;
}());
;var UserPlayer = (function() {

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
;var X01Bot = (function() {
'use strict';

/**
 * X01Bot
 * Bot player that plays a game of X01.
 * @constructor
 * @param {number} mean - Mean skill parameter.
 * @param {number} deviation - Standard deviation skill parameter.
 * @param {string} name - Name of the player.
 * @param {number} max - Maximum darts player will take to win a 501 game.
 */
function X01Bot(mean, deviation, name, max) {
    this.Mean = mean;
    this.Stdev = deviation;
    this.Name = name;
    this.MaxThrows = max || 100;
}

/** Amount of delay in the UI before taking a throw */
X01Bot.Delay = 0;

/** Preset skill levels */
X01Bot.Players = [
    { name: 'User Player' },
    { name: 'Level 1', mean: 11, stdev: 12, max: 13 },
    { name: 'Level 2', mean: 15.5, stdev: 6.5, max: 16 },
    { name: 'Level 3', mean: 16, stdev: 6.5, max: 21 },
    { name: 'Level 4', mean: 23.5, stdev: 12, max: 24 },
    { name: 'Level 5', mean: 24.5, stdev: 9.5, max: 28 },
    { name: 'Level 6', mean: 46, stdev: 17, max: 38 },
    { name: 'Level 7', mean: 48, stdev: 16.5, max: 47 }
];

/**
 * Determines the target to shoot for on a double out.  At Targets[40]
 * value is {20,2} which means with 40 points left, shoot at the double twenty
 */
X01Bot.Targets = [
    [1, 1], [1, 1], [1, 2], [1, 1], [2, 2],         //  0 -  4
    [1, 1], [3, 2], [3, 1], [4, 2], [1, 1],         //  5 -  9
    [5, 2], [3, 1], [6, 2], [1, 1], [7, 2],         // 10 - 14
    [3, 1], [8, 2], [1, 1], [9, 2], [3, 1],         // 15 - 15
    [10, 2], [5, 1], [11, 2], [7, 1], [12, 2],      // 20 - 24
    [9, 1], [13, 2], [11, 1], [14, 2], [13, 1],     // 25 - 29
    [15, 2], [15, 1], [16, 2], [17, 1], [17, 2],    // 30 - 34
    [3, 1], [18, 2], [5, 1], [19, 2], [7, 1],       // 35 - 39
    [20, 2], [9, 1], [10, 1], [11, 1], [12, 1],     // 40 - 44
    [13, 1], [14, 1], [15, 1], [16, 1], [17, 1],    // 45 - 49
    [25, 2], [19, 1], [20, 1], [13, 1], [14, 1],    // 50 - 54
    [15, 1], [16, 1], [17, 1], [18, 1], [19, 1],    // 55 - 59
    [20, 1], [15, 3], [10, 3], [13, 3], [16, 3],    // 60 - 64
    [15, 3], [14, 3], [17, 3], [20, 3], [19, 3],    // 65 - 69
    [18, 3], [13, 3], [20, 3], [19, 3], [14, 3],    // 70 - 74
    [15, 3], [20, 3], [15, 3], [14, 3], [13, 3],    // 75 - 79
    [20, 3], [19, 3], [14, 3], [17, 3], [20, 3],    // 80 - 84
    [15, 3], [18, 3], [17, 3], [16, 3], [19, 3],    // 85 - 89
    [18, 3], [17, 3], [20, 3], [19, 3], [18, 3],    // 90 - 94
    [15, 3], [20, 3], [19, 3], [20, 3], [19, 3]     // 95 - 99
];

/** Tell's the bot player to start it's turn */
X01Bot.prototype.TakeTurn = function(game) {
    var delay = X01Bot.Delay * 2;
    var player = this;

    // Begin taking throws. If delay is set, call the function
    // using setTimout. Otherwise call the function directly
    var func = function() { X01Bot.Throw(player, game, 3); };
    if (delay > 0) setTimeout(func, delay);
    else func();
};

/**
* Takes a throw for the player for the given game
*/
X01Bot.Throw = function(player, game, dartsLeft) {
    // Pick a target to shoot at and attempt a throw
    var target = player.AcquireTarget(game);
    var hit = player.AttemptThrow(target);

    // If the player is past the max number of throws
    // start automatically hitting the target
    var score = game.GetScore(player);
    var max = player.GetMaxThrows(score.StartPoints);
    if (score.GetNumberDarts() > max) {
        hit = target;
    }
    // Apply the hit to the score. Returns false if the player
    // busted on this dart. A bust ends the turn immediately
    var success = X01Bot.ApplyHit(player, game, hit);
    if (success === false) {
        if (dartsLeft < 3) game.CancelTurn(player);
        game.ApplyPoints(player, 0, 3, false);
        game.EndTurn(player);
        return;
    }
    // End the turn if 0 points are left or all darts have been thrown
    var pointsLeft = score.GetPointsLeft();
    if (pointsLeft === 0 || --dartsLeft === 0) {
        game.EndTurn(player);
        return;
    }
    // Continue the turn, take the next throw. If delay is set
    var delay = X01Bot.Delay;
    var func = function() { X01Bot.Throw(player, game, dartsLeft); };
    // Delay, call with setTimeout
    if (delay > 0) setTimeout(func, delay);
    // No delay, call function directly
    else func();
};

/** Applies a hit to the the player's score */
X01Bot.ApplyHit = function(player, game, hit) {
    var score = game.GetScore(player);
    var isDoubleIn = score.GetIsDoubleIn();

    // Player needs to double in
    var pointsHit = Board.GetHitPoints(hit);
    if (isDoubleIn === false && game.IsDoubleInRequired) {
        if (hit.IsDouble()) isDoubleIn = true;
        else pointsHit = 0;
    }
    // Player busted, end turn
    var isDouble = game.IsDoubleOutRequired;
    var pointsLeft = score.GetPointsLeft() - pointsHit;
    if (pointsLeft < 0) return false;
    if (pointsLeft === 1 && isDouble) return false;
    if (pointsLeft === 0 && isDouble && hit.IsDouble() === false) {
        return false;
    }
    // Apply the throw
    game.ApplyPoints(player, pointsHit, 1, isDoubleIn);
    return true;
};

/** Attempts a throw at the target and returns what was actually hit */
X01Bot.prototype.AttemptThrow = function(target) {
    // Get the point on the board to aim at when shooting at the target
    var targetPoint = Board.GetTargetPoint(target.SectorIndex, target.Ring);

    // Get a random angle and radius away from the target point.
    // This is how far away the actual hit is from the target.
    var angle = Random.GetUniform() * Math.PI * 2;
    var radius = Random.GetNormal(this.Mean, this.Stdev);

    // Add the offset to the target point to get the actual hit point
    var offsetPoint = new PolarPoint(radius, angle);
    var hitPoint = PolarPoint.AddPoints(targetPoint, offsetPoint);

    // Get the section of the board the hit point lies in
    return Board.GetHit(hitPoint);
};

/**
 * Picks a target to shoot for given the current game score.
 * Chooses triple 20 or uses Targets[] if a double out is possible
 */
X01Bot.prototype.AcquireTarget = function(game) {
    var targets = X01Bot.Targets;
    var score = game.GetScore(this);
    var pointsLeft = score.GetPointsLeft();

    // The player need to double in
    if (!score.GetIsDoubleIn() && game.IsDoubleInRequired)
        return new Hit(0, RingType.Double);

    // No out opportunity, shoot at the triple 20
    if (pointsLeft > targets.length - 1)
        return new Hit(0, RingType.Treble);

    // Try to double out
    var num = targets[pointsLeft][0],
        mult = targets[pointsLeft][1];
    if (num === 25 && mult === 1) {
        // Shoot at the single bull
        return new Hit(0, RingType.SingleBull);
    }
    else if (num === 25 && mult === 2) {
        // Shoot at the double bull
        return new Hit(0, RingType.DoubleBull);
    }
    var ring;
    var sector = Board.GetSectorIndex(targets[pointsLeft][0]);
    if (mult === 1) ring = RingType.FatSingle;
    else if (mult === 2) ring = RingType.Double;
    else if (mult === 3) ring = RingType.Treble;
    else throw 'Invalid ring multiplier[' + mult + ']';
    return new Hit(sector, ring);
};

/**
 * Gets the maximum number of throws the player will take to finish a
 * game of x01 for a given starting point value. Used as part of the
 * player's skill level to determine when the player has thrown too
 * many darts and should start automatically winning the game.
 * @param {number} points - Gets the number of darts to win a
 * game starting with this many points .
 */
X01Bot.prototype.GetMaxThrows = function(points) {
    if(isNaN(points)) throw 'Game points is invalid';
    return Math.round((points / 501) * this.MaxThrows);
};

return X01Bot;
}());
;var X01Game = (function() {
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
;var X01Score = (function() {

/**
 * X01Score
 * Records the score for one player of an X01 game
 * @constructor
 */
function X01Score(points) {
    this.StartPoints = points;
    this.TurnStack = [];
    this.DartsInRound = 3;
    this.IsTurnStarted = false;
}

X01Score.prototype.ApplyPoints = function(points, darts, isDoubleIn) {
    if (this.GetPointsLeft() < points) throw 'Points exceed points remaining';
    if (this.GetPointsLeft() <= 0) throw 'Cannot apply points. Score is 0';

    if (this.IsTurnStarted === false) {
        this.TurnStack.push({ Points: 0, Darts: 0, IsDoubleIn: false });
        this.IsTurnStarted = true;
    }

    var turn = this.TurnStack[this.TurnStack.length - 1];
    turn.Darts += darts;
    turn.Points += points;
    turn.IsDoubleIn |= isDoubleIn;
};

X01Score.prototype.EndTurn = function() {
    this.IsTurnStarted = false;
};

X01Score.prototype.CancelTurn = function() {
    this.TurnStack.pop();
    this.IsTurnStarted = false;
};

X01Score.prototype.GetPointsHit = function() {
    var points = 0;
    for (var i = 0; i < this.TurnStack.length; i++)
        points += this.TurnStack[i].Points;
    return points;
};

X01Score.prototype.GetIsDoubleIn = function() {
    for (var i = 0; i < this.TurnStack.length; i++)
        if (this.TurnStack[i].IsDoubleIn) return true;
    return false;
};

X01Score.prototype.GetPointsLeft = function() {
    return this.StartPoints - this.GetPointsHit();
};

X01Score.prototype.GetNumberDarts = function() {
    var darts = 0;
    for (var i = 0; i < this.TurnStack.length; i++)
        darts += this.TurnStack[i].Darts;
    return darts;
};

X01Score.prototype.GetPointsLastTurn = function() {
    var lastTurn = this.GetLastTurn();
    if (lastTurn === null) return 0;
    return lastTurn.Points;
};

X01Score.prototype.GetPointsPerRound = function() {
    if (this.GetNumberDarts() === 0) return 0;
    var ppd = this.GetPointsHit() / this.GetNumberDarts();
    return ppd * this.DartsInRound;
};

X01Score.prototype.IsScoreWon = function() {
    return this.GetPointsLeft() === 0;
};

X01Score.prototype.GetLastTurn = function() {
    if (this.TurnStack.length === 0) return null;
    return this.TurnStack[this.TurnStack.length - 1];
};

X01Score.prototype.IsAnOut = function(points){
    var nonOuts = [
        169,
        168,
        166,
        165,
        163,
        162,
        159
    ];

    if (points > 170) return false;
    for (var i=0; i<nonOuts.length; i++){
        if (points === nonOuts[i]) return false;
    }
    return true;
};

X01Score.prototype.GetStats = function() {
    var stats = {
        WonGame: false,
        StartedGame: false,

        Time: 0,
        Tally: { },
        NumberOfTurns: 0,
        
        
        StartPoints: 0,
        DartsThrown: 0,
        PointsScored: 0,
        PointsRemaining: 0,
        OneDartAverage: 0,
        ThreeDartAverage: 0,
        TurnsWithAnOut: 0,
        HighestRound: 0

    };
    var tally = [180, 140, 100, 60];
    for(var i = 0; i < tally.length; i++){
        stats.Tally[tally[i]] = 0;
    }
    stats.StartPoints = this.StartPoints;

    // Loop through each turn and calculate statistics
    for(var t = 0; t < this.TurnStack.length; t++) {
        var turn = this.TurnStack[t];
        stats.NumberOfTurns += 1;
        if (this.IsAnOut(stats.StartPoints - stats.PointsScored))
            stats.TurnsWithAnOut += 1;
        stats.PointsScored += turn.Points;
        stats.DartsThrown += turn.Darts;

        if (turn.Points > stats.HighestRound)
            stats.HighestRound = turn.Points;
        var points = this.TurnStack[t].Points;
        for(var p in tally) {
            if (points >= tally[p]) {
                stats.Tally[tally[p]] += 1;
                break;
            }
        }
    }

    
    stats.PointsRemaining = stats.StartPoints - stats.PointsScored;
    stats.OneDartAverage = stats.PointsScored / stats.DartsThrown || 0;
    stats.ThreeDartAverage = stats.OneDartAverage * 3.0 || 0;
    
    return stats;
};
/*
X01 Stats
100+, 120+, 140+, 180+ (total and percent)
Number of turns
Started Game
Won Game
Starting Points
Darts Thrown
Points Scored
Points Left
Points per round
Points per dart
Number of turns with a 3 dart out
Number of turns with a 2 dart out
Number of turns with a 1 dart out
Round output
*/

return X01Score;
}());
;// seedrandom.js version 2.0.
// Author: David Bau 4/2/2011
//
// Defines a method Math.seedrandom() that, when called, substitutes
// an explicitly seeded RC4-based algorithm for Math.random().  Also
// supports automatic seeding from local or network sources of entropy.
//
// Usage:
//
//   <script src=http://davidbau.com/encode/seedrandom-min.js></script>
//
//   Math.seedrandom('yipee'); Sets Math.random to a function that is
//                             initialized using the given explicit seed.
//
//   Math.seedrandom();        Sets Math.random to a function that is
//                             seeded using the current time, dom state,
//                             and other accumulated local entropy.
//                             The generated seed string is returned.
//
//   Math.seedrandom('yowza', true);
//                             Seeds using the given explicit seed mixed
//                             together with accumulated entropy.
//
//   <script src="http://bit.ly/srandom-512"></script>
//                             Seeds using physical random bits downloaded
//                             from random.org.
//
//   <script src="https://jsonlib.appspot.com/urandom?callback=Math.seedrandom">
//   </script>                 Seeds using urandom bits from call.jsonlib.com,
//                             which is faster than random.org.
//
// Examples:
//
//   Math.seedrandom("hello");            // Use "hello" as the seed.
//   document.write(Math.random());       // Always 0.5463663768140734
//   document.write(Math.random());       // Always 0.43973793770592234
//   var rng1 = Math.random;              // Remember the current prng.
//
//   var autoseed = Math.seedrandom();    // New prng with an automatic seed.
//   document.write(Math.random());       // Pretty much unpredictable.
//
//   Math.random = rng1;                  // Continue "hello" prng sequence.
//   document.write(Math.random());       // Always 0.554769432473455
//
//   Math.seedrandom(autoseed);           // Restart at the previous seed.
//   document.write(Math.random());       // Repeat the 'unpredictable' value.
//
// Notes:
//
// Each time seedrandom('arg') is called, entropy from the passed seed
// is accumulated in a pool to help generate future seeds for the
// zero-argument form of Math.seedrandom, so entropy can be injected over
// time by calling seedrandom with explicit data repeatedly.
//
// On speed - This javascript implementation of Math.random() is about
// 3-10x slower than the built-in Math.random() because it is not native
// code, but this is typically fast enough anyway.  Seeding is more expensive,
// especially if you use auto-seeding.  Some details (timings on Chrome 4):
//
// Our Math.random()            - avg less than 0.002 milliseconds per call
// seedrandom('explicit')       - avg less than 0.5 milliseconds per call
// seedrandom('explicit', true) - avg less than 2 milliseconds per call
// seedrandom()                 - avg about 38 milliseconds per call
//
// LICENSE (BSD):
//
// Copyright 2010 David Bau, all rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   1. Redistributions of source code must retain the above copyright
//      notice, this list of conditions and the following disclaimer.
//
//   2. Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
//   3. Neither the name of this module nor the names of its contributors may
//      be used to endorse or promote products derived from this software
//      without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
/**
 * All code is in an anonymous closure to keep the global namespace clean.
 *
 * @param {number=} overflow
 * @param {number=} startdenom
 */
(function(pool, math, width, chunks, significance, overflow, startdenom) {


//
// seedrandom()
// This is the seedrandom function described above.
//
math['seedrandom'] = function seedrandom(seed, use_entropy) {
  var key = [];
  var arc4;

  // Flatten the seed string or build one from local entropy if needed.
  seed = mixkey(flatten(
    use_entropy ? [seed, pool] :
    arguments.length ? seed :
    [new Date().getTime(), pool, window], 3), key);

  // Use the seed to initialize an ARC4 generator.
  arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(arc4.S, pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  math['random'] = function random() {  // Closure to return a random double:
    var n = arc4.g(chunks);             // Start with a numerator n < 2 ^ 48
    var d = startdenom;                 //   and denominator d = 2 ^ 48.
    var x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  // Return the seed that was used
  return seed;
};

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */
function ARC4(key) {
  var t, u, me = this, keylen = key.length;
  var i = 0, j = me.i = me.j = me.m = 0;
  me.S = [];
  me.c = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) { me.S[i] = i++; }
  for (i = 0; i < width; i++) {
    t = me.S[i];
    j = lowbits(j + t + key[i % keylen]);
    u = me.S[j];
    me.S[i] = u;
    me.S[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  me.g = function getnext(count) {
    var s = me.S;
    var i = lowbits(me.i + 1); var t = s[i];
    var j = lowbits(me.j + t); var u = s[j];
    s[i] = u;
    s[j] = t;
    var r = s[lowbits(t + u)];
    while (--count) {
      i = lowbits(i + 1); t = s[i];
      j = lowbits(j + t); u = s[j];
      s[i] = u;
      s[j] = t;
      r = r * width + s[lowbits(t + u)];
    }
    me.i = i;
    me.j = j;
    return r;
  };
  // For robust unpredictability discard an initial batch of values.
  // See http://www.rsa.com/rsalabs/node.asp?id=2009
  me.g(width);
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
/** @param {Object=} result
  * @param {string=} prop
  * @param {string=} typ */
function flatten(obj, depth, result, prop, typ) {
  result = [];
  typ = typeof(obj);
  if (depth && typ == 'object') {
    for (prop in obj) {
      if (prop.indexOf('S') < 5) {    // Avoid FF3 bug (local/sessionStorage)
        try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
      }
    }
  }
  return (result.length ? result : obj + (typ != 'string' ? '\0' : ''));
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
/** @param {number=} smear
  * @param {number=} j */
function mixkey(seed, key, smear, j) {
  seed += '';                         // Ensure the seed is a string
  smear = 0;
  for (j = 0; j < seed.length; j++) {
    key[lowbits(j)] =
      lowbits((smear ^= key[lowbits(j)] * 19) + seed.charCodeAt(j));
  }
  seed = '';
  for (j in key) { seed += String.fromCharCode(key[j]); }
  return seed;
}

//
// lowbits()
// A quick "n mod width" for width a power of 2.
//
function lowbits(n) { return n & (width - 1); }

//
// The following constants are related to IEEE 754 limits.
//
startdenom = math.pow(width, chunks);
significance = math.pow(2, significance);
overflow = significance * 2;

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

// End anonymous scope, and pass initial values.
})(
  [],   // pool: entropy pool starts empty
  Math, // math: package containing random, pow, and seedrandom
  256,  // width: each RC4 output is 0 <= x < 256
  6,    // chunks: at least six RC4 outputs for each double
  52    // significance: there are 52 significant digits in a double
);