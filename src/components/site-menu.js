import AbstractComponent from "./abstract-component.js";
import {MenuItem} from "../const.js";
import {capitalize} from "../utils/common.js";

const createMenuItemMarkup = (name, count, isActive) => {
  return (
    `<a href="#${name}"data-filter-type="${name}" data-navigation="${MenuItem.FILMS}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
    ${capitalize(name).replace(/-/g, ` `)} ${name === `all-movies` ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>`
  );
};

const createSiteMenuTemplate = (menuItems) => {
  const siteMenuMarkup = menuItems.map((it) => createMenuItemMarkup(it.name, it.count, it.isActive)).join(`\n`);

  return (
    `<div class="main-navigation__items">
        ${siteMenuMarkup}
      </div>`
  );
};

export default class SiteMenu extends AbstractComponent {
  constructor(menuItems) {
    super();

    this._menuItems = menuItems;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._menuItems);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      handler(evt.target.dataset.filterType);
    });
  }
}
