import {Route, RawLocation} from "vue-router";
import Vue from "vue";

export type beforeInterface = (to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => void;
export type afterInterface = (to: Route, from: Route) => void;
export const beforeHooks: beforeInterface[] = [];
export const afterHooks: afterInterface[] = [];
export const beforeEach = (cb: beforeInterface): void => {
  beforeHooks.push(cb);
};
export const afterEach = (cb: afterInterface): void => {
  afterHooks.push(cb);
};
