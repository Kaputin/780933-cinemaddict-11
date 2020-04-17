import {getRandomArrayItem, getRandomIntegerNumber} from "./utils.js";
import {EMOJI, TEXT, AUTHOR, YEAR_START, YEAR_FINISH, MONTH_COUNT, DAYS_COUNT} from "./const.js";


const generateComment = () => {
  return {
    emoji: getRandomArrayItem(EMOJI),
    text: getRandomArrayItem(TEXT),
    author: getRandomArrayItem(AUTHOR),
    date: new Date(getRandomIntegerNumber(YEAR_START, YEAR_FINISH), getRandomIntegerNumber(1, MONTH_COUNT + 1), getRandomIntegerNumber(1, DAYS_COUNT + 1), getRandomIntegerNumber(0, 25), getRandomIntegerNumber(0, 60)),
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComments};
