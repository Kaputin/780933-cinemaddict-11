const FILM_COUNT = 5;
const EXTRA_COUNT = 2;

import {createRatingProfileTemplate} from "./components/rating.js";
import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createСontentTemplate} from "./components/content.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createShowMoreButtonTemplate} from "./components/show-more-button.js";
import {createPopUpTemplate} from "./components/pop-up.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createRatingProfileTemplate(), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createСontentTemplate(), `beforeend`);

const filmList = siteMainElement.querySelector(`.films-list`);
const filmListContainer = filmList.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_COUNT; i++) {
  render(filmListContainer, createFilmCardTemplate(), `beforeend`);
}

render(filmList, createShowMoreButtonTemplate(), `beforeend`);

const filmListTopRated = siteMainElement.querySelectorAll(`.films-list--extra`)[0];
const filmListTopRatedContainer = filmListTopRated.querySelector(`.films-list__container`);

for (let i = 0; i < EXTRA_COUNT; i++) {
  render(filmListTopRatedContainer, createFilmCardTemplate(), `beforeend`);
}

const filmListMostCommented = siteMainElement.querySelectorAll(`.films-list--extra`)[1];
const filmListMostCommentedContainer = filmListMostCommented.querySelector(`.films-list__container`);

for (let i = 0; i < EXTRA_COUNT; i++) {
  render(filmListMostCommentedContainer, createFilmCardTemplate(), `beforeend`);
}

render(siteFooterElement, createPopUpTemplate(), `afterend`);
