import {afterEach} from "../../hooks";

export const setTitle = (title: string) => {
  document.title = title;

  // for ios wechat
  let i = document.createElement('iframe');
  i.src = '/assets/img/transparent-pixel-min.png';
  i.style.display = 'none';
  i.onload = function () {
    setTimeout(() => {
      i.remove();
    });
  };
  document.body.appendChild(i);
};

afterEach((to, from) => {
  const title = to.meta.title ? `${to.meta.title}-造就` : '造就';
  setTitle(title);
});
