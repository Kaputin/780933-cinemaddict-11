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
      sortedFilmCards = showingFilmCards.sort((a, b) => b.date - a.date);
      break;
    case SortType.DEFAULT:
      sortedFilmCards = showingFilmCards;
      break;
  }

  return sortedFilmCards.slice(from, to);
};

export default class PageController {
  constructor(container, body, sort, moviesModel) {
    this._container = container;
    this._bodyContainer = body;
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
    const newFilmCards = this._renderFilmCards(this._filmListContainer, filmCards, this._onDataChange, this._onViewChange);
    this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);
    this._showingFilmCardsCount = this._showedFilmCardsControllers.length;
  }

  _renderFilmTopRated(filmCards) {
    render(this._content, this._topRated, RenderPosition.BEFOREEND);

    const filmListTopRated = this._topRated.getElement();
    const filmListTopRatedContainer = filmListTopRated.querySelector(`.films-list__container`);
    const ratingFilmCards = sortRating(filmCards.slice());

    const newFilms = this._renderFilmCards(filmListTopRatedContainer, ratingFilmCards.slice(0, EXTRA_COUNT), this._onDataChange, this._onViewChange);

    this._showedFilmTopRatedControllers = newFilms;
  }

  _renderFilmMostCommented(filmCards) {
    render(this._content, this._mostCommented, RenderPosition.BEFOREEND);

    const filmListMostCommented = this._mostCommented.getElement();
    const filmListMostCommentedContainer = filmListMostCommented.querySelector(`.films-list__container`);
    const extrafilmCards = sortDiscussed(filmCards.slice());

    const newFilms = this._renderFilmCards(filmListMostCommentedContainer, extrafilmCards.slice(0, EXTRA_COUNT), this._onDataChange, this._onViewChange);

    this._showedMostCommentedFilmControllers = newFilms;
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
      const newFilmCards = this._renderFilmCards(this._filmListContainer, sortedFilmCards, this._onDataChange, this._onViewChange);

      this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);

      if (this._showingFilmsCount >= filmCards.length) {
        remove(this._showMoreButton);
      }
    });
  }

  _updateFilmCards(count) {
    this._removeFilmCards(this._showedFilmCardsControllers);
    this._removeFilmCards(this._showedMostCommentedFilmControllers);
    this._removeFilmCards(this._showedFilmTopRatedControllers);
    const updatefilmCards = this._moviesModel.getFilmCards();
    this._onSortTypeReset();
    const sortedFilmCards = getSortedFilmCards(updatefilmCards, SortType.DEFAULT, 0, this._showingFilmsCount);
    this._renderFilmList(sortedFilmCards.slice(0, count));
    this._renderShowMoreButton();

    this._renderFilmTopRated(this._moviesModel.getFilmCardsAll());
    this._renderFilmMostCommented(this._moviesModel.getFilmCardsAll());
  }

  _onDataChange(filmCardController, oldData, newData, comment) {
    if (!newData) {
      const isSuccess = this._moviesModel.removeComment(comment, oldData);
      if (isSuccess) {
        const allControllers = this._showedFilmCardsControllers.concat(this._showedMostCommentedFilmControllers, this._showedFilmTopRatedControllers);
        allControllers.filter((filmController) => filmController.getFilm() === oldData)
        .forEach((filmController) => filmController.render(oldData));
        // придумать и вставить сюда отдельное обновление блока с комментариями и убрать из общего массива
        // убрать передаваемы контроллер, т.к. ищу по всем и он не нужен?
      }
    } else if (!oldData) {
      const isSuccess = this._moviesModel.addComment(comment, newData);
      if (isSuccess) {
        const allControllers = this._showedFilmCardsControllers.concat(this._showedMostCommentedFilmControllers, this._showedFilmTopRatedControllers);
        allControllers.filter((filmController) => filmController.getFilm() === newData)
        .forEach((filmController) => filmController.render(newData));
        // придумать и вставить сюда отдельное обновление блока с комментариями и убрать из общего массива
      }
    } else {
      const isSuccess = this._moviesModel.updateFilmCards(oldData.id, newData);
      if (isSuccess) {
        const allControllers = this._showedFilmCardsControllers.concat(this._showedMostCommentedFilmControllers, this._showedFilmTopRatedControllers);
        allControllers.filter((filmController) => filmController.getFilm() === oldData)
        .forEach((filmController) => filmController.render(newData));
      }
    }
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
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    const sortedFilmCards = getSortedFilmCards(this._moviesModel.getFilmCards(), sortType, 0, this._showingFilmsCount);

    this._removeFilmCards(this._showedFilmCardsControllers);
    this._removeFilmCards(this._showedMostCommentedFilmControllers);
    this._removeFilmCards(this._showedFilmTopRatedControllers);
    this._renderFilmList(sortedFilmCards);

    this._renderShowMoreButton();

    this._renderFilmTopRated(this._moviesModel.getFilmCardsAll());
    this._renderFilmMostCommented(this._moviesModel.getFilmCardsAll());
  }

  _onSortTypeReset() {
    this._sortComponent.getSortTypeReset();
  }

  _onFilterChange() {
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._updateFilmCards(this._showingFilmsCount);
  }
}
