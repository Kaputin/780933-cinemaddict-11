const createMenuItemMarkup = (name, count) => {
  if (name === `All`) {
    return (
      `<a href="#${name.toLowerCase()}.toLowerCase()" class="main-navigation__item main-navigation__item--active">${name} movies</a>`
    );
  } else {
    return (
      `<a href="#${name.toLowerCase()}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`
    );
  }
};

export const createSiteMenuTemplate = (menuItems) => {
  const siteMenuMarkup = menuItems.map((it) => createMenuItemMarkup(it.name, it.count)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${siteMenuMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
