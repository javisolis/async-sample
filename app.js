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
    }, () => { throw new Error('exception!'); });
}

function generateRandomNumber() {
    return new Promise(function (resolve, reject) {
        var randomNumberBetween0and10 = Math.floor(Math.random() * 10);
        return resolve(randomNumberBetween0and10);
    });
}

async function asyncCall(caller, next) {
    console.log(caller + ' => calling');
    generateRandomNumber().then(function (randomNumber) {
        resolveAfterSeconds(randomNumber).then(function (result) {
            console.log(caller + ' => ' + result + ' after ' + randomNumber + ' seconds');
            next(null, 'task finished');
        });
    }).catch(error => next(error.message, null));
}

let retryOptions = { times: 10, interval: 200 };
const maxItemsInParallel = 9;
var startDate = new Date();

let parallelTasks = [];
for (let i = 0; i < maxItemsInParallel; i++) {
    parallelTasks.push(function (callback) {
        asyncCall(i, function (err, result) {
            callback(err, result);
        })
    });
}
async.parallel(parallelTasks, function (err, result) {
    calcElapsedMilliseconds(startDate, function (elapsedTime) {
        console.log('Elapsed ' + elapsedTime + ' milliseconds');
    });
});


