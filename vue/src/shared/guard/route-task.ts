import {RawLocation, Route} from "vue-router";
import Vue from "vue";

// 进入路由前执行的任务，可以是守卫（guard），返回true/false来决定要不要进入路由
// 或者是resolver，获取一个数据inject到路由的meta数据中
// 函数最后无return或`return;`，则为进入
interface Task {
  (to: Route, from: Route): boolean|void | Promise<boolean|void>;
}

export const execRouteTask = (tasks: Task | Task[],
                                 to: Route,
                                 from: Route,
                                 next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void): void => {
  if (!tasks || (Array.isArray(tasks) && !tasks.length)) return;

  const taskArr: Task[] = [];
  const isPromise = (unconfirmedObject: any) => !!unconfirmedObject.then;
  const execTask = async (to: Route,
                           from: Route,
                           next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void,
                           index: number) => {
    if (index > taskArr.length - 1) {
      next();
      return
    }

    let task = taskArr[index];
    if (typeof task !== 'function') {
      execTask(to, from, next, index + 1);
      return;
    }

    let promise = task(to, from);
    if (!isPromise(promise)) promise = Promise.resolve<void|boolean>(promise);
    const result = await promise;
    if (result === true) {
      execTask(to, from, next, index + 1);
    } else {
      next(result);
    }
  };

  if (Array.isArray(tasks)) {
    taskArr.push(...tasks)
  } else {
    taskArr.push(tasks);
  }

  execTask(to, from, next, 0);
};
