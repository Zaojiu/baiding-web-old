Promise.prototype.finally = function (cb) {
  const res = () => this;
  const fin = () => Promise.resolve(cb()).then(res);
  return this.then(fin, fin);
};

export default {};
