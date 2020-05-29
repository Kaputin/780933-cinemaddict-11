const FILM_COUNT = 4;

import Rating from "./components/rating.js";
import FilterController from "./controllers/filter.js";
import Navigation from "./components/navigation.js";
import Sort from "./components/sort.js";
import Statistic from "./components/statistic.js";
import {MenuItem} from "./const.js";
import Content from "./components/content.js";
import PageController from "./controllers/PageController.js";
import FooterStatistics from "./components/footer-statistics.js";
import MoviesModel from "./models/movies.js";
import {generateFilmCards} from "./mock/film-card.js";
import {render, RenderPosition} from "./utils/render.js";


const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteDocElement = document.querySelector(`body`);
const siteFooterStatistics = siteFooterElement.querySelector(`.footer__statistics`);


const filmCards = generateFilmCards(FILM_COUNT);
const moviesModel = new MoviesModel();
moviesModel.setFilmCards(filmCards);

const ratingComponent = new Rating(moviesModel);
render(siteHeaderElement, ratingComponent, RenderPosition.BEFOREEND);

const navigationComponent = new Navigation();
render(siteMainElement, navigationComponent, RenderPosition.BEFOREEND);
const siteNavigationElements = siteMainElement.querySelector(`.main-navigation`);
const filterController = new FilterController(siteNavigationElements, moviesModel);
filterController.render();
const sort = new Sort();
render(siteMainElement, sort, RenderPosition.BEFOREEND);

const content = new Content();
render(siteMainElement, content, RenderPosition.BEFOREEND);
const contentController = new PageController(content, siteDocElement, sort, moviesModel, ratingComponent);
contentController.render(filmCards);
render(siteFooterStatistics, new FooterStatistics(FILM_COUNT), RenderPosition.BEFOREEND);

const statistic = new Statistic(moviesModel, ratingComponent);
render(siteMainElement, statistic, RenderPosition.BEFOREEND);
statistic.hide();

navigationComponent.setNavigationChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      contentController.hide();
      sort.hide();
      statistic.show();
      break;
    case MenuItem.FILMS:
      statistic.hide();
      contentController.show();
      sort.sortTypeReset();
      sort.show();
      break;
  }
});
