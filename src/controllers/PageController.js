const EXTRA_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

import TopRated from "../components/top-rated.js";
import MostCommented from "../components/most-commented.js";
import FilmCard from "../components/film-card.js";
import ShowMoreButton from "../components/show-more-button.js";
import PopUp from "../components/pop-up.js";
import {generateComments} from "../mock/comments.js";

import {render, RenderPosition, remove} from "../utils/render.js";
import {sortDiscussed, sortRating} from "../utils/sort.js";

const renderFilmCard = (filmListContainer, filmCard) => {

  const addPopUp = () => {
    filmListContainer.appendChild(popUp.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
    popUp.setCloseButtonClickHandler(onClosePopupClick);
    filmCardElement.removeCardTitleClickHandler(onOpenPopupClick);
    filmCardElement.removeCardPosterClickHandler(onOpenPopupClick);
    filmCardElement.removeCardCommentsClickHandler(onOpenPopupClick);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      removePopUp();
    }
  };

  const onOpenPopupClick = function () {
    addPopUp();
  };

  const removePopUp = () => {
    filmListContainer.removeChild(popUp.getElement());
    filmCardElement.setCardTitleClickHandler(onOpenPopupClick);
    filmCardElement.setCardPosterClickHandler(onOpenPopupClick);
    filmCardElement.setCardCommentsClickHandler(onOpenPopupClick);
    document.removeEventListener(`keydown`, onEscKeyDown);
    popUp.removeCloseButtonClickHandler(onClosePopupClick);
  };

  const onClosePopupClick = function () {
    removePopUp();
  };

  const comments = generateComments(filmCard.commentsCount);

  const filmCardElement = new FilmCard(filmCard);

  const popUp = new PopUp(filmCard, comments);

  filmCardElement.setCardTitleClickHandler(onOpenPopupClick);
  filmCardElement.setCardPosterClickHandler(onOpenPopupClick);
  filmCardElement.setCardCommentsClickHandler(onOpenPopupClick);

  render(filmListContainer, filmCardElement, RenderPosition.BEFOREEND);
};


export default class PageController {
  constructor(container) {
    this._container = container;
    this._showMoreButton = new ShowMoreButton();
    this._topRated = new TopRated();
    this._mostCommented = new MostCommented();
  }

  render(filmCards) {
    const content = this._container.getElement();
    const filmList = content.querySelector(`.films-list`);
    const filmListContainer = content.querySelector(`.films-list__container`);

    let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    filmCards.slice(0, showingFilmsCount)
    .forEach((filmCard) => {
      renderFilmCard(filmListContainer, filmCard);
    });


    render(filmList, this._showMoreButton, RenderPosition.BEFOREEND);

    this._showMoreButton.setClickHandler(() => {
      const prevFilmsCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      filmCards.slice(prevFilmsCount, showingFilmsCount)
        .forEach((filmCard) => renderFilmCard(filmListContainer, filmCard));

      if (showingFilmsCount >= filmCards.length) {
        remove(this._showMoreButton);
      }
    });


    render(content, this._topRated, RenderPosition.BEFOREEND);

    render(content, this._mostCommented, RenderPosition.BEFOREEND);

    const filmListTopRated = this._topRated.getElement();
    const filmListTopRatedContainer = filmListTopRated.querySelector(`.films-list__container`);
    const ratingFilmCards = sortRating(filmCards.slice());

    ratingFilmCards.slice(0, EXTRA_COUNT)
      .forEach((ratingFilmCard) => {
        renderFilmCard(filmListTopRatedContainer, ratingFilmCard);
      });

    const filmListMostCommented = this._mostCommented.getElement();
    const filmListMostCommentedContainer = filmListMostCommented.querySelector(`.films-list__container`);
    const extrafilmCards = sortDiscussed(filmCards.slice());

    extrafilmCards.slice(0, EXTRA_COUNT)
      .forEach((extrafilmCard) => {
        renderFilmCard(filmListMostCommentedContainer, extrafilmCard);
      });
  }
}
