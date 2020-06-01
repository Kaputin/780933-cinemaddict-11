import AbstractComponent from "./abstract-component.js";


const createNoFilmsTemplate = () => `<h2 class="films-list__title">Loading...</h2>`;


export default class LoadingContent extends AbstractComponent {
  getTemplate() {
    return createNoFilmsTemplate();
  }
}
