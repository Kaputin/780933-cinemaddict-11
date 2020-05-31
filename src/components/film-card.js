import AbstractComponent from "./abstract-component.js";
import {formatTime} from "../utils/common.js";

const createButtonMarkup = (name, isActive = true) => {
  if (name === `add-to-watchlist`) {
    return (`<button class="film-card__controls-item button film-card__controls-item--${name} ${isActive ? `film-card__controls-item--active` : ``}">Add to watchlist</button>`);
  } else if (name === `mark-as-watched`) {
    return (`<button class="film-card__controls-item button film-card__controls-item--${name} ${isActive ? `film-card__controls-item--active` : ``}">Mark as watched</button>`);
  } else if (name === `favorite`) {
    return (`<button class="film-card__controls-item button film-card__controls-item--${name} ${isActive ? `film-card__controls-item--active` : ``}">Mark as favorite</button>`);
  }
  return null;
};


const createFilmCardTemplate = (filmCard) => {

  const {title, rating, date, duration, genre, poster, description, comments} = filmCard;

  const watchListButton = createButtonMarkup(`add-to-watchlist`, filmCard.isWatchlist);
  const watchedButton = createButtonMarkup(`mark-as-watched`, filmCard.isWatched);
  const favoritesButton = createButtonMarkup(`favorite`, filmCard.isFavorite);
  let descriptionNew = description;

  if (description.length >= 140) {
    descriptionNew = description.substr(0, 139) + `...`;
  }

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${date.getFullYear()}</span>
        <span class="film-card__duration">${formatTime(duration)}</span>
        <span class="film-card__genre">${genre.join(` `)}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptionNew}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
      ${watchListButton}
      ${watchedButton}
      ${favoritesButton}
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(filmCard) {
    super();

    this._filmCard = filmCard;
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmCard);
  }

  getFilmCardData() {
    return this._filmCard;
  }

  getFilmCardId() {
    return this._filmCard.id;
  }

  setCardTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, handler);
  }

  setCardPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, handler);
  }

  setCardCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, handler);
  }

  setWatchListButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

}
