import {getRandomArrayItem, getRandomIntegerNumber, getRandomNumberTwoDecimalPlaces, getRandomArray, getDateWithZero} from "./utils.js";
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

let date = new Date(
    getRandomIntegerNumber(YEAR_START, YEAR_FINISH),
    getRandomIntegerNumber(0, MONTH_COUNT + 1),
    getRandomIntegerNumber(1, DAYS_COUNT + 1)
);

let year = date.getFullYear();
let days = date.getDate();
let month = date.getMonth();

days = getDateWithZero(days);

let dates = {
  DAYS: days,
  MONTHS: month,
  YEARS: year
};

const generateFilmCard = () => {
  return {
    title: getRandomArrayItem(TITLES),
    rating: getRandomNumberTwoDecimalPlaces(0, 10),
    date: dates,
    duration: hoursDuration + `h ` + minutesDuration + `m`,
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
