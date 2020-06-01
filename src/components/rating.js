import AbstractSmartComponent from "./abstract-smart-component";
import {getWatchedFilmCards} from "../utils/filter.js";

const RATINGS = {
  NO_RATING: 0,
  NOVICE: 10,
  FAN: 20,
  MOVIE_BUFF: 20
};

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
      case numberWatchedFilmCards <= RATINGS.NO_RATING:
        return ``;
      case numberWatchedFilmCards <= RATINGS.NOVICE:
        return `Novice`;
      case numberWatchedFilmCards <= RATINGS.FAN:
        return `Fan`;
      case numberWatchedFilmCards > RATINGS.MOVIE_BUFF:
        return `Movie Buff`;
      default:
        return `Error`;
    }
  }
}
