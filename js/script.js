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
    
    // Percent, day, sum, state
    let percent = 0.0001,
        daysCredit = 1,
        sum = 100,
        modalState = {};

    // Sliders sum     
    outputSum.innerHTML = sliderSum.value + ' грн';
    returnSum.innerHTML = sum;
    returnPercent.innerHTML = sum * percent * daysCredit;
    returnTotal.innerHTML = sum * percent * daysCredit + sum;

    function countTotal(percents, summ = 100, termins = 1) {
        let totalSumm = (summ * percents * termins) + summ;
        returnTotal.innerHTML = totalSumm;
        
        if (Number.isInteger(percents)) {
            returnPercent.innerHTML = totalSumm - summ;
        } else {
            returnPercent.innerHTML = (totalSumm - summ).toFixed(2);
        }
    }

    sliderSum.addEventListener('input', function() {
        sum = +this.value;
        outputSum.innerHTML = this.value + ' грн';
        returnSum.innerHTML = this.value;
        countTotal(percent, sum, daysCredit);
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

        if (day < 10) {
            day = `0${day}`;
        }
        if (month < 10) {
            month = `0${month}`;
        }
        if (weekDay == 'Сб' || weekDay == 'Нд') {
            returnDate.style.color = '#e55f58';
        } else {
            returnDate.style.color = '#fff';
        }

    returnDate.innerHTML = `${weekDay}, ${day}.${month}.${year}`;

    outputDays.innerHTML = sliderDays.value + ' дн.';
    sliderDays.addEventListener('input', function() {
        
        daysCredit = +this.value;
        outputDays.innerHTML = daysCredit + ' дн.';
        
        let userSelectedDays = new Date(millisec + (daysCredit * 86400000)),
            userYear = userSelectedDays.getFullYear(),
            userMonth = userSelectedDays.getMonth() + 1,
            userDay = userSelectedDays.getDate(),
            userWeekDay = weekDays[userSelectedDays.getDay()];

        if (userWeekDay == 'Сб' || userWeekDay == 'Нд') {
            returnDate.style.color = '#e55f58';
        } else {
            returnDate.style.color = '#fff';
        }

        countTotal(percent, sum, daysCredit);

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
    function animateBtn(btn) {
        btn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#fff';
            this.style.color = "#5BA0A6";
        });
    
        btn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#6bcad2';
            this.style.color = "#fff";
        });
    }
    animateBtn(confirmBtn);
    
    // modal
    const modal = document.querySelector('.popup-calc'),
          closeBtn = document.querySelector('.popup-close'),
          orderBtn = modal.querySelector('.button-order');
    
    function openModal(){
        modal.classList.add('show');
        modal.classList.remove('hide');
    }

    function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');
    }

    confirmBtn.addEventListener('click', () => {
        openModal();
    });

    closeBtn.addEventListener('click', () => {
        closeModal();
    });

    animateBtn(orderBtn);

    // state
    const changeModalState = (state) => {
        function bindActionToElems(event, elem, prop) {
            elem.addEventListener(event, () => {
                state[prop] = elem.value;
                // console.log(state);
            });
        }

        bindActionToElems('input', sliderSum, 'sum');
        bindActionToElems('input', sliderDays, 'days');
    };
    changeModalState(modalState);

    // form
    const form = document.querySelector('form');

    const message = {
        loading: 'img/spinner.svg',
        success: 'Дякуємо! Ми зателефонуємо вам найближчим часом.',
        failure: 'Щось пішло не так...'
    };

    bindPostData(form, modalState);

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                    'Content-type': 'application/json'
                },
            body: data
        });
        return await res.json();
    };

    function bindPostData(form, state) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.classList.add('spinner-img');
            // form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            if (form.getAttribute('data-calc') === 'end') {
                for (let key in state) {
                    formData.append(key, state[key]);
                }
            }

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.popup-dialog');

        prevModalDialog.classList.add('hide');
        prevModalDialog.classList.remove('show');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('popup-dialog');
        thanksModal.innerHTML=`
            <div class=popup-content>
            <button class=popup-close>&times;</button>
            <h4>${message}</h4>
            </div>
        `;

        document.querySelector('.popup-calc').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }
});