const startStatusDate = {
    dayShift: new Date('2021-11-23T14:37:08.256Z'),
    nightShift: new Date('2021-11-24T14:37:08.256Z'),
    dayOffFirst: new Date('2021-11-25T14:37:08.256Z'),
    dayOffSecond: new Date('2021-11-26T14:37:08.256Z'),
}

const statuses = {
    dayShift: 'дневная смена (в день)',
    nightShift: 'ночная смена (в ночь)',
    dayOffFirst: 'выходной (с ночи)',
    dayOffSecond: 'выходной (отдых)'
}

const statusesCodes = [
    'dayShift',
    'nightShift',
    'dayOffFirst',
    'dayOffSecond'
]

const CURRENT_YEAR = new Date().getFullYear();

function getDateFromDay(dayOfYear){
    const date = new Date(CURRENT_YEAR, 0);
    return new Date(date.setDate(dayOfYear));
}

function getDaysInCurrentYear() {
    const start = new Date(CURRENT_YEAR, 0, 1);
    const end = new Date(CURRENT_YEAR, 11, 31);
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = end.getTime() - start.getTime();
    return Math.round(diffInTime / oneDay) + 1;
}

function getDateOfYear(date) {
    if (!date) {
        return 0;
    }
    return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24) + 1;
};

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    const dayRaw = date.getDate();
    const day = `${dayRaw}`.length < 2 ? `0${dayRaw}` : dayRaw;
    return `${year}-${month}-${day}`;
}

function getWorkDayStatus() {
    const countOfDaysInYear = getDaysInCurrentYear();
    const dayShiftNumber = getDateOfYear(startStatusDate.dayShift);

    console.log({ countOfDaysInYear, dayShiftNumber  })

    const schedule = {};
    for (let day = dayShiftNumber; day <= countOfDaysInYear; day++ ) {
        const prevValue = schedule[day - 1];
        const nextValue = prevValue ? statusesCodes[statusesCodes.indexOf(prevValue) + 1] : statusesCodes[0];
        const value = nextValue || statusesCodes[0];
        schedule[day] = value;
    }

    return Object.keys(schedule).reduce((result, key) => {
        const rawDate = getDateFromDay(Number(key));
        result.push({
            // date: formatDate(rawDate),
            date: rawDate,
            value: statuses[schedule[key]],
        })
        return result;
    }, []);
}

console.log(
    getWorkDayStatus()
    // JSON.stringify(, null, 4)
);
