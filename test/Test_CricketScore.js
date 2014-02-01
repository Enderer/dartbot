(function() {
'use strict';

module('CricketScore');

test('ApplyTurn', function () {
    var score;
    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 3, 19: 4 }, 3);
    equal(score.GetPoints(), 19, 'Points is 19');
    
    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 0, 19: 4 }, 3);
    score.ApplyTurn({ 20: 3, 19: 0 }, 3);
    score.ApplyTurn({ 20: 3, 19: 0 }, 3);
    equal(score.GetPoints(), 79, 'Points is 79');
});

test('CancelTurn', function () {
    var score;
    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 0, 19: 4 }, 3);
    score.ApplyTurn({ 20: 3, 19: 0 }, 3);
    score.ApplyTurn({ 20: 3, 19: 0 }, 3);
    score.CancelTurn();
    equal(score.GetPoints(), 0, 'Points is 0');

    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 0, 19: 4 }, 3);
    score.ApplyTurn({ 20: 3, 19: 0 }, 3);
    score.ApplyTurn({ 20: 3, 19: 0 }, 3);
    score.EndTurn();
    score.CancelTurn();
    equal(score.GetPoints(), 0, 'Points is 0');
    
    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.CancelTurn();
    score.CancelTurn();
    score.CancelTurn();
    equal(score.GetPoints(), 0, 'Points is 0');

});

test('EndTurn', function () {
    var score;
    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 0, 19: 4 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 20: 3, 19: 0 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 20: 3, 19: 0 }, 3);
    score.CancelTurn();
    equal(score.GetPoints(), 19, 'Points is 19');

    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 0, 19: 4 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 20: 3, 19: 0 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 20: 3, 19: 0 }, 3);
    score.EndTurn();
    score.CancelTurn();
    equal(score.GetPoints(), 19, 'Points is 19');
});

test('EmptyTurn', function () {
    var score;
    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    equal(score.GetPoints(), 0, 'Points is 0');

    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.CancelTurn();
    equal(score.GetPoints(), 0, 'Points is 0');
});

test('IsClosed', function () {
    var score;
    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 3, 19: 3, 18: 3 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 17: 3, 16: 3, 15: 3 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 25: 3 }, 3);
    score.EndTurn();
    ok(score.IsClosed(), 'Score is closed');

    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 3, 19: 3, 18: 3 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 17: 3, 16: 3, 15: 3 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 25: 2 }, 3);
    score.EndTurn();
    ok(score.IsClosed() == false, 'Score is not closed');

    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 3, 19: 3, 18: 3 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 17: 3, 16: 3, 15: 3 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 25: 3 }, 3);
    score.EndTurn();
    score.CancelTurn();
    ok(score.IsClosed() == false, 'Canceled score is not closed');

});

test('Stats', function () {
    var score;
    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 3, 19: 3, 18: 3 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 17: 3, 16: 3, 15: 3 }, 3);
    score.EndTurn();
    score.ApplyTurn({ 25: 4 }, 3);
    score.EndTurn();

    var points = score.GetPoints(),
        darts = score.NumberOfDarts(),
        marks = score.NumberOfMarks(),
        mpr = score.MarksPerRound();

    equal(points, 25, 'Points is correct');
    equal(darts, 9, 'Darts is correct'); 
    equal(marks, 22, 'Marks is correct');
    equal(mpr.toFixed(2), 7.33, 'Mpr is correct');
});

test('LastTurn', function () {
    var score, turn, marks;
    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 3, 19: 3, 18: 3 }, 3);
    score.EndTurn();
    turn = score.GetLastTurn();
    marks = turn.Marks;
    ok(marks[20] === 3 && marks[19] === 3 && marks[18] === 3);

    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 3, 19: 3, 18: 3 }, 3);
    turn = score.GetLastTurn();
    marks = turn.Marks;
    ok(marks[20] === 3 && marks[19] === 3 && marks[18] === 3);

    score = new CricketScore([20, 19, 18, 17, 16, 15, 25]);
    score.ApplyTurn({ 20: 1, 19: 1, 18: 1 }, 1);
    score.ApplyTurn({ 20: 1, 19: 1, 18: 1 }, 1);
    score.ApplyTurn({ 20: 1, 19: 1, 18: 1 }, 1);
    turn = score.GetLastTurn();
    marks = turn.Marks;
    ok(marks[20] === 3 && marks[19] === 3 && marks[18] === 3);
    equal(turn.Darts, 3, 'Darts is 3');
});

}());
