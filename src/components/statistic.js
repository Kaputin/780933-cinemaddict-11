import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {FilterType, StatisticMenu, GENRES, DateDuration} from "../const.js";
import {getFilmCardsByFilter} from "../utils/filter.js";
import {formatDuration, getDurationWatchedFilms, capitalize} from "../utils/common.js";

const getDateFrom = (activeStatisticMenu) => {
  let dateFrom = new Date(0);
  const dateTo = new Date();

  switch (activeStatisticMenu) {
    case StatisticMenu.ALL:
      dateFrom = new Date(0);
      break;
    case StatisticMenu.MONTH:
      dateFrom = dateTo.setMonth(dateTo.getMonth() - DateDuration.ONE_MONTH);
      break;
    case StatisticMenu.TODAY:
      dateFrom = dateTo.setDate(dateTo.getDate() - DateDuration.ONE_DAY);
      break;
    case StatisticMenu.WEEK:
      dateFrom = dateTo.setDate(dateTo.getDate() - DateDuration.ONE_WEEK);
      break;
    case StatisticMenu.YEAR:
      dateFrom = dateTo.setFullYear(dateTo.getFullYear() - DateDuration.ONE_YEAR);
      break;
  }

  return dateFrom;
};

const getCountGenre = (filmCards, genre) => {
  return filmCards.reduce((accumulator, filmCard) => {
    accumulator = accumulator + filmCard.genre.some((genreFilmCard) => genreFilmCard === genre);
    return accumulator;
  }, 0);
};


const getFilmCardGenres = (watchedFilmCards) => Object.values(GENRES).map((genre) => {
  return {
    genreName: genre,
    count: getCountGenre(watchedFilmCards, genre),
  };
});

const sortFilmCardGenres = (filmCardGenres) => filmCardGenres.sort((a, b) => b.count - a.count);

const getFilmCardsByTime = (filmCards, dateFrom) => {
  return filmCards.filter((filmCard) => filmCard.watchingDate >= new Date(dateFrom));
};


const renderChart = (statisticCtx, sortedFilmCardGenres) => {
  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * sortedFilmCardGenres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: sortedFilmCardGenres.map((sortedFilmCardGenre) => sortedFilmCardGenre.genreName),
      datasets: [{
        data: sortedFilmCardGenres.map((sortedFilmCardGenre) => sortedFilmCardGenre.count),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticMenuMarkup = (statisticMenuItem, isChecked) => {
  if (statisticMenuItem === `all-time`) {
    return (
      `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${statisticMenuItem}" value="${statisticMenuItem}" ${isChecked ? `checked` : ``}>
      <label for="statistic-${statisticMenuItem}" class="statistic__filters-label">All time</label>`
    );
  } else {
    return (
      `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${statisticMenuItem}" value="${statisticMenuItem}" ${isChecked ? `checked` : ``}>
      <label for="statistic-${statisticMenuItem}" class="statistic__filters-label">${capitalize(statisticMenuItem)}</label>`
    );
  }
};

const createStatisticsTemplate = (filmCards, activeStatisticMenu, topGenreName, profileRating) => {
  const statisticMenuMarkup = Object.values(StatisticMenu).map((statisticMenuItem) => createStatisticMenuMarkup(statisticMenuItem, statisticMenuItem === activeStatisticMenu)).join(`\n`);
  const durationWatchedFilms = getDurationWatchedFilms(filmCards);
  const [hours, minutes] = formatDuration(durationWatchedFilms);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${profileRating}</span>
      </p>
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${statisticMenuMarkup}
      </form>
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${filmCards.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenreName}</p>
        </li>
      </ul>
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(moviesModel, profileRating) {
    super();

    this._moviesModel = moviesModel;
    this._profileRating = profileRating;

    this._dateFrom = new Date(0);
    this._filmCards = this._moviesModel.getFilmCardsAll();

    this._statisticChart = null;
    this._topGenreName = ``;
    this._activeStatisticMenu = StatisticMenu.ALL;

    this.show();

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmCards, this._activeStatisticMenu, this._topGenreName, this._profileRating);
  }

  show() {
    super.show();

    this._filmCards = this._moviesModel.getFilmCardsAll();
    this._filmCards = getFilmCardsByFilter(this._filmCards, FilterType.HISTORY);
    this._filmCards = getFilmCardsByTime(this._filmCards, this._dateFrom);
    if (this._filmCards.length === 0) {
      this._topGenreName = ``;
      this._sortedFilmCardGenresExisting = null;
      this._resetCharts();
    } else {
      const filmCardGenres = getFilmCardGenres(this._filmCards);
      const sortedFilmCardGenres = sortFilmCardGenres(filmCardGenres);
      this._sortedFilmCardGenresExisting = sortedFilmCardGenres.filter((sortedFilmCardGenre) => sortedFilmCardGenre.count > 0);
      this._topGenreName = sortedFilmCardGenres[0].genreName;
    }
    this.rerender();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    if (this._sortedFilmCardGenresExisting) {
      const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
      this._statisticChart = renderChart(statisticCtx, this._sortedFilmCardGenresExisting);
    }
  }

  _resetCharts() {
    if (this._statisticChart) {
      this._statisticChart.destroy();
      this._statisticChart = null;
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    element.querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {
      const target = evt.target;
      if (target && target.value) {
        this._activeStatisticMenu = target.value;
        this._dateFrom = getDateFrom(this._activeStatisticMenu);
        this.show();
      }
    });
  }
}
