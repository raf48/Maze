/* Knuth's Shuffle */
Array.prototype.shuffle = Array.prototype.shuffle || function() {
  let index = this.length;

  while (index--) {
    const randIndex = ~~(Math.random() * index);
    const tmp = this[index];
    this[index] = this[randIndex];
    this[randIndex] = tmp;
  }
};

/* Return random array element */
Array.prototype.getRandom = Array.prototype.getRandom || function() {
  return this[~~(Math.random() * this.length)];
}

/* Remove random element from array and return it's value */
Array.prototype.removeRandom = Array.prototype.removeRandom || function() {
  return this.splice(~~(Math.random() * this.length), 1)[0];
}