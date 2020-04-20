const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

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

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export {RenderPosition, sortDiscussed, sortRating, createElement, render};
