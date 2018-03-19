let arr = [1, 2, [3, [4, 5, 6, [7]], [8, 9, 10, [11]]]];

function flatten(arr) {
  return arr.reduce((prev, item) => {
    return Array.isArray(item) ? prev.concat(flatten(item)) : prev.concat(item);
  }, []);
}

console.log(flatten(arr));
