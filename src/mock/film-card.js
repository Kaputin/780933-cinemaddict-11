import {getRandomArrayItem, getRandomIntegerNumber, getRandomNumberTwoDecimalPlaces, getRandomArray, getDateWithZero} from "./utils.js";
import {TITLES, DIRECTORS, WRITERS, ACTORS, POSTERS, DESCRIPTIONS, GENRES, COUNTRYS, AGE_LIMITS, YEAR_START, YEAR_FINISH, MONTH_COUNT, DAYS_COUNT} from "./const.js";

const DESCRIPTION_COUNT = 5;
const COMMENTS_COUNT = 5;
const HOURS_MAX = 3;
const MINUTES_MAX = 59;

const getHours = (hoursMax) => {
  let hoursDuration = getRandomIntegerNumber(0, hoursMax + 1);

  return hoursDuration;
};

const getMinutes = (minutesMax) => {
  let minutesDuration = getRandomIntegerNumber(0, minutesMax + 1);
  if (minutesDuration < 10) {
    minutesDuration = `0` + minutesDuration;
  }

  return minutesDuration;
};

const getDate = (yearStart, yearFinish, monthCount, daysCount) => {
  let date = new Date(
      getRandomIntegerNumber(yearStart, yearFinish),
      getRandomIntegerNumber(0, monthCount + 1),
      getRandomIntegerNumber(1, daysCount + 1)
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

  return dates;
};

const generateFilmCard = () => {
  return {
    title: getRandomArrayItem(TITLES),
    rating: getRandomNumberTwoDecimalPlaces(0, 10),
    date: getDate(YEAR_START, YEAR_FINISH, MONTH_COUNT, DAYS_COUNT), // исправил на случайную дату
    duration: getHours(HOURS_MAX) + `h ` + getMinutes(MINUTES_MAX) + `m`, // исправил на случайную продолжительность
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
