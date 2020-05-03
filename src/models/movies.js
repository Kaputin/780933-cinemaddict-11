import {getFilmCardsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

export default class Movies {
  constructor() {
    this._filmCards = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getFilmCards() {
    return getFilmCardsByFilter(this._filmCards, this._activeFilterType);
  }

  getFilmCardsAll() {
    return this._filmCards;
  }

  setFilmCards(filmCards) {
    this._filmCards = Array.from(filmCards);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateFilmCards(id, filmCard) {
    const index = this._filmCards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._filmCards = [].concat(this._filmCards.slice(0, index), filmCard, this._filmCards.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
