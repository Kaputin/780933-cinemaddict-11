const EXTRA_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

import TopRated from "../components/top-rated.js";
import MostCommented from "../components/most-commented.js";
import ShowMoreButton from "../components/show-more-button.js";
import NoFilms from "../components/no-films.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortDiscussed, sortRating} from "../utils/sort.js";
import MovieController from "./MovieController.js";
import {SortType} from "../components/sort.js";

const getSortedFilmCards = (filmCards, sortType, from, to) => {
  let sortedFilmCards = [];
  const showingFilmCards = filmCards.slice();

  switch (sortType) {
    case SortType.RATING:
      sortedFilmCards = showingFilmCards.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DATE:
      sortedFilmCards = showingFilmCards.sort((a, b) => {
        if (b.date.YEARS > a.date.YEARS) {
          return 1;
        }
        if (b.date.YEARS < a.date.YEARS) {
          return -1;
        }
        if (b.date.YEARS === a.date.YEARS) {
          if (b.date.MONTHS > a.date.MONTHS) {
            return 1;
          }
          if (b.date.MONTHS < a.date.MONTHS) {
            return -1;
          }
          if (b.date.MONTHS === a.date.MONTHS) {
            if (b.date.DAYS > a.date.DAYS) {
              return 1;
            }
            if (b.date.DAYS < a.date.DAYS) {
              return -1;
            }
          }
        }
        return 0;
      });
      break;
    case SortType.DEFAULT:
      sortedFilmCards = showingFilmCards;
      break;
  }

  return sortedFilmCards.slice(from, to);
};

export default class PageController {
  constructor(container, footer, sort, moviesModel) {
    this._container = container;
    this._footerContainer = footer;
    this._moviesModel = moviesModel;

    this._sortComponent = sort;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onSortTypeReset = this._onSortTypeReset.bind(this);

    this._showedFilmCardsControllers = [];
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._showMoreButton = new ShowMoreButton();
    this._topRated = new TopRated();
    this._mostCommented = new MostCommented();
    this._noFilmsComponent = new NoFilms();
    this._content = this._container.getElement();
    this._filmList = this._content.querySelector(`.films-list`);
    this._filmListContainer = this._content.querySelector(`.films-list__container`);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() { // не обновляется карточка во всех блоках, подумать!!!!
    const filmCards = this._moviesModel.getFilmCards();

    if (filmCards.length === 0) {
      render(this._filmListContainer, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._renderFilmList(filmCards.slice(0, this._showingFilmsCount));

    this._renderShowMoreButton();

    this._renderFilmTopRated(filmCards);
    this._renderFilmMostCommented(filmCards);
  }

  _renderFilmList(filmCards) { // сюда попробовать  2 других блока
    const newFilmCards = this._renderFilmCards(this._filmListContainer, filmCards, this._onDataChange, this._onViewChange);
    this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);
    this._showingFilmCardsCount = this._showedFilmCardsControllers.length;
  }

  _renderFilmTopRated(filmCards) {
    render(this._content, this._topRated, RenderPosition.BEFOREEND);

    const filmListTopRated = this._topRated.getElement();
    const filmListTopRatedContainer = filmListTopRated.querySelector(`.films-list__container`);
    const ratingFilmCards = sortRating(filmCards.slice());

    this._renderFilmCards(filmListTopRatedContainer, ratingFilmCards.slice(0, EXTRA_COUNT), this._onDataChange, this._onViewChange);
  }

  _renderFilmMostCommented(filmCards) {
    render(this._content, this._mostCommented, RenderPosition.BEFOREEND);

    const filmListMostCommented = this._mostCommented.getElement();
    const filmListMostCommentedContainer = filmListMostCommented.querySelector(`.films-list__container`);
    const extrafilmCards = sortDiscussed(filmCards.slice());

    this._renderFilmCards(filmListMostCommentedContainer, extrafilmCards.slice(0, EXTRA_COUNT), this._onDataChange, this._onViewChange);
  }

  _removeFilmCards() {
    this._showedFilmCardsControllers.forEach((filmCardController) => filmCardController.destroy());
    this._showedFilmCardsControllers = [];
  }

  _renderShowMoreButton() {
    remove(this._showMoreButton);
    if (this._showingFilmsCount >= this._moviesModel.getFilmCards().length) {
      return;
    }

    render(this._filmList, this._showMoreButton, RenderPosition.BEFOREEND);

    this._showMoreButton.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      const filmCards = this._moviesModel.getFilmCards();

      this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      const sortedFilmCards = getSortedFilmCards(filmCards, this._sortComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);
      const newFilmCards = this._renderFilmCards(this._filmListContainer, sortedFilmCards, this._onDataChange, this._onViewChange);

      this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);

      if (this._showingFilmsCount >= filmCards.length) {
        remove(this._showMoreButton);
      }
    });
  }

  _updateFilmCards(count) {
    this._removeFilmCards();
    const updatefilmCards = this._moviesModel.getFilmCards();
    this._onSortTypeReset();
    const sortedFilmCards = getSortedFilmCards(updatefilmCards, SortType.DEFAULT, 0, this._showingFilmsCount);
    this._renderFilmList(sortedFilmCards.slice(0, count));
    this._renderShowMoreButton();
  }

  _onDataChange(filmCardController, oldData, newData) {
    const isSuccess = this._moviesModel.updateFilmCards(oldData.id, newData);

    if (isSuccess) {
      filmCardController.render(newData);
    }
  }

  _onViewChange() {
    this._showedFilmCardsControllers.forEach((it) => it.setDefaultView());
  }

  _renderFilmCards(filmListContainer, filmCards) {
    return filmCards.map((filmCard) => {
      const filmCardController = new MovieController(filmListContainer, this._footerContainer, this._onDataChange, this._onViewChange);

      filmCardController.render(filmCard);

      return filmCardController;
    });
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    const sortedFilmCards = getSortedFilmCards(this._moviesModel.getFilmCards(), sortType, 0, this._showingFilmsCount);

    this._removeFilmCards();
    this._renderFilmList(sortedFilmCards);

    this._renderShowMoreButton();
  }

  _onSortTypeReset() {
    this._sortComponent.getSortTypeReset();
  }

  _onFilterChange() {
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._updateFilmCards(this._showingFilmsCount);
  }
}
