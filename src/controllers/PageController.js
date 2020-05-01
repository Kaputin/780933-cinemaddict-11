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
  constructor(container, footer, sort) {
    this._container = container;
    this._footerContainer = footer;

    this._sortComponent = sort;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._filmCards = [];
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
  }

  render(filmCards) {
    this._filmCards = filmCards;

    if (this._filmCards.length <= 0) {
      render(this._filmListContainer, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    const sortedFilmCards = getSortedFilmCards(this._filmCards, this._sortComponent.getSortType(), 0, this._showingFilmsCount);
    const newFilmCards = this._renderFilmCards(this._filmListContainer, sortedFilmCards, this._onDataChange, this._onViewChange);


    this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);

    this._renderShowMoreButton();

    render(this._content, this._topRated, RenderPosition.BEFOREEND);

    render(this._content, this._mostCommented, RenderPosition.BEFOREEND);

    const filmListTopRated = this._topRated.getElement();
    const filmListTopRatedContainer = filmListTopRated.querySelector(`.films-list__container`);
    const ratingFilmCards = sortRating(this._filmCards.slice());

    this._renderFilmCards(filmListTopRatedContainer, ratingFilmCards.slice(0, EXTRA_COUNT), this._onDataChange, this._onViewChange);

    const filmListMostCommented = this._mostCommented.getElement();
    const filmListMostCommentedContainer = filmListMostCommented.querySelector(`.films-list__container`);
    const extrafilmCards = sortDiscussed(this._filmCards.slice());

    this._renderFilmCards(filmListMostCommentedContainer, extrafilmCards.slice(0, EXTRA_COUNT), this._onDataChange, this._onViewChange);
  }

  _renderShowMoreButton() {
    if (this._showingFilmsCount >= this._filmCards.length) {
      return;
    }

    render(this._filmList, this._showMoreButton, RenderPosition.BEFOREEND);

    this._showMoreButton.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      const sortedFilmCards = getSortedFilmCards(this._filmCards, this._sortComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);
      const newFilmCards = this._renderFilmCards(this._filmListContainer, sortedFilmCards, this._onDataChange, this._onViewChange);

      this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);

      if (this._showingFilmsCount >= this._filmCards.length) {
        remove(this._showMoreButton);
      }
    });
  }

  _onDataChange(filmCardController, oldData, newData) {
    const index = this._filmCards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._filmCards = [].concat(this._filmCards.slice(0, index), newData, this._filmCards.slice(index + 1));

    filmCardController.render(this._filmCards[index]);
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
    remove(this._showMoreButton);
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    const sortedFilmCards = getSortedFilmCards(this._filmCards, sortType, 0, this._showingFilmsCount);

    this._filmListContainer.innerHTML = ``;

    const newFilmCards = this._renderFilmCards(this._filmListContainer, sortedFilmCards, this._onDataChange, this._onViewChange);
    this._showedFilmCardsControllers = newFilmCards;

    this._renderShowMoreButton();
  }
}
