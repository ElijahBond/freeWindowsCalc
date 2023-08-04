'use strict'

// !!!!!!!!!!!!!!! входные данные !!!!!!!!!!!!!!!

let workingTime = {
    start: '9:00',
    end: '21:00'
};

let busy = [
    {
        start: '10:30',
        end: '10:50'
    },
    {
        start: '18:40',
        end: '18:50'
    },
    {
        start: '14:40',
        end: '15:50'
    },
    {
        start: '16:40',
        end: '17:20'
    },
    {
        start: '20:05',
        end: '20:20'
    },
];



// функция вычисления свободных окон
const freeWindowsFunc = (workingTime, busy) => { 
    const workingTimeInMin = convertToMin(workingTime);  // переводим время в минуты
    const workingTimeInMinutesAndIntervals = devideOnIntervals(workingTimeInMin);  // создаем объект с интервалами по 30 минут в минутах
    const busyTimeInMinutes = convertBusyToMinutes(busy); // переводим занятое время в минуты

    let busyWindowsArr = [];

    for (let workingInterval of workingTimeInMinutesAndIntervals) {   // находим все занятые интервалы
        for (let busyInterval of busyTimeInMinutes) {
            let x = workingInterval.start,
                y = workingInterval.end,
                a = busyInterval.start,
                b = busyInterval.end;

            if ( y > a && x < b  ) {   
                busyWindowsArr.push({
                    start: x,
                    end: y
                })
            }
        }
    }

    const s = new Set(busyWindowsArr.map(el => JSON.stringify(el)))
    const freeWindowsArr = workingTimeInMinutesAndIntervals.filter(el => !s.has(JSON.stringify(el)))

    return convertToLocalTime(freeWindowsArr);
}



// !!!!!!!!!!!!!!! вспомогательные функции !!!!!!!!!!!!!!!



// конвертируем объект с локальным временем в объект в минутах 
function convertToMin ({start, end}) {
    let startArr = start.split(':');
    let endArr = end.split(':');
    return {
        start: startArr[0] * 60 + +startArr[1],
        end: endArr[0] * 60 + +endArr[1],
    }
}



// разбиваем рабочее время в минутах по интервалам в 30 минут
function devideOnIntervals (timeInMin) {
    const { start, end } = timeInMin;
    let workingDayWithIntervals = [];

    let startDay = start;
    let endCycle = (end - start) / 30 - 1;

    for (let i = 0; i <= endCycle; i++) {
        workingDayWithIntervals.push({
            start: startDay,
            end: startDay + 30
        });
        startDay += 30;
    }

    return workingDayWithIntervals;
}



// конвертируем объект со временем в минутах обратно в объект с локальным временем
function convertToLocalTime (arrayWithObjectInside) {
    let res = [];

    for (let currentInterval of arrayWithObjectInside) {
        const { start, end } = currentInterval;

        res.push({
            start: convertMinToLocalTime(start),
            end: convertMinToLocalTime(end),
        })
    }
    return res;
}



// функция вывода времени в нужном формате
function convertMinToLocalTime (minutes) {
    let hours = Math.floor(minutes / 60);
    let min = minutes - hours * 60;

    return `${hours}:${min < 10 ? `0${min}` : min}`
}



// функция перевода массива с занятым временем в минуты
function convertBusyToMinutes (arrayWithObjectInside) {
    let res = [];

    for (let currentInterval of arrayWithObjectInside) {
        res.push(convertToMin(currentInterval))
    }
    return res;
}




// !!!!!!!!!!!!!!! выводим результат (свободные окна врача) !!!!!!!!!!!!!!!
console.log(freeWindowsFunc(workingTime, busy))