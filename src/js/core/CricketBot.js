var CricketBot = (function() {
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
