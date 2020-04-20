const FILM_COUNT = 16;
const EXTRA_COUNT = 2;

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

import RatingProfile from "./components/rating.js";
import SiteMenu from "./components/site-menu.js";
import Content from "./components/content.js";
import TopRated from "./components/top-rated.js";
import MostCommented from "./components/most-commented.js";
import FilmCard from "./components/film-card.js";
import ShowMoreButton from "./components/show-more-button.js";
import FooterStatistics from "./components/footer-statistics.js";
import PopUp from "./components/pop-up.js";
import {generateFilmCards} from "./mock/film-card.js";
import {generateComments} from "./mock/comments.js";
import {generateMenuItems} from "./mock/site-menu.js";
import {sortDiscussed, sortRating, render, RenderPosition} from "./utils.js";

const renderFilmCard = (filmListContainer, filmCard) => {
  const addPopUp = () => {
    filmListContainer.appendChild(popUp.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
    closeBtn.addEventListener(`click`, onClosePopupClick);
    filmCardTitle.removeEventListener(`click`, onOpenPopupClick);
    filmCardPoster.removeEventListener(`click`, onOpenPopupClick);
    filmCardComments.removeEventListener(`click`, onOpenPopupClick);
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
    filmCardTitle.addEventListener(`click`, onOpenPopupClick);
    filmCardPoster.addEventListener(`click`, onOpenPopupClick);
    filmCardComments.addEventListener(`click`, onOpenPopupClick);
    document.removeEventListener(`keydown`, onEscKeyDown);
    closeBtn.removeEventListener(`click`, onClosePopupClick);
  };

  const onClosePopupClick = function () {
    removePopUp();
  };

  const comments = generateComments(filmCard.commentsCount);

  const filmCardElement = new FilmCard(filmCard);

  const popUp = new PopUp(filmCard, comments);

  const filmCardTitle = filmCardElement.getElement().querySelector(`.film-card__title`);
  const filmCardPoster = filmCardElement.getElement().querySelector(`.film-card__poster`);
  const filmCardComments = filmCardElement.getElement().querySelector(`.film-card__comments`);

  filmCardTitle.addEventListener(`click`, onOpenPopupClick);
  filmCardPoster.addEventListener(`click`, onOpenPopupClick);
  filmCardComments.addEventListener(`click`, onOpenPopupClick);


  const closeBtn = popUp.getElement().querySelector(`.film-details__close-btn`);


  render(filmListContainer, filmCardElement.getElement(), RenderPosition.BEFOREEND);
};

const renderContent = (content, filmCards) => {
  const filmList = content.getElement().querySelector(`.films-list`);
  const filmListContainer = content.getElement().querySelector(`.films-list__container`);

  let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

  filmCards.slice(0, showingFilmsCount)
  .forEach((filmCard) => {
    renderFilmCard(filmListContainer, filmCard);
  });

  const showMoreButton = new ShowMoreButton();
  render(filmList, showMoreButton.getElement(), RenderPosition.BEFOREEND);

  showMoreButton.getElement().addEventListener(`click`, () => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    filmCards.slice(prevFilmsCount, showingFilmsCount)
      .forEach((filmCard) => renderFilmCard(filmListContainer, filmCard));

    if (showingFilmsCount >= filmCards.length) {
      showMoreButton.getElement().remove();
      showMoreButton.removeElement();
    }
  });

  render(content.getElement(), new TopRated().getElement(), RenderPosition.BEFOREEND);
  render(content.getElement(), new MostCommented().getElement(), RenderPosition.BEFOREEND);

  const filmListTopRated = content.getElement().querySelectorAll(`.films-list--extra`)[0];
  const filmListTopRatedContainer = filmListTopRated.querySelector(`.films-list__container`);
  const ratingFilmCards = sortRating(filmCards.slice());

  ratingFilmCards.slice(0, EXTRA_COUNT)
    .forEach((ratingFilmCard) => {
      renderFilmCard(filmListTopRatedContainer, ratingFilmCard);
    });

  const filmListMostCommented = content.getElement().querySelectorAll(`.films-list--extra`)[1];
  const filmListMostCommentedContainer = filmListMostCommented.querySelector(`.films-list__container`);
  const extrafilmCards = sortDiscussed(filmCards.slice());

  extrafilmCards.slice(0, EXTRA_COUNT)
    .forEach((extrafilmCard) => {
      renderFilmCard(filmListMostCommentedContainer, extrafilmCard);
    });
};


const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteFooterStatistics = siteFooterElement.querySelector(`.footer__statistics`);


const filmCards = generateFilmCards(FILM_COUNT);
const menuItems = generateMenuItems(filmCards);

render(siteHeaderElement, new RatingProfile().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenu(menuItems).getElement(), RenderPosition.BEFOREEND);
const content = new Content();
render(siteMainElement, content.getElement(), RenderPosition.BEFOREEND);


render(siteFooterStatistics, new FooterStatistics(FILM_COUNT).getElement(), RenderPosition.BEFOREEND);

renderContent(content, filmCards);
