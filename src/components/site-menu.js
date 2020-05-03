import AbstractComponent from "./abstract-component.js";

const capitalize = (str) => {
  return str.replace(/(^|\s)\S/g, (a) => {
    return a.toUpperCase();
  });
};

const createMenuItemMarkup = (name, count) => {

  if (name === `all`) {
    return (
      `<a href="#${name}" data-filter-type="${name}" class="main-navigation__item main-navigation__item--active">${capitalize(name)} movies</a>`
    );
  } else {
    return (
      `<a href="#${name}"data-filter-type="${name}" class="main-navigation__item">${capitalize(name)} <span class="main-navigation__item-count">${count}</span></a>`
    );
  }
};


const createSiteMenuTemplate = (menuItems) => {
  const siteMenuMarkup = menuItems.map((it) => createMenuItemMarkup(it.name, it.count)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${siteMenuMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
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

      const filterName = evt.target.dataset.filterType;

      const items = document.querySelectorAll(`.main-navigation__item`);
      Array.from(items).forEach((item) => {
        item.classList.remove(`main-navigation__item--active`);
      });

      evt.target.classList.add(`main-navigation__item--active`);

      handler(filterName);
    });
  }
}
