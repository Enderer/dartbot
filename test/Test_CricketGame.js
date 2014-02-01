(function() {
'use strict';

module('CricketGame' );

test('Constructor', function () {
    var player1 = new UserPlayer('one'),
        player2 = new UserPlayer('two'),
        game = new CricketGame(player1, player2);
    equal(game.Player1.Name, 'one', 'Player 1 initialized');
    equal(game.Player2.Name, 'two', 'Player 2 initialized');
    equal(game.PlayerToMove, 1, 'Player to move is 1');
    equal(game.IsWon, false, 'Game is not won');
});

test('Play Game', function () {
    var player1 = new UserPlayer('one'),
        player2 = new UserPlayer('two'),
        game = new CricketGame(player1, player2);

    game.ApplyTurn(player1, { 20: 3, 19: 4 }, 3);
    game.EndTurn(player1);
    game.ApplyTurn(player2, { 18: 3, 17: 4 }, 3);
    game.EndTurn(player2);
    game.ApplyTurn(player1, { 17: 3, 18: 4 }, 3);
    game.EndTurn(player1);
    game.ApplyTurn(player2, { 16: 3, 15: 3 }, 3);
    game.EndTurn(player2);
    game.ApplyTurn(player1, { 16: 3, 15: 3 }, 3);
    game.EndTurn(player1);
    game.ApplyTurn(player2, { 25: 3 }, 3);
    game.EndTurn(player2);
    game.ApplyTurn(player1, { 25: 3 }, 3);
    game.EndTurn(player1);

    var isWon = game.IsWon,
        winner = game.Winner,
        points1 = game.GetScore(player1).GetPoints(),
        points2 = game.GetScore(player2).GetPoints();

    ok(game.IsWon, 'Game is won');
    equal(game.Winner, 1, 'Player 1 is winner');
    equal(game.GetScore(player1).GetPoints(), 19, 'Player 1 has 19 points');
    equal(game.GetScore(player2).GetPoints(), 17, 'Player 2 has 17 points');
});

test('ApplyMark', function () {
    var player1 = new UserPlayer('one'),
        player2 = new UserPlayer('two'),
        game = new CricketGame(player1, player2);
    game.ApplyMark(player1, 20, 4, 3);
    equal(game.GetScore(player1).GetPoints(), 20, 'Marks applied');
});

test('CancelTurn', function () {
    var player1 = new UserPlayer('one'),
        player2 = new UserPlayer('two'),
        game = new CricketGame(player1, player2);
    
    game.ApplyTurn(player1, { 20: 3, 19: 3, 18: 3 }, 3);
    game.EndTurn(player1);
    game.ApplyTurn(player2, { 20: 3, 19: 3, 18: 3 }, 3);
    game.EndTurn(player2);
    game.ApplyTurn(player1, { 17: 3, 16: 3, 15: 3 }, 3);
    game.CancelTurn(player1);
    game.ApplyTurn(player1, { 17: 3, 16: 3, 15: 3 }, 3);
    game.EndTurn(player1);
    game.ApplyTurn(player2, { 17: 3, 16: 3, 15: 3 }, 3);
    game.EndTurn(player2);
    game.ApplyTurn(player1, { 25: 3 }, 3);
    game.EndTurn(player1);

    var isWon = game.IsWon,
        winner = game.Winner,
        points1 = game.GetScore(player1).GetPoints(),
        points2 = game.GetScore(player2).GetPoints();

    ok(game.IsWon, 'Game is won');
    equal(game.Winner, 1, 'Player 1 is winner');
    equal(game.GetScore(player1).GetPoints(), 0, 'Player 1 has 0 points');
    equal(game.GetScore(player2).GetPoints(), 0, 'Player 2 has 0 points');
    equal(game.GetScore(player1).NumberOfDarts(), 9, '9 darts thrown');
});

test('CancelWin', function () {

    var player1 = new UserPlayer('one'),
        player2 = new UserPlayer('two'),
        game = new CricketGame(player1, player2);

    game.ApplyTurn(player1, { 20: 3, 19: 3, 18: 3 }, 3);
    game.EndTurn(player1);
    game.ApplyTurn(player2, { 20: 3, 19: 3, 18: 3 }, 3);
    game.EndTurn(player2);
    game.ApplyTurn(player1, { 17: 3, 16: 3, 15: 3 }, 3);
    game.EndTurn(player1);
    game.ApplyTurn(player2, { 17: 3, 16: 3, 15: 3 }, 3);
    game.EndTurn(player2);
    game.ApplyTurn(player1, { 25: 4 }, 3);
    game.EndTurn(player1);
    game.CancelTurn(player1);
    game.ApplyTurn(player2, { 25: 4 }, 3);
    game.EndTurn(player2);

    ok(game.IsWon, 'Game is won');
    equal(game.Winner, 2, 'Player 2 is winner');
    equal(game.GetScore(player1).GetPoints(), 0, 'Player 1 has 0 points');
    equal(game.GetScore(player2).GetPoints(), 25, 'Player 2 has 25 points');
    equal(game.GetScore(player1).NumberOfDarts(), 6, '6 darts thrown');
});

test('DartsLastTurn', function () {
    var score,
        player1 = new UserPlayer('one'),
        player2 = new UserPlayer('two'),
        game = new CricketGame(player1, player2);
    
    game.ApplyTurn(player1, { 20: 3, 19: 3, 18: 3 }, 3);
    game.EndTurn(player1);
    game.SetDartsLastTurn(player1, 2);
    score = game.GetScore(player1);
    equal(score.NumberOfDarts(), 2, 'Darts is 2');
    equal(score.MarksPerRound(), 13.5, 'Marks per round is 13.5');

    game = new CricketGame(player1, player2);
    game.ApplyTurn(player1, { 20: 3, 19: 3, 18: 3 }, 3);
    game.SetDartsLastTurn(player1, 2);
    score = game.GetScore(player1);
    equal(score.NumberOfDarts(), 2, 'Darts is 2');
    equal(score.MarksPerRound(), 13.5, 'Marks per round is 13.5');
});

test('GetPlayerNum', function () {
    var player1 = new UserPlayer('one'),
        player2 = new UserPlayer('two'),
        player3 = new UserPlayer('three');
        
    var game = new CricketGame(player1, player2);
    equal(game.GetPlayerNum(player1), 1, 'Player num is 1');
    equal(game.GetPlayerNum(player2), 2, 'Player num is 2');
    throws(function(){ game.GetPlayerNum(player3); }, 'Player 3 is invalid');
});

test('GetOpponent', function () {
    var player1 = new UserPlayer('one'),
        player2 = new UserPlayer('two'),
        player3 = new UserPlayer('three');

    var game = new CricketGame(player1, player2);
    equal(game.GetOpponent(player1).Name, 'two', 'Opponent is player 2');
    equal(game.GetOpponent(player2).Name, 'one', 'Opponent is player 1');
    throws(function(){ game.GetOpponent(player3); }, 'Player 3 is invalid');
});

test('GetScore', function () {
    var player1 = new UserPlayer('one'),
        player2 = new UserPlayer('two'),
        player3 = new UserPlayer('three');
        
    var game = new CricketGame(player1, player2);
    game.ApplyTurn(player1, { 20: 4 }, 3);
    game.EndTurn(player1);
    game.ApplyTurn(player2, { 19: 4 }, 3);
    game.EndTurn(player2);
    equal(game.GetScore(player1).GetPoints(), 20, 'Player 1 has 20 points');
    equal(game.GetScore(player2).GetPoints(), 19, 'Player 2 has 19 points');
    throws(function(){ game.GetScore(player3); }, 'Player 3 is invalid');
});

test('Change player mid game', function () {
    var player1 = new UserPlayer('one'),
        player2 = new UserPlayer('two'),
        player3 = new UserPlayer('three');
        
    var game = new CricketGame(player1, player2);
    game.ApplyTurn(player1, { 20: 2 }, 3);
    game.EndTurn(player1);
    game.ApplyTurn(player2, { 19: 4 }, 3);
    game.EndTurn(player2);
    game.Player2 = player3;
    game.ApplyTurn(player1, { 19: 3 }, 3);
    game.EndTurn(player1);
    game.ApplyTurn(player3, { 18: 4 }, 3);
    game.EndTurn(player3);

    equal(game.GetPlayerNum(player3), 2, 'Player 2 switched');
    throws(function(){ game.GetPlayerNum(player2); }, 'Old player is invalid');
    equal(game.GetOpponent(player1).Name, 'three', 'Opponent is player 3');
    equal(game.GetOpponent(player3).Name, 'one', 'Opponent is player 1');
    throws(function(){ game.GetOpponent(player2); }, 'Old player is invalid');
});

}());
