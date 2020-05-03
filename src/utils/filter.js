import {FilterType} from "../const.js";

export const getWatchlistFilmCards = (filmCards) => {
  return filmCards.filter((filmCard) => !filmCard.isWatchlist);
};

export const getWatchedFilmCards = (filmCards) => {
  return filmCards.filter((filmCard) => !filmCard.isWatched);
};

export const getFavoriteFilmCards = (filmCards) => {
  return filmCards.filter((filmCard) => !filmCard.isFavorite);
};

export const getFilmCardsByFilter = (filmCards, filterType) => {

  switch (filterType) {
    case FilterType.ALL:
      return filmCards;
    case FilterType.WATCHLIST:
      return getWatchlistFilmCards(filmCards);
    case FilterType.HISTORY:
      return getWatchedFilmCards(filmCards);
    case FilterType.FAVORITES:
      return getFavoriteFilmCards(filmCards);
  }

  return filmCards;
};
