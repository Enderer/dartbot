var X01Bot = (function() {
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
