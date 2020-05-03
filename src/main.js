const FILM_COUNT = 14;

import RatingProfile from "./components/rating.js";
// import SiteMenu from "./components/site-menu.js";
import FilterController from "./controllers/filter.js";
import Sort from "./components/sort.js";
import Content from "./components/content.js";
import PageController from "./controllers/PageController.js";
import FooterStatistics from "./components/footer-statistics.js";
import MoviesModel from "./models/movies.js";
import {generateFilmCards} from "./mock/film-card.js";
import {render, RenderPosition} from "./utils/render.js";


const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
// const siteDocElement = document.querySelector(`body`); // Только сейчас понял, что поап появляется в футере, который я передаю, может тогда передавать боди, чтобы он появлялся после футера?
// как в марапе, но тогда он появляется после скриптов
const siteFooterStatistics = siteFooterElement.querySelector(`.footer__statistics`);


const filmCards = generateFilmCards(FILM_COUNT);
const moviesModel = new MoviesModel();
moviesModel.setFilmCards(filmCards);

render(siteHeaderElement, new RatingProfile(), RenderPosition.BEFOREEND);
const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();
const sort = new Sort();
render(siteMainElement, sort, RenderPosition.BEFOREEND); // Добавил сортировку

const content = new Content();
render(siteMainElement, content, RenderPosition.BEFOREEND);
const contentController = new PageController(content, siteFooterElement, sort, moviesModel);
contentController.render(filmCards);
render(siteFooterStatistics, new FooterStatistics(FILM_COUNT), RenderPosition.BEFOREEND);
