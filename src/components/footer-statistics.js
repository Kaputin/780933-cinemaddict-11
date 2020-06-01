import AbstractComponent from "./abstract-component.js";

const createFooterStatisticsTemplate = (count) => {
  return (
    `<p>${count} movies inside</p>`
  );
};

export default class FooterStatistics extends AbstractComponent {
  constructor(filmsCards) {
    super();
    this._count = filmsCards.length;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._count);
  }
}
