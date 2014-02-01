var Random = (function() {

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
