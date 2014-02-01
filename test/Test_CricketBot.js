(function() {
'use strict';

module('CricketBot');

var sector = [];
for (var s = 1; s <= 20; s++) {
    sector[s] = Board.GetSectorIndex(s);
}

test('TakeThrows', function () {
    var player1 = new CricketBot(0, 0, "one");
    var player2 = new UserPlayer("two");
    var game = new CricketGame(player1, player2);
    var score1 = game.GetScore(player1);
    var score2 = game.GetScore(player2);
    score2.ApplyTurn({ 19: 9 }, 3);

    CricketBot.TakeThrows(player1, game, 1);
    equal(score1.GetPoints(), 0, 'Points is 0');
    
    CricketBot.TakeThrows(player1, game, 1);
    equal(score1.GetPoints(), 60, 'Points is 60');
    
    CricketBot.TakeThrows(player1, game, 1);
    equal(score1.GetPoints(), 120, 'Points is 120');
});

test('AcquireTarget', function () {
    var marks1, marks2, target, expected;

    marks1 = { };
    marks2 = { };
    expected = new Hit(sector[20], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { };
    marks2 = { 20: 3, 19: 3, 18: 3 };
    expected = new Hit(sector[20], RingType.Treble);
    acquire(marks1, marks2, expected);
    
    marks1 = { };
    marks2 = { 20: 3, 19: 3, 18: 3 };
    expected = new Hit(sector[17], RingType.Treble);
    acquire(marks1, marks2, expected, 2);

    marks1 = { 16: 3 };
    marks2 = { 20: 3, 19: 3, 18: 3 };
    expected = new Hit(sector[16], RingType.Treble);
    acquire(marks1, marks2, expected, 2);

    marks1 = { 16: 2 };
    marks2 = { 20: 3, 19: 3, 18: 3 };
    expected = new Hit(sector[17], RingType.Treble);
    acquire(marks1, marks2, expected, 2);

    marks1 = { 20: 3 };
    marks2 = { };
    expected = new Hit(sector[19], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 4 };
    marks2 = { };
    expected = new Hit(sector[19], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 3 };
    marks2 = { 18: 5 };
    expected = new Hit(sector[20], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 3 };
    marks2 = { 20: 4 };
    expected = new Hit(sector[19], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 3, 18: 3 };
    marks2 = { 20: 4 };
    expected = new Hit(sector[18], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 3, 18: 4 };
    marks2 = { 20: 4 };
    expected = new Hit(sector[18], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 2, 18: 5 };
    marks2 = { 20: 4 };
    expected = new Hit(sector[20], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3, 25: 2 };
    marks2 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3, 25: 2 };
    expected = new Hit(sector[0], RingType.DoubleBull);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3, 25: 2 };
    marks2 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3, 25: 2 };
    expected = new Hit(sector[0], RingType.DoubleBull);
    acquire(marks1, marks2, expected);
    
    marks1 = { 20: 4, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3, 25: 2 };
    marks2 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3, 25: 3 };
    expected = new Hit(sector[0], RingType.DoubleBull);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3, 25: 3 };
    marks2 = { 20: 4, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3, 25: 2 };
    expected = new Hit(sector[0], RingType.DoubleBull);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 0, 15: 0, 25: 0 };
    marks2 = { 20: 4, 19: 3, 18: 3, 17: 3, 16: 0, 15: 0, 25: 0 };
    expected = new Hit(sector[16], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 0, 15: 0, 25: 0 };
    marks2 = { 20: 4, 19: 3, 18: 3, 17: 3, 16: 2, 15: 0, 25: 0 };
    expected = new Hit(sector[16], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 0, 15: 0, 25: 0 };
    marks2 = { 20: 4, 19: 3, 18: 3, 17: 3, 16: 3, 15: 0, 25: 3 };
    expected = new Hit(sector[15], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 0, 15: 0, 25: 3 };
    marks2 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 3, 15: 0, 25: 3 };
    expected = new Hit(sector[16], RingType.Treble);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 4, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3, 25: 0 };
    marks2 = { 20: 3, 19: 3, 18: 3, 17: 3, 16: 3, 15: 3, 25: 3 };
    expected = new Hit(sector[0], RingType.DoubleBull);
    acquire(marks1, marks2, expected);

    marks1 = { 20: 4 };
    marks2 = { 19: 3, 18: 3, 17: 3, 16: 3 };
    expected = new Hit(sector[20], RingType.Treble);
    acquire(marks1, marks2, expected);
});

var acquire = function(m1, m2, e, d) {
    var p1 = new CricketBot(0, 0, "one");
    var p2 = new UserPlayer("two");
    var g = new CricketGame(p1, p2);
    g.GetScore(p1).ApplyTurn(m1, 3);
    g.GetScore(p2).ApplyTurn(m2, 3);
    var t = g.Player1.AcquireTarget(g, d || 3);
    var msg = 'Target: ' + t.toString() + ' Expected: ' + e.toString();
    ok(t.equals(e), msg);
};

test('Attempt Throw', function () {
    var player, target, hit;
    player = new CricketBot(0, 0, "one");
    target = new Hit(sector[20], RingType.Treble);
    hit = player.AttemptThrow(target);
    ok(hit.equals(target), 'Throw was attempted');
});

}());
