import FilmCard from "../components/film-card.js";
import PopUp from "../components/pop-up.js";
import {generateComments} from "../mock/comments.js";
import {render, RenderPosition, replace} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class MovieController {
  constructor(container, footerContainer, onDataChange, onViewChange) {
    this._filmListContainer = container;
    this._footerContainer = footerContainer;
    this._onDataChange = onDataChange;

    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._filmCardElement = null;
    this._comments = null;
    this._popUp = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onOpenPopupClick = this._onOpenPopupClick.bind(this);
    this._onClosePopupClick = this._onClosePopupClick.bind(this);
    this._onWatchlistChange = this._onWatchlistChange.bind(this);
    this._onWatchedChange = this._onWatchedChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
  }

  render(filmCard) {
    this._filmCard = filmCard;
    this._comments = generateComments(this._filmCard.commentsCount);
    const oldFilmCardElement = this._filmCardElement;
    const oldPopUp = this._popUp;
    this._filmCardElement = new FilmCard(this._filmCard);
    this._popUp = new PopUp(this._filmCard, this._comments);


    this._filmCardElement.setCardTitleClickHandler(this._onOpenPopupClick);
    this._filmCardElement.setCardPosterClickHandler(this._onOpenPopupClick);
    this._filmCardElement.setCardCommentsClickHandler(this._onOpenPopupClick);

    this._filmCardElement.setWatchListButtonClickHandler(this._onWatchlistChange);
    this._filmCardElement.setWatchedButtonClickHandler(this._onWatchedChange);
    this._filmCardElement.setFavoritesButtonClickHandler(this._onFavoriteChange);

    this._popUp.setWatchListLabelClickHandler(this._onWatchlistChange);
    this._popUp.setWatchedLabelClickHandler(this._onWatchedChange);
    this._popUp.setFavoritesLabelClickHandler(this._onFavoriteChange);

    if (oldPopUp && oldFilmCardElement) {
      replace(this._filmCardElement, oldFilmCardElement);
      replace(this._popUp, oldPopUp);
      document.addEventListener(`keydown`, this._onEscKeyDown); // временное решение, т.к. пока не знаю как связать реренд попапа и карточки, карточки в других блоках, меню количество
      this._popUp.setCloseButtonClickHandler(this._onClosePopupClick); // вторая проблема esc вешается на неоткрытый попап когда маленькая карточка заменяется
    } else {
      render(this._filmListContainer, this._filmCardElement, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removePopUp();
    }
  }

  _addPopUp() {
    this._onViewChange();
    this._mode = Mode.EDIT;
    this._footerContainer.appendChild(this._popUp.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._popUp.setCloseButtonClickHandler(this._onClosePopupClick);
    this._filmCardElement.removeCardTitleClickHandler(this._onOpenPopupClick);
    this._filmCardElement.removeCardPosterClickHandler(this._onOpenPopupClick);
    this._filmCardElement.removeCardCommentsClickHandler(this._onOpenPopupClick);
  }

  _removePopUp() {
    this._mode = Mode.DEFAULT;
    this._footerContainer.removeChild(this._popUp.getElement());
    this._filmCardElement.setCardTitleClickHandler(this._onOpenPopupClick);
    this._filmCardElement.setCardPosterClickHandler(this._onOpenPopupClick);
    this._filmCardElement.setCardCommentsClickHandler(this._onOpenPopupClick);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._popUp.removeCloseButtonClickHandler(this._onClosePopupClick);
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
}
