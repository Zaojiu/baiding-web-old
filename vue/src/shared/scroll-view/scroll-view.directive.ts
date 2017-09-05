import {VNode, VNodeDirective} from "vue";

export const scrollView = {
  inserted(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
    const onTop = binding.value['onTop'];
    const onBottom = binding.value['onBottom'];
    const threshold = binding.value['threshold'] || 50;

    if (!onTop && !onBottom) return;

    let isOnTopEventEmited = false;
    let isOnBottomEventEmited = false;

    const checkScrollTop = (needEmitEvent = true) => {
      const scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      const isOnTop = el.scrollTop >= 0 && el.scrollTop <= threshold;
      const isOnBottom = scrollBottom >= 0 && scrollBottom <= threshold;

      if (isOnTop && !isOnTopEventEmited && onTop) {
        if (needEmitEvent) onTop();
        isOnTopEventEmited = true;
      }

      if (!isOnTop && isOnTopEventEmited) {
        isOnTopEventEmited = false;
      }

      if (isOnBottom && !isOnBottomEventEmited && onBottom) {
        if (needEmitEvent) onBottom();
        isOnBottomEventEmited = true;
      }

      if (!isOnBottom && isOnBottomEventEmited) {
        isOnBottomEventEmited = false;
      }
    };

    checkScrollTop(false);
    el.addEventListener('scroll',  () => checkScrollTop());
  },
};
