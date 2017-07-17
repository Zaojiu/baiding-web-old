import {RawLocation, Route} from "vue-router";
import Vue from "vue";

interface Guard {
  (to: Route, from: Route): boolean | Promise<boolean>;
}

export const beforeRouteEnter = (guards: Guard | Guard[],
                                 to: Route,
                                 from: Route,
                                 next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void): void => {
  if (!guards || (Array.isArray(guards) && !guards.length)) return;

  const guardArr: Guard[] = [];
  const isPromise = (unconfirmedObject: any) => !!unconfirmedObject.then;
  const execGuard = async (to: Route,
                           from: Route,
                           next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void,
                           index: number) => {
    if (index > guardArr.length - 1) {
      next();
      return
    }

    let guard = guardArr[index];
    if (typeof guard !== 'function') {
      execGuard(to, from, next, index + 1);
      return;
    }

    let promise = guard(to, from);
    if (!isPromise(promise)) promise = Promise.resolve(promise);
    const result = await promise;
    if (result === true) {
      execGuard(to, from, next, index + 1);
    } else {
      next(result);
    }
  };

  if (Array.isArray(guards)) {
    guardArr.push(...guards)
  } else {
    guardArr.push(guards);
  }

  execGuard(to, from, next, 0);
};
