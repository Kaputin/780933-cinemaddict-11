import AbstractSmartComponent from "./abstract-smart-component";
import {getWatchedFilmCards} from "../utils/filter.js";

const createProfileTemplate = (rating) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
  }

  getTemplate() {
    return createProfileTemplate(this.getRating());
  }

  recoveryListeners() {
    this.getTemplate();
  }

  getRating() {
    const numberWatchedFilmCards = getWatchedFilmCards(this._moviesModel.getFilmCardsAll()).length;

    switch (true) {
      case numberWatchedFilmCards <= 0:
        return ``;
      case numberWatchedFilmCards <= 10:
        return `Novice`;
      case numberWatchedFilmCards <= 20:
        return `Fan`;
      case numberWatchedFilmCards > 20:
        return `Movie Buff`;
      default:
        return `Error`;
    }
  }
}
