const sortDiscussed = (arr) => {
  return arr.slice().sort(function (a, b) {
    return b.commentsCount - a.commentsCount;
  });
};

const sortRating = (arr) => {
  return arr.slice().sort(function (a, b) {
    return b.rating - a.rating;
  });
};

export {sortDiscussed, sortRating};
