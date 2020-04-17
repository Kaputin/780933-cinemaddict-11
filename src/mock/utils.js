const getRandomArrayItem = (array) => { // возвращает случайный элемент массива
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => { // максимальное значение не учитывается
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomNumberTwoDecimalPlaces = (min, max) => {
  return (min + Math.random() * (max - min)).toFixed(1);
};

const getRandomArray = (arr, max) => { // создаем функцию для случайного тасования множества и вывода нужного количества элементов этого массива
  const randomArr = arr.slice();
  for (let i = randomArr.length - 1; i > 0; i--) { // проходим по массиву в обратном порядке
    const j = Math.floor(Math.random() * i); // задаем случайный индекс от 0 до i
    const temp = randomArr[i]; // меняем местами каждый элемент со случайным элементом, который находится перед ним
    randomArr[i] = randomArr[j];
    randomArr[j] = temp;
  }
  const newRandomArr = randomArr.slice(); // создаем новый массив на основании перемешанного
  const newCount = getRandomIntegerNumber(1, max); // задаем случайную длину описания
  newRandomArr.length = newCount; // задаем случайную длину массива
  return newRandomArr; // возвращаем перетасованный массив
};

const getDateWithZero = (item) => {
  if (item < 10) {
    item = `0` + item;
  }
  return item;
};

export {getRandomArrayItem, getRandomIntegerNumber, getRandomNumberTwoDecimalPlaces, getRandomArray, getDateWithZero};
