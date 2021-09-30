const { over } = require("lodash");
const _ = require ("lodash") 

//var arr = [['a'], ['a'], ['c'], ['c'],  []];
var arr = ['a', 'a', 'c', 'c'];

var arr1 = [];
arr.forEach((valueX) => {
  const nest = [valueX];
  arr1.push(nest);
})

console.log(arr1);

// generate pairs of elements
const pairsOfArray = array => (
    array.reduce((acc, val, i1) => [
      ...acc,
      ...new Array(array.length - 1 - i1).fill(0)
        .map((v, i2) => ([array[i1], array[i1 + 1 + i2]]))
    ], [])
  ) 
  
const pairs = pairsOfArray(arr1)
console.log(pairs);

const allItems = [];
pairs.forEach(([value0,value1]) => {
    const overlap = _.intersection(value0,value1);
    //overlap0 += overlap; //possible fix
    //console.log([value0,value1]);
    allItems.push(overlap);
    //console.log(overlap);
    //return overlap;
  })

  console.log(allItems)


//console.log(overlap0);



//   const overlap = pairs.forEach(([value0,value1]) => {
//     const test = _.intersection(value0,value1);
//    //console.log([value0,value1]);
//    //console.log(overlap);
//    return test;
//  })
 
//  console.log(overlap);

//   return result || "Couldn't find";
// }

// const overlap0 = pairs.forEach(([value0,value1]) => _.intersection(value0,value1));
// console.log(overlap0);

// for (const [value0,value1] of pairs) {
//   const overlap = _.intersection([value0],[value1]);
//   //console.log([value0,value1]);
//   console.log(overlap);
// }




// const overlap1 = _.intersection(['a'],['a', 'b']);
// console.log(overlap1);



// for (const [i] of arr) {
//   const overlap = _.intersection([i], [i]);
//   console.log(overlap);
// }




// for (const i of arr) { // You can use `let` instead of `const` if you like
//   //console.log(i);
//   const overlap = _.intersection(arr[i]);
//   console.log(overlap);
// }

// for (const [key,value] of pairs) {
//   console.log(key,value);
// }




// for (var j = 0; j<pairs.length; j++) 
// {
//      //j(th) element of table array
//      for (var i = 0; i < pairs[j].length; i++)
//      {
//          //i(th) element of j(th) element array
//          const overlap = _.intersection(pairs[i]);
//          console.log(overlap);
//      }
// }


  //console.log(pairs)

// const distinctValues = [...new Set(pairs.flat(1))];
// const intersection = distinctValues.filter(x => pairs.every(y => y.includes(x)));
// console.log(distinctValues);

 

  // const overlap = _.intersection(...pairs[0]); 
  // console.log(overlap);


//   for (var j = 0; j<pairs.length; j++) 
// {
//      //j(th) element of table array
//      for (var i = 0; i < pairs[j].length; i++)
//      {
//          //i(th) element of j(th) element array
//          console.log(pairs[j][i]);
//      }
// }


// const myArray = [[1, 2, 3], [2, 3, 4, 5, 6, 7], [2, 3, 4], [2, 3, 6, 11]];
// // the problem is that the intersection is between all the sub-arrays and not each single pair
// const distinctValues = [...new Set(myArray.flat(1))];
// const intersection = distinctValues.filter(x => myArray.every(y => y.includes(x)));
// console.log(intersection);

// https://stackoverflow.com/questions/67451270/find-intersection-between-subarrays-of-array-in-javascript

// https://stackoverflow.com/questions/22566379/how-to-get-all-pairs-of-array-javascript

// const
//     data = [[1, 2, 3], [2, 3, 4, 5, 6, 7], [2, 3, 4], [2, 3, 6, 11]],
//     common = data.reduce((a, b) => b.filter(Set.prototype.has, new Set(a)));

// console.log(common);


// var arr = [1, 2, 3];

// function generatePowerSet(array) {
//   var result = [];
//   result.push([]);

//   for (var i = 1; i < (1 << array.length); i++) {
//     var subset = [];
//     for (var j = 0; j < array.length; j++)
//       if (i & (1 << j))
//         subset.push(array[j]);

//     result.push(subset);
//   }

//   return result;
// }

// console.log(generatePowerSet(arr));