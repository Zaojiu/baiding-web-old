// Ensure this is treated as a module.
export {};

declare global {
  interface Promise<T> {
    finally?<T>(onFinally?: () => T | Promise<T>): Promise<T>;
  }
}

Promise.prototype.finally = function (cb) {
  const res = () => this;
  const fin = () => {
    if (typeof cb === 'function') {
      return Promise.resolve(cb()).then(res);
    } else {
      return res;
    }
  };
  return this.then(fin, fin);
};
