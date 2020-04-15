import {getRandomArrayItem, getRandomIntegerNumber, getRandomNumberTwoDecimalPlaces, getRandomArray} from "./utils.js";
import {TITLES, DIRECTORS, WRITERS, ACTORS, POSTERS, DESCRIPTIONS, GENRES, COUNTRYS, AGE_LIMITS} from "./const.js";

const DESCRIPTION_COUNT = 5;
const COMMENTS_COUNT = 5;
const YEAR_START = 1888;
const YEAR_FINISH = 2020;


const generateFilmCard = () => {
  return {
    title: getRandomArrayItem(TITLES),
    rating: getRandomNumberTwoDecimalPlaces(0, 10),
    year: getRandomIntegerNumber(YEAR_START, YEAR_FINISH + 1),
    duration: `1h 55m`,
    genre: getRandomArrayItem(GENRES),
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


export {generateFilmCard, generateFilmCards};
