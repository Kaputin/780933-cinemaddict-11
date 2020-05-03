import {getRandomArrayItem, getRandomIntegerNumber, getDateWithZero} from "./utils.js";
import {EMOJI, TEXT, AUTHOR, YEAR_START, YEAR_FINISH, MONTH_COUNT, DAYS_COUNT} from "./const.js";


const generateComment = () => {
  const HOURS_MAX = 23;
  const MINUTES_MAX = 59;

  let date = new Date(
      getRandomIntegerNumber(YEAR_START, YEAR_FINISH),
      getRandomIntegerNumber(0, MONTH_COUNT),
      getRandomIntegerNumber(1, DAYS_COUNT + 1),
      getRandomIntegerNumber(0, HOURS_MAX + 1),
      getRandomIntegerNumber(0, MINUTES_MAX + 1)
  );

  let year = date.getFullYear();
  let days = date.getDate();
  let month = date.getMonth() + 1; // +1 т.к. возвращает от 0 до 11
  let hours = date.getHours();
  let minutes = date.getMinutes();

  days = getDateWithZero(days);
  month = getDateWithZero(month);
  hours = getDateWithZero(hours);
  minutes = getDateWithZero(minutes);

  let dates = {
    DAYS: days,
    MONTHS: month,
    HOURS: hours,
    MINUTES: minutes,
    YEARS: year
  };

  return {
    id: getRandomIntegerNumber(0, 10),
    emoji: getRandomArrayItem(EMOJI),
    text: getRandomArrayItem(TEXT),
    author: getRandomArrayItem(AUTHOR),
    date: dates,
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComments};
