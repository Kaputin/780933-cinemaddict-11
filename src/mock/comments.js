import {getRandomArrayItem} from "./utils.js";
import {EMOJI, TEXT, AUTHOR} from "./const.js";


const generateComment = () => {
  return {
    emoji: getRandomArrayItem(EMOJI),
    text: getRandomArrayItem(TEXT),
    author: getRandomArrayItem(AUTHOR),
    date: `2019/12/31 23:59`,
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComments};
