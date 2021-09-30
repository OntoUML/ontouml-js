
const myArray = [[1, 2, 3], [2, 3, 4, 5, 6, 7], [2, 3, 4], [3, 6, 11]];

const distinctValues = [...new Set(myArray.flat(1))];

const intersection = distinctValues.filter(x => myArray.every(y => y.includes(x)));

console.log(intersection);