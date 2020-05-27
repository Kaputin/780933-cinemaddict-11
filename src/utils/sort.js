export const sortDiscussed = (arr) => {
  return arr.slice().sort(function (a, b) {
    return b.comments.length - a.comments.length;
  });
};

export const sortRating = (arr) => {
  return arr.slice().sort(function (a, b) {
    return b.rating - a.rating;
  });
};
