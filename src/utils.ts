const shuffle = (list: any[]) => {
  for (var i = list.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
  return list;
};

export { shuffle };
