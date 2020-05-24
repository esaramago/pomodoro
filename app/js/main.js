const Pomodoro = {

    mobileSelect: null,
    noSleep: new NoSleep(), // https://davidwalsh.name/wake-lock-shim
    interval: null,

    init() {
        this.renderMobileSelect();
        this.setEvents();
        this.setNoSleep();
    },

    getStartMinute() {
        return localStorage.getItem('startMinute') || 5;
    },

    getStartSecond() {
        return localStorage.getItem('startSecond') || 0;
    },

    renderMobileSelect() {

        // https://github.com/onlyhom/mobileSelect.js
        this.mobileSelect = new MobileSelect({
            trigger: '.js-mobile-select',
            position: [this.getStartMinute(), this.getStartSecond()],
            wheels: [
                { data: minutesArr },
                { data: secondsArr }
            ],
            transitionEnd(indexArr, data) {
                localStorage.setItem('startMinute', indexArr[0]);
                localStorage.setItem('startSecond', indexArr[1]);
            }
        });
    },

    setEvents() {
        var _this = this;
        document.addEventListener('click', (event) => {

            if (event.target.matches('.js-start')) {
                _this.onStart();
            }
            else if (event.target.matches('.js-reset')) {
                _this.onReset();
            }

        })

    },

    onStart() {

        var _this = this;

        this.onReset();
        this.updateButtons('start');

        this.interval = setInterval(() => {
            _this.updateTime();
        }, 1000);


        this.noSleep.enable();
    },

    onReset() {
        clearInterval(this.interval);

        // set initial time
        this.mobileSelect.locatePosition(0, this.getStartMinute());
        this.mobileSelect.locatePosition(1, this.getStartSecond());~

        this.updateButtons('reset');

        this.noSleep.disable();
    },

    updateTime() {
        var value = this.mobileSelect.getValue(); // get current time
        var minute = value[0];
        var second = value[1];
        
        var secondIndex = secondsArr.findIndex(i => i === second); // get current second index in array
        var newSecondIndex = null;

        if (secondIndex > 0) { // check if second is not 0
            newSecondIndex = secondIndex - 1; // set one sec less
        }
        else { // second is 0
            
            var minuteIndex = secondsArr.findIndex(i => i === minute); // get current minute index in array

            if (minuteIndex > 0) { // check if minute is not 0
                this.mobileSelect.locatePosition(0, minuteIndex - 1); // update minute
                newSecondIndex = secondsArr.length - 1; // set last index (59sec)
            }
            else { // End!!

                var audio = new Audio('audio/end.mp3');
                audio.play();

                this.onReset(); // reset timer

                return; // stop function
            }

        }

        this.mobileSelect.locatePosition(1, newSecondIndex); // update second

    },

    updateButtons(action) {

        var hide = action;
        var show = '';

        if (action === 'start') {
            show = 'reset';
        }
        else if (action === 'reset') {
            show = 'start';
        }

        document.querySelector('.js-' + hide).setAttribute('hidden', ''); // hide button
        document.querySelector('.js-' + show).removeAttribute('hidden'); // show button
    },

    setNoSleep() {
        // https://davidwalsh.name/wake-lock-shim
        var noSleep = new NoSleep();

        function enableNoSleep() {
          document.removeEventListener('touchstart', enableNoSleep, false);
        }

        // Enable wake lock.
        // (must be wrapped in a user input event handler e.g. a mouse or touch handler)
        document.addEventListener('touchstart', enableNoSleep, false);
    }

}

Pomodoro.init();