import moment from "moment";
const MS_IN_MINUTES = 60000;
const MINUTES_IN_HOUR = 60;

export const capitalize = (str) => {
  return str.replace(/(^|\s)\S/g, (a) => {
    return a.toUpperCase();
  });
};

export const formatTime = (duration) => { // сделал через момент, как просит ТЗ
  const formatDuration = moment.utc(duration * MS_IN_MINUTES).format(`hh`) + `h ` + moment.utc(duration * MS_IN_MINUTES).format(`mm`) + `m`;
  return formatDuration;
};

export const formatDateRelease = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDateComment = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

export const formatDuration = (minutes) => { // разбил согласно разметке
  const hour = Math.floor(minutes / MINUTES_IN_HOUR); // получаем целое число часво
  const minute = minutes - MINUTES_IN_HOUR * hour; // получаем оставшееся число минут
  return [hour, minute];
};

export const getDurationWatchedFilms = (filmCards) => {
  return filmCards.reduce((accumulator, filmCard) => {
    accumulator = accumulator + filmCard.duration;
    return accumulator;
  }, 0);
};
