const FILM_COUNT = 16;
const EXTRA_COUNT = 2;

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

import {createRatingProfileTemplate} from "./components/rating.js";
import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createСontentTemplate} from "./components/content.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createShowMoreButtonTemplate} from "./components/show-more-button.js";
import {createFooterStatisticsTemplate} from "./components/footer-statistics.js";
import {createPopUpTemplate} from "./components/pop-up.js";
import {generateFilmCards} from "./mock/film-card.js";
import {generateComments} from "./mock/comments.js";
import {generateMenuItems} from "./mock/site-menu.js";
import {sortDiscussed, sortRating} from "./utils.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);


const filmCards = generateFilmCards(FILM_COUNT);
const comments = generateComments(filmCards[0].commentsCount);
const menuItems = generateMenuItems(filmCards);

render(siteHeaderElement, createRatingProfileTemplate(), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(menuItems), `beforeend`);
render(siteMainElement, createСontentTemplate(), `beforeend`);

const filmList = siteMainElement.querySelector(`.films-list`);
const filmListContainer = filmList.querySelector(`.films-list__container`);

let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

filmCards.slice(0, showingFilmsCount)
  .forEach((filmCard) => render(filmListContainer, createFilmCardTemplate(filmCard), `beforeend`));

render(filmList, createShowMoreButtonTemplate(), `beforeend`);

const showMoreButton = filmList.querySelector(`.films-list__show-more`);

showMoreButton.addEventListener(`click`, () => {
  const prevFilmsCount = showingFilmsCount;
  showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  filmCards.slice(prevFilmsCount, showingFilmsCount)
    .forEach((filmCard) => render(filmListContainer, createFilmCardTemplate(filmCard), `beforeend`));

  if (showingFilmsCount >= filmCards.length) {
    showMoreButton.remove();
  }
});

const filmListTopRated = siteMainElement.querySelectorAll(`.films-list--extra`)[0];
const filmListTopRatedContainer = filmListTopRated.querySelector(`.films-list__container`);

const ratingFilmCards = sortRating(filmCards.slice());

ratingFilmCards.slice(0, EXTRA_COUNT)
  .forEach((ratingFilmCard) => render(filmListTopRatedContainer, createFilmCardTemplate(ratingFilmCard), `beforeend`));

const filmListMostCommented = siteMainElement.querySelectorAll(`.films-list--extra`)[1];
const filmListMostCommentedContainer = filmListMostCommented.querySelector(`.films-list__container`);

const extrafilmCards = sortDiscussed(filmCards.slice());

extrafilmCards.slice(0, EXTRA_COUNT)
  .forEach((extrafilmCard) => render(filmListMostCommentedContainer, createFilmCardTemplate(extrafilmCard), `beforeend`));

render(siteFooterElement, createFooterStatisticsTemplate(FILM_COUNT), `beforeend`);

render(siteFooterElement, createPopUpTemplate(filmCards[0], comments), `afterend`);
