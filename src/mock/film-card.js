import {getRandomArrayItem, getRandomIntegerNumber, getRandomNumberTwoDecimalPlaces, getRandomArray} from "./utils.js";
import {generateComments} from "./comments.js";

import {TITLES, DIRECTORS, WRITERS, ACTORS, POSTERS, DESCRIPTIONS, GENRES, COUNTRYS, AGE_LIMITS, Year, MONTH_COUNT, DAYS_COUNT} from "./const.js";

const DESCRIPTION_COUNT = 5;
const COMMENTS_COUNT = 5;
const HOURS_MAX = 3;
const MINUTES_MAX = 59;
const DURETION_MAX = 1000;

const generateFilmCard = () => {
  return {
    id: String(new Date() + Math.random()),
    title: getRandomArrayItem(TITLES),
    rating: getRandomNumberTwoDecimalPlaces(0, 10),
    date: new Date(getRandomIntegerNumber(Year.START, Year.FINISH), getRandomIntegerNumber(0, MONTH_COUNT + 1), getRandomIntegerNumber(1, DAYS_COUNT + 1)),
    duration: getRandomIntegerNumber(0, DURETION_MAX), // исправил на случайную продолжительность
    genre: getRandomArray(GENRES, DESCRIPTION_COUNT),
    poster: getRandomArrayItem(POSTERS),
    description: getRandomArray(DESCRIPTIONS, DESCRIPTION_COUNT).join(` `),
    comments: generateComments(getRandomIntegerNumber(0, COMMENTS_COUNT + 1)), // +1 т.к. максимальное значение не учитывается в функции
    isWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    watchingDate: new Date(getRandomIntegerNumber(2020, 2020), getRandomIntegerNumber(1, MONTH_COUNT + 1), getRandomIntegerNumber(1, DAYS_COUNT + 1), getRandomIntegerNumber(0, HOURS_MAX + 1), getRandomIntegerNumber(0, MINUTES_MAX + 1)),
    isFavorite: Math.random() > 0.5,
    writers: getRandomArray(WRITERS, WRITERS.length).join(`, `),
    actors: getRandomArray(ACTORS, ACTORS.length).join(`, `),
    country: getRandomArrayItem(COUNTRYS),
    ageLimit: getRandomArrayItem(AGE_LIMITS),
    director: getRandomArrayItem(DIRECTORS),
  };
};

export const generateFilmCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilmCard);
};
