import FilmCard from "../components/film-card.js";
import PopUp from "../components/pop-up.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, footerContainer, onDataChange, onViewChange) {
    this._filmListContainer = container;
    this._footerContainer = footerContainer;
    this._onDataChange = onDataChange;

    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._filmCardElement = null;
    this._popUp = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onOpenPopupClick = this._onOpenPopupClick.bind(this);
    this._onClosePopupClick = this._onClosePopupClick.bind(this);
    this._onDeleteCommentClick = this._onDeleteCommentClick.bind(this);
    this._onAddCommentKeydown = this._onAddCommentKeydown.bind(this);
    this._onWatchlistChange = this._onWatchlistChange.bind(this);
    this._onWatchedChange = this._onWatchedChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);

  }

  render(filmCard) {
    this._filmCard = filmCard;

    const oldFilmCardElement = this._filmCardElement;
    const oldPopUp = this._popUp;
    this._filmCardElement = new FilmCard(this._filmCard);

    this._popUp = new PopUp(this._filmCard);

    if (oldPopUp && oldFilmCardElement) {
      replace(this._filmCardElement, oldFilmCardElement);
      replace(this._popUp, oldPopUp);
    } else {
      render(this._filmListContainer, this._filmCardElement, RenderPosition.BEFOREEND);
    }

    this._filmCardElement.setCardTitleClickHandler(this._onOpenPopupClick);
    this._filmCardElement.setCardPosterClickHandler(this._onOpenPopupClick);
    this._filmCardElement.setCardCommentsClickHandler(this._onOpenPopupClick);

    this._filmCardElement.setWatchListButtonClickHandler(this._onWatchlistChange);
    this._filmCardElement.setWatchedButtonClickHandler(this._onWatchedChange);
    this._filmCardElement.setFavoritesButtonClickHandler(this._onFavoriteChange);

    this._popUp.setWatchListLabelClickHandler(this._onWatchlistChange);
    this._popUp.setWatchedLabelClickHandler(this._onWatchedChange);
    this._popUp.setFavoritesLabelClickHandler(this._onFavoriteChange);
    this._popUp.setDeleteCommentClickHandler(this._onDeleteCommentClick);
    this._popUp.setAddCommentKeydownHandler(this._onAddCommentKeydown);
    this._popUp.setCloseButtonClickHandler(this._onClosePopupClick);

  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removePopUp();
    }
  }

  destroy() {
    remove(this._filmCardElement);
    remove(this._popUp);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _addPopUp() {
    this._onViewChange();
    this._mode = Mode.POPUP;
    render(this._footerContainer, this._popUp, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _removePopUp() {
    this._popUp.resetComment();

    const body = document.querySelector(`body`);
    body.removeChild(this._popUp.getElement());

    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._removePopUp();
    }
  }

  _onOpenPopupClick() {
    this._addPopUp();
  }

  _onClosePopupClick() {
    this._removePopUp();
  }

  _onWatchlistChange(evt) {
    evt.preventDefault();
    this._onDataChange(this, this._filmCard, Object.assign({}, this._filmCard, {
      isWatchlist: !this._filmCard.isWatchlist,
    }));
  }

  _onWatchedChange(evt) {
    evt.preventDefault();
    this._onDataChange(this, this._filmCard, Object.assign({}, this._filmCard, {
      isWatched: !this._filmCard.isWatched,
    }));

  }

  _onFavoriteChange(evt) {
    evt.preventDefault();
    this._onDataChange(this, this._filmCard, Object.assign({}, this._filmCard, {
      isFavorite: !this._filmCard.isFavorite,
    }));
  }

  _onDeleteCommentClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `BUTTON`) {
      return;
    }

    const commentId = evt.target.dataset.commentId;
    this._onDataChange(this, this._filmCard, null, commentId);
  }

  _onAddCommentKeydown(evt) {
    const isCombination = evt.key === `Enter` && evt.ctrlKey;
    if (isCombination) {
      const text = document.querySelector(`.film-details__comment-input`);
      const emoji = document.querySelector(`.film-details__add-emoji-label img`);

      if (!emoji) {
        return;
      }

      const date = new Date();
      const promo = {
        id: String(new Date() + Math.random()),
        emoji: emoji.alt + `.png`,
        text: text.value,
        author: `ЯНИС`,
        date: {
          DAYS: date.getDate(),
          MONTHS: date.getMonth(),
          HOURS: date.getHours(),
          MINUTES: date.getMinutes(),
          YEARS: date.getFullYear()
        }
      };

      if (!promo.text) {
        return;
      }

      this._onDataChange(this, null, this._filmCard, promo);
    }
  }

  getFilm() {
    return this._filmCardElement.getFilmCardData();
  }

}
