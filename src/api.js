import FilmCard from "./models/film-card-models.js";
import Comment from "./models/comment.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getfilmCards() {
    return this._load({url: `movies`})
    .then((response) => response.json())
    .then(FilmCard.parseFilmCards);
  }

  getComments(filmCardsId) {
    return this._load({url: `comments/${filmCardsId}`})
    .then((response) => response.json())
    .then(Comment.parseComments);
  }

  updatefilmCard(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.filmCardToRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then((response) => response.json())
    .then(FilmCard.parseFilmCard);
  }

  deletefilmCard(id) {
    return this._load({url: `comments/${id}`, method: Method.DELETE});
  }

  addComment(movieData, commentData) {
    return this._load({
      url: `comments/${movieData.id}`,
      method: Method.POST,
      body: JSON.stringify(commentData),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then((response) => response.json())
    .then(({movie}) => {
      return {
        movie: FilmCard.parseFilmCard(movie)
      };
    });
  }


  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
    .then(checkStatus)
    .catch((err) => {
      throw err;
    });
  }
};

export default API;
