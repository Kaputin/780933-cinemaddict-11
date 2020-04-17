import {uniteArr} from "./utils.js";
import {MENU_ITEMS} from "./const.js";

const generateMenuItems = (filmCards) => {

  let watchlist = 0;
  let history = 0;
  let favorite = 0;
  const all = filmCards.length;
  const countFilmCards = [];

  for (let i of filmCards) {
    if (i.isFavorite === true) {
      favorite++;
    } if (i.isWatchlist === true) {
      watchlist++;
    } if (i.isWatched === true) {
      history++;
    }
  }

  countFilmCards.push(all, watchlist, history, favorite);

  let newArr = [];

  uniteArr(MENU_ITEMS, countFilmCards, newArr);
  return newArr;
};

export {generateMenuItems};
