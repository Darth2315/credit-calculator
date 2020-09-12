window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const sliderSum = document.querySelector("#myRange"),
          outputSum = document.querySelector("#sum"),
          sliderDays = document.querySelector('#myTime'),
          outputDays = document.querySelector('#days'),
          confirmBtn = document.querySelector('.confirm-credit-btn'),
          returnDate = document.querySelector('.return-data'),
          returnSum = document.querySelector('.return-sum'),
          returnPercent = document.querySelector('.return-percent'),
          returnTotal = document.querySelector('.return-total');
    
    // Percent
    let percent = 0.0001,
        days = 1;

    // Sliders sum     
    outputSum.innerHTML = sliderSum.value + ' грн';
    returnTotal.innerHTML = 100 * percent * days + 100;
    returnSum.innerHTML = 100;
    returnPercent.innerHTML = 100 * percent * days;

    sliderSum.addEventListener('input', function() {
        outputSum.innerHTML = this.value + ' грн';

        returnSum.innerHTML = this.value;

    const totalReturn = (this.value * percent * outputDays) + returnSum;
    console.log(returnSum.value);
    });


    // Sliders date
    const weekDays = ['Нд','Пн','Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const today = new Date(),
          tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

    let year = tomorrow.getFullYear(),
          month = tomorrow.getMonth() + 1,
          day = tomorrow.getDate(),
          weekDay = weekDays[tomorrow.getDay()],
          millisec = today.getTime();

    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }

    returnDate.innerHTML = `${weekDay}, ${day}.${month}.${year}`;

    outputDays.innerHTML = sliderDays.value + ' дн.';
    sliderDays.addEventListener('input', function() {
        
        let daysCredit = +this.value;
        outputDays.innerHTML = daysCredit + ' дн.';
        
        let userSelectedDays = new Date(millisec + (daysCredit * 86400000)),
            userYear = userSelectedDays.getFullYear(),
            userMonth = userSelectedDays.getMonth() + 1,
            userDay = userSelectedDays.getDate(),
            userWeekDay = weekDays[userSelectedDays.getDay()];

            console.log(userWeekDay);

        if (userMonth < 10) {
            userMonth = `0${userMonth}`;
        }

        if (userDay < 10) {
            userDay = `0${userDay}`;
        }

        if (daysCredit > 1) {
            returnDate.textContent = `${userWeekDay}, ${userDay}.${userMonth}.${userYear}`;
        } else {
            returnDate.textContent = `${userWeekDay}, ${userDay}.${userMonth}.${userYear}`;
        }
    });

    // Btn
    confirmBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#fff';
        this.style.color = "#5BA0A6";
    });

    confirmBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#6bcad2';
        this.style.color = "#fff";
    });
});