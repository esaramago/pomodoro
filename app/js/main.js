



const Pomodoro = {

    mobileSelect: null,

    init() {
        mobileSelect = new MobileSelect({
            trigger: '.js-mobile-select',
            position: [5, 0],
            wheels: [
                { data: minutesArr },
                { data: secondsArr }
            ],
            transitionEnd: function (indexArr, data) {
                console.log(data);
            }
        });
    },

    onStart() {


        setInterval(() => {

        }, 1000);
    }

}

Pomodoro.init();