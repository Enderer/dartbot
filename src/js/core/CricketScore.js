var CricketScore = (function() {
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
