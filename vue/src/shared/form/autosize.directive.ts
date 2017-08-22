import _autosize from "autosize"

export const autosize = {
  inserted (el: HTMLElement) {
    _autosize(el);
    $(el).on('input.autosize', function () {
      const e = new Event('autosize:update');
      el.dispatchEvent(e);
    })
  },
  unbind (el: HTMLElement) {
    $(el).off('input.autosize');
    _autosize.destroy(el)
  }
};
