import AbstractComponent from "./abstract-component.js";

export const SortType = {
  DATE: `date`,
  RATING: `rating`,
  DEFAULT: `default`,
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currenSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      const items = document.querySelectorAll(`.sort__button`);
      items.forEach((item) => {
        item.classList.remove(`sort__button--active`);
      });

      evt.target.classList.add(`sort__button--active`);

      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }

  sortTypeReset() {
    const items = document.querySelectorAll(`.sort__button`);

    Array.from(items).forEach((item) => {
      item.classList.remove(`sort__button--active`);
    });

    this._currenSortType = items[0].dataset.sortType;

    items[0].classList.add(`sort__button--active`);
  }
}
