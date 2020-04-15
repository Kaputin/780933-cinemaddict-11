
const generateMenuItems = (filmCards) => {
  let watchlist = 0;
  let history = 0;
  let favorite = 0;
  const all = filmCards.length;

  for (let i of filmCards) {
    if (i.isFavorite === true) {
      favorite++;
    } if (i.isWatchlist === true) {
      watchlist++;
    } if (i.isWatched === true) {
      history++;
    }
  }

  return [{
    name: `All`,
    count: all,
  }, {
    name: `Watchlist`,
    count: watchlist,
  }, {
    name: `History`,
    count: history,
  }, {
    name: `Favorites`,
    count: favorite,
  }];
};


export {generateMenuItems};
