const EXTRA_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

import TopRated from "../components/top-rated.js";
import MostCommented from "../components/most-commented.js";
import ShowMoreButton from "../components/show-more-button.js";
import NoFilms from "../components/no-films.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortDiscussed, sortRating} from "../utils/sort.js";
import MovieController from "./movie-controller.js";
import {SortType} from "../components/sort.js";

const getSortedFilmCards = (filmCards, sortType, from, to) => {
  let sortedFilmCards = [];
  const showingFilmCards = filmCards.slice();

  switch (sortType) {
    case SortType.RATING:
      sortedFilmCards = showingFilmCards.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DATE:
      sortedFilmCards = showingFilmCards.sort((a, b) => b.date - a.date);
      break;
    case SortType.DEFAULT:
      sortedFilmCards = showingFilmCards.sort((a, b) => b.id < a.id);
      break;
  }

  return sortedFilmCards.slice(from, to);
};

export default class PageController {
  constructor(container, body, sort, moviesModel, ratingComponent) {
    this._container = container;
    this._bodyContainer = body;
    this._moviesModel = moviesModel;
    this._ratingComponent = ratingComponent;

    this._sortComponent = sort;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onSortTypeReset = this._onSortTypeReset.bind(this);

    this._showedFilmCardsControllers = [];
    this._showedFilmTopRatedControllers = [];
    this._showedMostCommentedFilmControllers = [];

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

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  render() {
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

  _renderFilmList(filmCards) {
    const newFilmCards = this._renderFilmCards(this._filmListContainer, filmCards);
    this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);
  }

  _renderFilmTopRated(filmCards) {
    const ratingFilmCards = sortRating(filmCards.slice());

    if (ratingFilmCards.length === 0) {
      return;
    }

    render(this._content, this._topRated, RenderPosition.BEFOREEND);
    this._showedFilmTopRatedControllers = this._renderFilmCards(
        this._topRated.getElement().querySelector(`.films-list__container`),
        ratingFilmCards.slice(0, EXTRA_COUNT)
    );
  }

  _renderFilmMostCommented(filmCards) {
    const extrafilmCards = sortDiscussed(filmCards.slice());

    if (extrafilmCards.length === 0) {
      return;
    }
    render(this._content, this._mostCommented, RenderPosition.BEFOREEND);
    this._showedMostCommentedFilmControllers = this._renderFilmCards(
        this._mostCommented.getElement().querySelector(`.films-list__container`),
        extrafilmCards.slice(0, EXTRA_COUNT)
    );
  }

  _removeFilmCards(controller) {
    controller.forEach((filmCardController) => filmCardController.destroy());
    controller = [];
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
      const newFilmCards = this._renderFilmCards(this._filmListContainer, sortedFilmCards);

      this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);

      if (this._showingFilmsCount >= filmCards.length) {
        remove(this._showMoreButton);
      }
    });
  }

  _updateFilmCards(count) {
    this._removeFilmCards(this._showedFilmCardsControllers);
    const updatefilmCards = this._moviesModel.getFilmCards();

    this._onSortTypeReset();
    const sortedFilmCards = getSortedFilmCards(updatefilmCards, SortType.DEFAULT, 0, this._showingFilmsCount);
    this._renderFilmList(sortedFilmCards.slice(0, count));
    this._renderShowMoreButton();
  }

  _onDataChange(filmCardController, oldData, newData, comment) {
    if (!newData) {
      const isSuccess = this._moviesModel.removeComment(comment, oldData);
      if (isSuccess) {
        this._showedFilmCardsControllers.concat(this._showedMostCommentedFilmControllers, this._showedFilmTopRatedControllers)
        .filter((filmController) => filmController.getFilm() === oldData)
        .forEach((filmController) => filmController.render(oldData));
        this._updateFilmMostCommented(this._moviesModel.getFilmCardsAll());
      }
    } else if (!oldData) {
      const isSuccess = this._moviesModel.addComment(comment, newData);
      if (isSuccess) {
        this._showedFilmCardsControllers.concat(this._showedMostCommentedFilmControllers, this._showedFilmTopRatedControllers)
        .filter((filmController) => filmController.getFilmById() === newData.id)
        .forEach((filmController) => filmController.render(newData));
        this._updateFilmMostCommented(this._moviesModel.getFilmCardsAll());
      }
    } else {
      const isSuccess = this._moviesModel.updateFilmCards(oldData.id, newData);
      if (isSuccess) {
        this._showedFilmCardsControllers.concat(this._showedMostCommentedFilmControllers, this._showedFilmTopRatedControllers)
        .filter((filmController) => filmController.getFilm() === oldData)
        .forEach((filmController) => filmController.render(newData));
        this._ratingComponent.rerender();
      }
    }
  }

  _updateFilmMostCommented(filmCards) {
    this._removeFilmCards(this._showedMostCommentedFilmControllers);
    const extrafilmCards = sortDiscussed(filmCards.slice());
    if (extrafilmCards.length === 0) {
      this._mostCommented.hide();
      return;
    }

    render(this._content, this._mostCommented, RenderPosition.BEFOREEND);
    this._showedMostCommentedFilmControllers = this._renderFilmCards(
        this._mostCommented.getElement().querySelector(`.films-list__container`),
        extrafilmCards.slice(0, EXTRA_COUNT)
    );
  }

  _onViewChange() {
    this._showedFilmCardsControllers.forEach((it) => it.setDefaultView());
  }

  _renderFilmCards(filmListContainer, filmCards) {
    return filmCards.map((filmCard) => {
      const filmCardController = new MovieController(filmListContainer, this._bodyContainer, this._onDataChange, this._onViewChange);
      filmCardController.render(filmCard);
      return filmCardController;
    });
  }

  _onSortTypeChange(sortType) {
    this._removeFilmCards(this._showedFilmCardsControllers);
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    const sortedFilmCards = getSortedFilmCards(this._moviesModel.getFilmCards(), sortType, 0, this._showingFilmsCount);
    this._renderFilmList(sortedFilmCards);

    this._renderShowMoreButton();

  }

  _onSortTypeReset() {
    this._sortComponent.sortTypeReset();
  }

  _onFilterChange() {
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._updateFilmCards(this._showingFilmsCount);
  }
}
