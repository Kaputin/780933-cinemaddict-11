import AbstractComponent from "./abstract-component.js";


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

  const {title, rating, date, duration, genre, poster, description, commentsCount} = filmCard;

  const watchListButton = createButtonMarkup(`add-to-watchlist`, !filmCard.isWatchlist);
  const watchedButton = createButtonMarkup(`mark-as-watched`, !filmCard.isWatched);
  const favoritesButton = createButtonMarkup(`favorite`, !filmCard.isFavorite);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${date.YEARS}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre.join(` `)}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsCount.length} comments</a>
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

  setCardTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, handler);
  }

  removeCardTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`)
      .removeEventListener(`click`, handler);
  }

  setCardPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, handler);
  }

  removeCardPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
      .removeEventListener(`click`, handler);
  }

  setCardCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, handler);
  }

  removeCardCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`)
      .removeEventListener(`click`, handler);
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
