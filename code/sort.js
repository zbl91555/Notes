function shuffle(arr) {
  let moveIndex;
  arr.forEach((item, index) => {
    if (index !== 0) {
      moveIndex = Math.floor(Math.random() * (index + 1));
      [arr[moveIndex], arr[index]] = [arr[index], arr[moveIndex]];
    }
  });
  return arr;
}
// mock data
let arr = shuffle([...Array(100).keys()]);

// mergeSort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  let middle = (arr.length / 2) | 0;
  let left = arr.slice(0, middle);
  let right = arr.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  while (left.length > 0 && right.length > 0) {
    if (left[0] < right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  return result.concat(left, right);
}
// console.log(mergeSort(arr));

function quickSort(arr) {
  if (arr.length <= 1) return arr;
  let pivotIndex = (arr.length / 2) | 0;
  let povit = arr[pivotIndex];
  let middle = [];
  let left = [];
  let right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < povit) {
      left.push(arr[i]);
    } else if (arr[i] > povit) {
      right.push(arr[i]);
    } else {
      middle.push(arr[i]);
    }
  }
  return [].concat(quickSort(left), middle, quickSort(right));
}
// console.log(quickSort(arr));
