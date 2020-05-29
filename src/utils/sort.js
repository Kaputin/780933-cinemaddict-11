export const sortDiscussed = (arr) => arr.filter((item) => item.comments.length > 0).sort((a, b) => b.comments.length - a.comments.length);
export const sortRating = (arr) => arr.filter((item) => item.rating > 0).sort((a, b) => b.rating - a.rating);
