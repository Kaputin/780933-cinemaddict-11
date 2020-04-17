import {getRandomArrayItem, getRandomIntegerNumber, getRandomNumberTwoDecimalPlaces, getRandomArray} from "./utils.js";
import {TITLES, DIRECTORS, WRITERS, ACTORS, POSTERS, DESCRIPTIONS, GENRES, COUNTRYS, AGE_LIMITS, YEAR_START, YEAR_FINISH, MONTH_COUNT, DAYS_COUNT} from "./const.js";

const DESCRIPTION_COUNT = 5;
const COMMENTS_COUNT = 5;
const HOURS_MAX = 3;
const MINUTES_MAX = 59;


let hoursDuration = getRandomIntegerNumber(0, HOURS_MAX + 1);

let minutesDuration = getRandomIntegerNumber(0, MINUTES_MAX + 1);
if (minutesDuration < 10) {
  minutesDuration = `0` + minutesDuration;
}


const generateFilmCard = () => {
  return {
    title: getRandomArrayItem(TITLES),
    rating: getRandomNumberTwoDecimalPlaces(0, 10),
    date: new Date(getRandomIntegerNumber(YEAR_START, YEAR_FINISH), getRandomIntegerNumber(1, MONTH_COUNT), getRandomIntegerNumber(1, DAYS_COUNT + 1)),
    duration: hoursDuration + `h ` + minutesDuration + `m`,
    // genre: getRandomArray(GENRES, DESCRIPTION_COUNT).join(` `),
    genre: getRandomArray(GENRES, DESCRIPTION_COUNT),
    poster: getRandomArrayItem(POSTERS),
    description: getRandomArray(DESCRIPTIONS, DESCRIPTION_COUNT).join(` `),
    commentsCount: getRandomIntegerNumber(0, COMMENTS_COUNT + 1), // +1 т.к. максимальное значение не учитывается в функции
    isWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
    writers: getRandomArray(WRITERS, WRITERS.length).join(`, `),
    actors: getRandomArray(ACTORS, ACTORS.length).join(`, `),
    country: getRandomArrayItem(COUNTRYS),
    ageLimit: getRandomArrayItem(AGE_LIMITS),
    director: getRandomArrayItem(DIRECTORS),
  };
};

const generateFilmCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilmCard);
};


export {generateFilmCards};
