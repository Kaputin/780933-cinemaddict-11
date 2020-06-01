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
  getTemplate() {
    return createNavigationTemplate();
  }

  _unsetActiveClass() {
    document.querySelector(`.main-navigation__item--active`).classList
        .remove(`main-navigation__item--active`);
  }

  setNavigationChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      this._unsetActiveClass();
      evt.target.classList.add(`main-navigation__item--active`);
      handler(evt.target.dataset.navigation);
    });
  }
}
