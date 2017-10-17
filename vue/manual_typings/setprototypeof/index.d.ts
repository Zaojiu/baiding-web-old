interface SetPrototypeOfStatic {
  (obj: any, target: any): any;
}

declare module "setprototypeof" {
  var SetPrototypeOf: SetPrototypeOfStatic;

  export = SetPrototypeOf;
}

declare var setPrototypeOf: SetPrototypeOfStatic;
