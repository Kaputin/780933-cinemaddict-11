import {getRandomArrayItem, getRandomIntegerNumber} from "./utils.js";
import {EMOJI, TEXT, AUTHOR, Year, MONTH_COUNT, DAYS_COUNT} from "./const.js";


const generateComment = () => {
  const HOURS_MAX = 23;
  const MINUTES_MAX = 59;

  return {
    id: String(new Date() + Math.random()),
    emoji: getRandomArrayItem(EMOJI),
    text: getRandomArrayItem(TEXT),
    author: getRandomArrayItem(AUTHOR),
    date: new Date(getRandomIntegerNumber(Year.START, Year.FINISH), getRandomIntegerNumber(0, MONTH_COUNT + 1), getRandomIntegerNumber(1, DAYS_COUNT + 1), getRandomIntegerNumber(0, HOURS_MAX + 1), getRandomIntegerNumber(0, MINUTES_MAX + 1)),
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComments};
