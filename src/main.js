const FILM_COUNT = 16;

import RatingProfile from "./components/rating.js";
import SiteMenu from "./components/site-menu.js";
import Sort from "./components/sort.js";
import Content from "./components/content.js";
import PageController from "./controllers/PageController.js";
import FooterStatistics from "./components/footer-statistics.js";
import {generateFilmCards} from "./mock/film-card.js";
import {generateMenuItems} from "./mock/site-menu.js";
import {render, RenderPosition} from "./utils/render.js";


const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
// const siteDocElement = document.querySelector(`body`); Только сейчас понял, что поап появляется в футере, который я передаю, может тогда передавать боди, чтобы он появлялся после футера?
// как в марапе, но тогда он появляется после скриптов
const siteFooterStatistics = siteFooterElement.querySelector(`.footer__statistics`);


const filmCards = generateFilmCards(FILM_COUNT);
const menuItems = generateMenuItems(filmCards);

render(siteHeaderElement, new RatingProfile(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenu(menuItems), RenderPosition.BEFOREEND);
const sort = new Sort();
render(siteMainElement, sort, RenderPosition.BEFOREEND); // Добавил сортировку

const content = new Content();
render(siteMainElement, content, RenderPosition.BEFOREEND);
const contentController = new PageController(content, siteFooterElement, sort);
contentController.render(filmCards);
render(siteFooterStatistics, new FooterStatistics(FILM_COUNT), RenderPosition.BEFOREEND);
