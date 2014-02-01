(function() {
'use strict';

module('X01Bot');

test('Constructor', function () {
    var bot = new X01Bot(1, 2, 'one', 10);
    equal(bot.Mean, 1, 'Mean initializes');
    equal(bot.Stdev, 2, 'Stdev initializes');
    equal(bot.Name, 'one', 'Name initializes');
    equal(bot.MaxThrows, 10, 'MaxThrows initializes');
});

test('GetMaxThrows', function () {
    var bot = new X01Bot(0, 0, 'one', 30);
    equal(bot.GetMaxThrows(501), 30, '501 max throws is 30');
    equal(bot.GetMaxThrows(301), 18, '301 max throws is 18');
    equal(bot.GetMaxThrows(101), 6, '101 max throws is 6');
    equal(bot.GetMaxThrows(1001), 60, '1001 max throws is 60');
});

test('AquireTarget', function () {
    var player1, player2, game, target;
    player1 = new X01Bot(20, 24);
    player2 = new UserPlayer('two');
    
    game = new X01Game(501, false, true, player1, player2);
    target = player1.AcquireTarget(game);
    ok(target.equals(new Hit(0, RingType.Treble)), '501 SIDO, Target is T20');
    
    game = new X01Game(301, true, true, player1, player2);
    target = player1.AcquireTarget(game);
    equal(target.Ring, RingType.Double, '301 DIDO. Target is Double');

    game = new X01Game(40, false, true, player1, player2);
    target = player1.AcquireTarget(game);
    ok(target.equals(new Hit(0, RingType.Double)), '40 SIDO. Target is D20');
    
    game = new X01Game(32, false, true, player1, player2);
    target = player1.AcquireTarget(game);
    ok(target.equals(new Hit(7, RingType.Double)), '32 SIDO. Target is D16');

    game = new X01Game(3, false, true, player1, player2);
    target = player1.AcquireTarget(game);
    ok(target.equals(new Hit(19, RingType.FatSingle)), '3 SIDO. Target is S1');

    game = new X01Game(99, false, true, player1, player2);
    target = player1.AcquireTarget(game);
    ok(target.equals(new Hit(9, RingType.Treble)), '99 SIDO. Target is T19');
});

test('ApplyHit', function () {
 
    var game, answer, points, player1, player2;
    player1 = new X01Bot(),
    player2 = new X01Bot(),

    // 501 SIDO, Triple 20, Triple 20, Single 10
    game = new X01Game(501, false, true, player1, player2);
    answer = X01Bot.ApplyHit(player1, game, new Hit(0, RingType.Treble));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer && points === 441, 'Hit T20');
    
    answer = X01Bot.ApplyHit(player1, game, new Hit(0, RingType.Treble));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer && points === 381, 'Hit T20');
    
    answer = X01Bot.ApplyHit(player1, game, new Hit(14, RingType.FatSingle));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer && points === 371, 'Hit S10');

    // 301 DIDO, Triple 20, Double 20, Double Bull
    game = new X01Game(301, true, true, player1, player2);
    answer = X01Bot.ApplyHit(player1, game, new Hit(0, RingType.Treble));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === true && points === 301, 'Points is 301');
    ok(game.GetScore(player1).GetIsDoubleIn() === false, 'Not double in');
    
    answer = X01Bot.ApplyHit(player1, game, new Hit(0, RingType.Double));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === true && points === 261, 'Points is 261');
    ok(game.GetScore(player1).GetIsDoubleIn() === true, 'Is double in');
   
    answer = X01Bot.ApplyHit(player1, game, new Hit(0, RingType.DoubleBull));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === true && points === 211, 'Points is 211');
    ok(game.GetScore(player1).GetIsDoubleIn() === true, 'Is double in');

    // 40 DIDO, Double 20
    game = new X01Game(40, true, true, player1, player2);
    answer = X01Bot.ApplyHit(player1, game, new Hit(0, RingType.Double));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === true && points === 0, 'Points is 0');
    ok(game.GetScore(player1).GetIsDoubleIn() === true, 'Is double in');

    // 41 DIDO, Double 20
    game = new X01Game(41, true, true, player1, player2);
    answer = X01Bot.ApplyHit(player1, game, new Hit(0, RingType.Double));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === false && points === 41, 'Points is 41');
    ok(game.GetScore(player1).GetIsDoubleIn() === false, 'Not double in');

    // 50 DIDO, Double Bull
    game = new X01Game(50, true, true, player1, player2);
    answer = X01Bot.ApplyHit(player1, game, new Hit(0, RingType.DoubleBull));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === true && points === 0, 'Points is 0');
    ok(game.GetScore(player1).GetIsDoubleIn() === true, 'Is double in');

    // 50 SIDO, Triple 17
    game = new X01Game(50, false, true, player1, player2);
    answer = X01Bot.ApplyHit(player1, game, new Hit(11, RingType.Treble));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === false && points === 50, 'Points is 50');

    // 51 SIDO, Triple 17
    game = new X01Game(51, false, true, player1, player2);
    answer = X01Bot.ApplyHit(player1, game, new Hit(11, RingType.Treble));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === false && points === 51, 'Points is 51');

    // 51 SIDO, Double Bull
    game = new X01Game(51, false, true, player1, player2);
    answer = X01Bot.ApplyHit(player1, game, new Hit(0, RingType.DoubleBull));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === false && points === 51, 'Points is 51');

    // 51, Triple 17
    game = new X01Game(51, false, false, player1, player2);
    answer = X01Bot.ApplyHit(player1, game, new Hit(11, RingType.Treble));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === true && points === 0, 'Points is 0');

    // 29 DISO, Double 14
    game = new X01Game(29, true, false, player1, player2);
    answer = X01Bot.ApplyHit(player1, game, new Hit(4, RingType.Double));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === true && points === 1, 'Points is 1');
    ok(game.GetScore(player1).GetIsDoubleIn() === true, 'Is double in');

    // 101 DIDO, Double 20, Triple 20, Cancel Turn
    game = new X01Game(101, true, true, player1, player2);
    answer = X01Bot.ApplyHit(player1, game, new Hit(0, RingType.Double));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === true && points === 61, 'Points is 61');
    ok(game.GetScore(player1).GetIsDoubleIn() === true, 'Is double in');
    
    answer = X01Bot.ApplyHit(player1, game, new Hit(0, RingType.Treble));
    points = game.GetScore(player1).GetPointsLeft();
    ok(answer === false && points === 61, 'Points is 61');
    ok(game.GetScore(player1).GetIsDoubleIn() === true, 'Is double in');

    game.CancelTurn(player1);
    ok(game.GetScore(player1).GetPointsLeft() === 101, 'Points is 101');
    ok(game.GetScore(player1).GetIsDoubleIn() === false, 'Not double in');
});


}());
