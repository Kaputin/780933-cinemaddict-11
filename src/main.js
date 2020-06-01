import API from "./api.js";
import Rating from "./components/rating.js";
import FilterController from "./controllers/filter.js";
import Navigation from "./components/navigation.js";
import Sort from "./components/sort.js";
import Statistic from "./components/statistic.js";
import {MenuItem, AUTHORIZATION, END_POINT} from "./const.js";

import Content from "./components/content.js";
import PageController from "./controllers/page-controller.js";
import FooterStatistics from "./components/footer-statistics.js";
import MoviesModel from "./models/movies.js";
import {render, RenderPosition} from "./utils/render.js";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteDocElement = document.querySelector(`body`);
const siteFooterStatistics = siteFooterElement.querySelector(`.footer__statistics`);

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();
const ratingComponent = new Rating(moviesModel);
const navigationComponent = new Navigation();
const sort = new Sort();
const content = new Content();
const contentController = new PageController(content, siteDocElement, sort, moviesModel, ratingComponent);
const statistic = new Statistic(moviesModel, ratingComponent);


render(siteMainElement, navigationComponent, RenderPosition.BEFOREEND);
const siteNavigationElements = siteMainElement.querySelector(`.main-navigation`);
const filterController = new FilterController(siteNavigationElements, moviesModel);
filterController.render();

render(siteMainElement, sort, RenderPosition.BEFOREEND);
render(siteMainElement, content, RenderPosition.BEFOREEND);
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

api.getfilmCards()
  .then((filmCards) => {
    moviesModel.setFilmCards(filmCards);
    contentController.render();
    render(siteHeaderElement, ratingComponent, RenderPosition.BEFOREEND);
    render(siteFooterStatistics, new FooterStatistics(filmCards), RenderPosition.BEFOREEND);
  });

// открываю задание 8.2
