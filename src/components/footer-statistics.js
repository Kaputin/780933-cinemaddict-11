import AbstractComponent from "./abstract-component.js";

const createFooterStatisticsTemplate = (count) => {
  return (
    `<p>${count.toLocaleString(`ru`)} movies inside</p>`
  );
};

export default class FooterStatistics extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._count);
  }
}
