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

const renderFilmCards = (filmListContainer, footerContainer, filmCards, onDataChange, onViewChange) => {
  return filmCards.map((filmCard) => {
    const filmCardController = new MovieController(filmListContainer, onDataChange, onViewChange);

    filmCardController.render(footerContainer, filmCard);

    return filmCardController;
  });
};


export default class PageController {
  constructor(container) {
    this._container = container;

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

  render(footer, filmCards) {
    this._filmCards = filmCards;
    const content = this._container.getElement();
    const filmList = content.querySelector(`.films-list`);
    const filmListContainer = content.querySelector(`.films-list__container`);

    if (this._filmCards.length <= 0) {
      render(filmListContainer, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    const newFilmCards = renderFilmCards(filmListContainer, footer, this._filmCards.slice(0, this._showingFilmsCount), this._onDataChange, this._onViewChange);
    this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);

    this._renderShowMoreButton(filmList);

    render(content, this._topRated, RenderPosition.BEFOREEND);

    render(content, this._mostCommented, RenderPosition.BEFOREEND);

    const filmListTopRated = this._topRated.getElement();
    const filmListTopRatedContainer = filmListTopRated.querySelector(`.films-list__container`);
    const ratingFilmCards = sortRating(this._filmCards.slice());

    renderFilmCards(filmListTopRatedContainer, footer, ratingFilmCards.slice(0, EXTRA_COUNT), this._onDataChange, this._onViewChange);

    const filmListMostCommented = this._mostCommented.getElement();
    const filmListMostCommentedContainer = filmListMostCommented.querySelector(`.films-list__container`);
    const extrafilmCards = sortDiscussed(this._filmCards.slice());

    renderFilmCards(filmListMostCommentedContainer, footer, extrafilmCards.slice(0, EXTRA_COUNT), this._onDataChange, this._onViewChange);
  }

  _renderShowMoreButton(footer) {
    if (this._showingFilmsCount >= this._filmCards.length) {
      return;
    }

    render(this._filmList, this._showMoreButton, RenderPosition.BEFOREEND);

    this._showMoreButton.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      const newFilmCards = renderFilmCards(this._filmListContainer, footer, this._filmCards.slice(prevFilmsCount, this._showingFilmsCount), this._onDataChange, this._onViewChange);
      this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);

      if (this._showingFilmsCount >= this._filmCards.length) {
        remove(this._showMoreButton);
      }
    });
  }

  _onDataChange(filmCardController, footer, oldData, newData) {
    const index = this._filmCards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._filmCards = [].concat(this._filmCards.slice(0, index), newData, this._filmCards.slice(index + 1));

    filmCardController.render(footer, this._filmCards[index]);
  }

  _onViewChange() {
    this._showedFilmCardsControllers.forEach((it) => it.setDefaultView());
  }
}
