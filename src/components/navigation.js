import AbstractComponent from "./abstract-component.js";
import {MenuItem} from "../const.js";

const createNavigationTemplate = () => {
  return (
    `<nav class="main-navigation">
      <a href="#stats" data-navigation="${MenuItem.STATS}" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Navigation extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createNavigationTemplate();
  }


  setNavigationChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      const activeItem = document.querySelector(`.main-navigation__item--active`);
      activeItem.classList.remove(`main-navigation__item--active`);
      evt.target.classList.add(`main-navigation__item--active`);
      const navigationName = evt.target.dataset.navigation;
      handler(navigationName);
    });
  }
}
