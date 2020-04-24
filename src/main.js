const FILM_COUNT = 16;

import RatingProfile from "./components/rating.js";
import SiteMenu from "./components/site-menu.js";
import Content from "./components/content.js";
import PageController from "./controllers/PageController.js";
import FooterStatistics from "./components/footer-statistics.js";
import {generateFilmCards} from "./mock/film-card.js";
import {generateMenuItems} from "./mock/site-menu.js";
import {render, RenderPosition} from "./utils/render.js";


const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteFooterStatistics = siteFooterElement.querySelector(`.footer__statistics`);


const filmCards = generateFilmCards(FILM_COUNT);
const menuItems = generateMenuItems(filmCards);

render(siteHeaderElement, new RatingProfile(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenu(menuItems), RenderPosition.BEFOREEND);
const content = new Content();
render(siteMainElement, content, RenderPosition.BEFOREEND);
const contentController = new PageController(content);
contentController.render(siteFooterElement, filmCards);
render(siteFooterStatistics, new FooterStatistics(FILM_COUNT), RenderPosition.BEFOREEND);
