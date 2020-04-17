const MenuItems = {
  ALL: `All`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`
};

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
    name: MenuItems.ALL,
    count: all,
  }, {
    name: MenuItems.WATCHLIST,
    count: watchlist,
  }, {
    name: MenuItems.HISTORY,
    count: history,
  }, {
    name: MenuItems.FAVORITES,
    count: favorite,
  }];
};

export {generateMenuItems};
