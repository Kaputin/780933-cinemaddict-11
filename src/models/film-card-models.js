export default class FilmCard {
  constructor(data) {
    this.id = data[`id`];
    this.title = data.film_info[`title`];
    this.alternativeTitle = data.film_info[`alternative_title`];
    this.rating = data.film_info[`total_rating`];
    this.date = data.film_info.release[`date`] ? new Date(data.film_info.release[`date`]) : null;
    this.duration = data.film_info[`runtime`];
    this.genre = data.film_info[`genre`];
    this.poster = data.film_info[`poster`];
    this.description = data.film_info[`description`];
    this.comments = data[`comments`];
    this.isWatchlist = Boolean(data.user_details[`watchlist`]);
    this.isWatched = Boolean(data.user_details[`already_watched`]);
    this.watchingDate = data.user_details[`watching_date`] ? new Date(data.user_details[`watching_date`]) : null;
    this.isFavorite = Boolean(data.user_details[`favorite`]);
    this.writers = data.film_info[`writers`];
    this.actors = data.film_info[`actors`];
    this.country = data.film_info.release[`release_country`];
    this.ageLimit = data.film_info[`age_rating`];
    this.director = data.film_info[`director`];
  }

  filmCardToRAW() {
    return {
      "comments": this.comments,
      "film_info": {
        "actors": this.actors,
        "age_rating": this.ageLimit,
        "alternative_title": this.alternativeTitle,
        "description": this.description,
        "director": this.director,
        "genre": this.genre,
        "poster": this.poster,
        "release": {
          "date": this.date.toISOString(),
          "release_country": this.country
        },
        "runtime": this.duration,
        "title": this.title,
        "total_rating": Number(this.rating),
        "writers": this.writers
      },
      "id": this.id,
      "user_details": {
        "already_watched": this.isWatched,
        "favorite": this.isFavorite,
        "watching_date": this.watchingDate ? this.watchingDate.toISOString() : null,
        "watchlist": this.isWatchlist
      }
    };
  }

  static clone(data) {
    const newFilmCard = new FilmCard(data.filmCardToRAW());
    return newFilmCard;
  }

  static parseFilmCard(data) {
    return new FilmCard(data);
  }

  static parseFilmCards(data) {
    return data.map(FilmCard.parseFilmCard);
  }
}
