import API from '../api.js';
import Comments from '../models/comments.js';
import FilmCardModel from '../models/film-card-models.js';
import FilmCard from "../components/film-card.js";
import PopUp from "../components/pop-up.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {AUTHORIZATION, END_POINT} from "../const.js";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, bodyContainer, onDataChange, onViewChange) {
    this._filmListContainer = container;
    this._bodyContainer = bodyContainer;
    this._onDataChange = onDataChange;
    this._api = new API(END_POINT, AUTHORIZATION);
    this._commentsModel = new Comments();
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

    this._filmCardElement.setCardTitleClickHandler(this._onOpenPopupClick)
      .setCardPosterClickHandler(this._onOpenPopupClick)
      .setCardCommentsClickHandler(this._onOpenPopupClick)
      .setWatchListButtonClickHandler(this._onWatchlistChange)
      .setWatchedButtonClickHandler(this._onWatchedChange)
      .setFavoritesButtonClickHandler(this._onFavoriteChange);

    this._api.getComments(this._filmCard.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._popUp = new PopUp(this._filmCard, this._commentsModel.getComments());
        this._popUp.setWatchListLabelClickHandler(this._onWatchlistChange)
          .setWatchedLabelClickHandler(this._onWatchedChange)
          .setFavoritesLabelClickHandler(this._onFavoriteChange)
          .setDeleteCommentClickHandler(this._onDeleteCommentClick)
          .setAddCommentKeydownHandler(this._onAddCommentKeydown)
          .setCloseButtonClickHandler(this._onClosePopupClick);

        if (oldPopUp && oldFilmCardElement) {
          replace(this._popUp, oldPopUp);
        }
      });

    if (oldPopUp && oldFilmCardElement) {
      replace(this._filmCardElement, oldFilmCardElement);
    } else {
      render(this._filmListContainer, this._filmCardElement, RenderPosition.BEFOREEND);
    }
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
    render(this._bodyContainer, this._popUp, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _removePopUp() {
    this._popUp.resetComment();
    this._bodyContainer.removeChild(this._popUp.getElement());
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
    const newFilmCard = FilmCardModel.clone(this._filmCard);
    newFilmCard.isWatchlist = !newFilmCard.isWatchlist;
    this._api.updatefilmCard(this._filmCard.id, newFilmCard)
      .then((moviesModel) => {
        this._onDataChange(this, this._filmCard, moviesModel);
      });
  }

  _onWatchedChange(evt) {
    evt.preventDefault();
    const newFilmCard = FilmCardModel.clone(this._filmCard);
    newFilmCard.isWatched = !newFilmCard.isWatched;
    newFilmCard.watchingDate = new Date();
    this._api.updatefilmCard(this._filmCard.id, newFilmCard)
      .then((moviesModel) => {
        this._onDataChange(this, this._filmCard, moviesModel);
      });
  }

  _onFavoriteChange(evt) {
    evt.preventDefault();
    const newFilmCard = FilmCardModel.clone(this._filmCard);
    newFilmCard.isFavorite = !newFilmCard.isFavorite;
    this._api.updatefilmCard(this._filmCard.id, newFilmCard)
      .then((moviesModel) => {
        this._onDataChange(this, this._filmCard, moviesModel);
      });
  }

  _onDeleteCommentClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `BUTTON`) {
      return;
    }
    this._api.deleteComment(evt.target.dataset.commentId)
      .then(() => {
        this._onDataChange(this, this._filmCard, null, evt.target.dataset.commentId);
      });
  }

  _onAddCommentKeydown(evt) {
    const isCombination = evt.key === `Enter` && evt.ctrlKey;
    if (isCombination) {
      const newComment = this._popUp.getNewComment();
      if (newComment) {
        const newFilmCard = FilmCardModel.clone(this._filmCard);
        this._api.addComment(newFilmCard, newComment)
            .then(({movie}) => {
              this._onDataChange(this, null, newFilmCard, movie.comments);
            });
      } else {
        return;
      }
    }
  }

  getFilm() {
    return this._filmCardElement.getFilmCardData();
  }
  getFilmById() {
    return this._filmCardElement.getFilmCardId();
  }
}
