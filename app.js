const async = require('async');

function calcElapsedMilliseconds(startTime, next) {
    var endTime = new Date();
    var timeDiff = endTime - startTime; //in ms
    return next(timeDiff);
}

function resolveAfterSeconds(seconds) {
    return new Promise(p => {
        setTimeout(() => {
            p('resolved');
        }, seconds * 1000);
    });
}

function generateRandomNumber() {
    return new Promise(p => {
        var randomNumberBetween0and10 = Math.floor(Math.random() * 10);
        return p(randomNumberBetween0and10);
    });
}

async function asyncCall(caller, next) {
    console.log(caller + ' => calling');
    var randomNumber = await generateRandomNumber();
    var result = await resolveAfterSeconds(randomNumber);
    console.log(caller + ' => ' + result + ' after ' + randomNumber + ' seconds');
    return next('task finished');
}

var startDate = new Date();
async.parallel([
    function (callback) {
        asyncCall(1, function () {
            callback();
        })
    },
    function (callback) {
        asyncCall(2, function () {
            callback();
        })
    },
    function (callback) {
        asyncCall(3, function () {
            callback();
        })
    },
    function (callback) {
        asyncCall(4, function () {
            callback();
        })
    },
    function (callback) {
        asyncCall(5, function () {
            callback();
        })
    },
    function (callback) {
        asyncCall(6, function () {
            callback();
        })
    },
], function (error, results) {
    calcElapsedMilliseconds(startDate, function(elapsedTime) {
        console.log('Elapsed ' + elapsedTime + ' milliseconds');
    });
});

