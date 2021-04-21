const events = require('events');
const EventEmitter = require('events');

class CoolTimer extends EventEmitter {

	constructor(option) {
		super();
		this.timer = 0;
		this.jobtimer = 0;
		this.started = false;
		this.min_delay = option.min_delay || 500;
		this.max_delay = option.max_delay || 300000;
		this.job_timeout = option.job_timeout || 5000;
		this.job_mindelay = option.job_mindelay || 500;
		this.current_delay = this.min_delay;
	}

	onTimerFired() {
		let that = this;

		function initNextBackoff() {
			if (that.jobtimer) {
				clearTimeout(that.jobtimer);
				that.jobtimer = 0;
			}
			that.timer = setTimeout(()=> {
				that.onTimerFired();
			}, that.current_delay);
		}

		this.jobtimer = setTimeout(() => {
			that.current_delay = 2*that.current_delay;
			if (that.current_delay > that.max_delay) {
				that.current_delay = that.max_delay;
			}
			initNextBackoff();
		}, that.job_timeout);

		that.emit('fired',
		function() {
			// success with something done
			that.current_delay = that.min_delay;
			initNextBackoff();
		},
		function() {
			// success with nothing done
			that.current_delay = 2*that.current_delay;
			if (that.current_delay > that.max_delay) {
				that.current_delay = that.max_delay;
			}
			initNextBackoff();
		});
	}

	start() {
		this.stop();
		this.current_delay = this.min_delay;

		this.timer = setTimeout(()=> {
			this.onTimerFired();
		}, this.current_delay);

		this.started = true;
	}


	stop() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = 0;
		}

		this.started = false;
	}

}

module.exports = CoolTimer
