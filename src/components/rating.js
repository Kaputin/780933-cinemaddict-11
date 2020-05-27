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

  rerender() {
    super.rerender();
  }

  getRating() {
    const numberWatchedFilmCards = getWatchedFilmCards(this._moviesModel.getFilmCardsAll()).length;

    let rating;

    switch (true) {
      case numberWatchedFilmCards <= 0:
        rating = ``;
        break;
      case numberWatchedFilmCards <= 10:
        rating = `Novice`;
        break;
      case numberWatchedFilmCards <= 20:
        rating = `Fan`;
        break;
      case numberWatchedFilmCards > 20:
        rating = `Movie Buff`;
        break;
      default:
        rating = `Error`;
    }
    return rating;
  }
}
