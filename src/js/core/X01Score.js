var X01Score = (function() {

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
