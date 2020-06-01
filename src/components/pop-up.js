import AbstractSmartComponent from "./abstract-smart-component.js";
import {formatTime, formatDateRelease, formatDateComment} from "../utils/common.js";
import {encode} from "he";

const createCheckboxMarkup = (name, isActive) => {
  return (`<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${isActive ? `checked` : ``}>`);
};

const createCommentMarkup = (comment) => {
  const {id, emoji, text, author, date} = comment;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formatDateComment(date)}</span>
          <button data-comment-id="${id}" class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createGenreMarkup = (genre) => {
  return (
    `<span class="film-details__genre">${genre}</span>`
  );
};

const createEmojiMarkup = (emoji) => emoji ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="${emoji}">` : ``;

const createPopUpTemplate = (filmCard, comments, emoji) => {
  const {title, alternativeTitle, rating, genre, date, duration, poster, description, writers, actors, country, ageLimit, director} = filmCard;

  const watchListCheckbox = createCheckboxMarkup(`watchlist`, filmCard.isWatchlist);
  const watchedCheckbox = createCheckboxMarkup(`watched`, filmCard.isWatched);
  const favoritesCheckbox = createCheckboxMarkup(`favorite`, filmCard.isFavorite);

  const commentsMarkup = comments.map((it) => createCommentMarkup(it)).join(`\n`);
  const genresMarkup = genre.map((it) => createGenreMarkup(it)).join(`\n`);

  let genres = ``;

  if (genre.length > 1) {
    genres = `Genres`;
  } else {
    genres = `Genre`;
  }

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageLimit}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatDateRelease(date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatTime(duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genres}</td>
                  <td class="film-details__cell">
                    ${genresMarkup}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${watchListCheckbox}
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            ${watchedCheckbox}
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            ${favoritesCheckbox}
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
              ${createEmojiMarkup(emoji)}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};


export default class PopUp extends AbstractSmartComponent {
  constructor(filmCard, comments) {
    super();

    this._filmCard = filmCard;
    this._comments = comments;

    this._addCloseButtonHandler = null;
    this._addWatchListLabelonHandler = null;
    this._addWatchedLabelonHandler = null;
    this._addFavoritesLabelonHandler = null;
    this._addDeleteCommentonHandler = null;
    this._addCommentonHandler = null;
    this._emoji = null;
    this._subscribeOnEvents();
    this._rerenderEmoji();

  }

  getTemplate() {
    return createPopUpTemplate(this._filmCard, this._comments, this._emoji);
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._addCloseButtonHandler);
    this.setWatchListLabelClickHandler(this._addWatchListLabelonHandler);
    this.setWatchedLabelClickHandler(this._addWatchedLabelonHandler);
    this.setFavoritesLabelClickHandler(this._addFavoritesLabelonHandler);
    this.setDeleteCommentClickHandler(this._addDeleteCommentonHandler);
    this.setAddCommentKeydownHandler(this._addCommentonHandler);
    this._subscribeOnEvents();
    this.getComments();
  }

  rerender() {
    super.rerender();
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
    this._addCloseButtonHandler = handler;
    return this;
  }

  setWatchListLabelClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);
    this._addWatchListLabelonHandler = handler;
    return this;
  }

  setWatchedLabelClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);
    this._addWatchedLabelonHandler = handler;
    return this;
  }


  setFavoritesLabelClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);
    this._addFavoritesLabelonHandler = handler;
    return this;
  }

  _subscribeOnEvents() {
    this._rerenderEmoji();
  }

  _createEmoji(emoji) {
    const emojiConteiner = this.getElement().querySelector(`.film-details__add-emoji-label`);
    emojiConteiner.innerHTML = createEmojiMarkup(emoji);
    emojiConteiner.style.border = ``;
  }

  _rerenderEmoji() {
    this.getElement().querySelectorAll(`.film-details__emoji-item`).forEach((it) => {
      it.addEventListener(`click`, (evt) => {
        this._createEmoji(evt.target.value);
      });
    });
  }

  _resetCommentInput() {
    const commentConteiner = this.getElement().querySelector(`.film-details__comment-input`);
    commentConteiner.value = ``;
    commentConteiner.style.border = ``;
  }

  _resetCommentLabel() {
    const emojiConteiner = this.getElement().querySelector(`.film-details__add-emoji-label`);
    emojiConteiner.innerHTML = ``;
  }

  resetComment() {
    this._resetCommentInput();
    this._resetCommentLabel();
    this.getElement().querySelectorAll(`.film-details__emoji-item`).forEach((it) => {
      it.checked = false;
    });
  }

  setDeleteCommentClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`)
      .addEventListener(`click`, handler);
    this._addDeleteCommentonHandler = handler;
    return this;
  }

  getNewComment() {
    const text = this.getElement().querySelector(`.film-details__comment-input`);
    const emoji = this.getElement().querySelector(`.film-details__add-emoji-label img`);
    if (!emoji) {
      return false;
    }

    const promo = {
      comment: encode(text.value),
      date: new Date(),
      emotion: emoji.alt
    };

    return promo;
  }

  setAddCommentKeydownHandler(handler) {
    this.getElement().querySelector(`.film-details__inner`)
      .addEventListener(`keydown`, handler);
    this._addCommentonHandler = handler;
    return this;
  }
}
