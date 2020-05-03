export const sortDiscussed = (arr) => {
  return arr.slice().sort(function (a, b) {
    return b.commentsCount.length - a.commentsCount.length;
  });
};

export const sortRating = (arr) => {
  return arr.slice().sort(function (a, b) {
    return b.rating - a.rating;
  });
};
