export default function (guards) {
  if (!guards || (Array.isArray(guards) && !guards.length)) return undefined;

  const guardArr = [];
  const isPromise = (unconfirmedObject) => !!unconfirmedObject.then;
  const execGuard = async (to, from, next, index) => {
    if (index > guardArr.length - 1) {
      next();
      return
    }

    let guard = guardArr[index];
    if (typeof guard !== 'function') {
      execGuard(to, from, next, index+1);
      return;
    }

    let promise = guard(to, from);
    if (!isPromise(promise)) promise = Promise.resolve(promise);
    const result = await promise;
    if (result === undefined) {
      execGuard(to, from, next, index+1);
    } else {
      next(result);
    }
  };

  if (Array.isArray(guards)) {
    guardArr.push(...guards)
  } else {
    guardArr.push(guards);
  }

  const beforeRouteEnter = function (to, from, next) {
    execGuard(to, from, next, 0);
  };

  return beforeRouteEnter;
}
