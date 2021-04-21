const CoolTimer = require('../index.js');

let option = {
	min_delay : 500,
	max_delay : 10000,
	job_mindelay : 500,
	job_timeout : 5000
}

let cooltimerA = new CoolTimer(option);
let cooltimerB = new CoolTimer(option);
let cooltimerC = new CoolTimer(option);
let cooltimerD = new CoolTimer(option);

cooltimerA.on('fired', (jobDone, noJobFound) => {
	console.log('A -- some job done');
	jobDone();
});

cooltimerB.on('fired', (jobDone, noJobFound) => {
	console.log('B -- no job found');
	noJobFound();
});

let k = 0;
cooltimerC.on('fired', (jobDone, noJobFound) => {
	k = (k+1)%9;
	if (k == 5 || k == 6 || k == 7 || k == 8) {
		console.log('C -- found job');
		jobDone();
	}
	else {
		console.log('C -- no job found');
	noJobFound();
	}

});

cooltimerD.on('fired', (jobDone, noJobFound) => {
	console.log('D -- leave job timeout');
});


cooltimerA.start();
//cooltimerB.start();
//cooltimerC.start();
//cooltimerD.start();
