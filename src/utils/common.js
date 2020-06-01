import moment from "moment";
const MS_IN_MINUTES = 60000;
const MINUTES_IN_HOUR = 60;

export const capitalize = (str) => str.replace(/(^|\s)\S/g, (a) => a.toUpperCase());

export const formatTime = (duration) => `${moment.utc(duration * MS_IN_MINUTES).format(`HH`)}h ${moment.utc(duration * MS_IN_MINUTES).format(`mm`)}m`;

export const formatDateRelease = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDateComment = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

export const formatDuration = (minutes) => [Math.floor(minutes / MINUTES_IN_HOUR), minutes - MINUTES_IN_HOUR * Math.floor(minutes / MINUTES_IN_HOUR)]; // через момент более громоздко

export const getDurationWatchedFilms = (filmCards) => {
  return filmCards.reduce((accumulator, filmCard) => {
    accumulator = accumulator + filmCard.duration;
    return accumulator;
  }, 0);
};
