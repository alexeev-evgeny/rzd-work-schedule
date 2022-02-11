const add = require('date-fns/add');
const parse = require('date-fns/parse');
const format = require('date-fns/format');
const isAfter = require('date-fns/isAfter');
const differenceInDays = require('date-fns/differenceInDays');

const START_STATUS_DATES = {
    dayShift: new Date('2021-12-29T14:37:08.256Z'),
    nightShift: new Date('2021-12-30T14:37:08.256Z'),
    dayOffFirst: new Date('2021-12-31T14:37:08.256Z'),
    dayOffSecond: new Date('2022-01-01T14:37:08.256Z'),
}
const STATUSES = {
    dayShift: 'дневная смена (в день)',
    nightShift: 'ночная смена (в ночь)',
    dayOffFirst: 'выходной (с ночи)',
    dayOffSecond: 'выходной (отдых)'
}
const STATUSES_CODES = Object.keys(STATUSES);
const DATE_MASK = 'yyyy-MM-dd';

function getWorkDayStatus() {
    const [platform, path, dateStart = '', dateEnd = ''] = process.argv || [];
    if (!dateStart || !dateEnd) {
        throw new Error('Не переданы dateStart или dateEnd');
    }

    const start = START_STATUS_DATES.dayShift;
    const end = parse(dateEnd, DATE_MASK, new Date());
    const daysCount = differenceInDays(end, start);

    const shedule = [];
    for (let day = 0; day <= daysCount; day++) {
        const date = add(new Date(start), { days: day });
        const prevValue = shedule[day - 1]?.value || null;
        const prevValueIndex = STATUSES_CODES.indexOf(prevValue);
        const hasNextValue = prevValueIndex < STATUSES_CODES.length - 1;
        const value = hasNextValue ? STATUSES_CODES[prevValueIndex + 1] : STATUSES_CODES[0];
        shedule.push({ date, value });
    }

    const dateStartParsed = parse(dateStart, DATE_MASK, new Date());
    return shedule
        .filter(({ date }) => {
            return isAfter(date, dateStartParsed);
        })
        .map(({ date, value }) => ({
            date: format(date, DATE_MASK),
            value: STATUSES[value]
        }));
}

console.log(getWorkDayStatus())
