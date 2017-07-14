import autosize from "autosize"

export default {
  inserted (el: HTMLElement) {
    autosize(el);
    $(el).on('input.autosize', function () {
      const e = new Event('autosize:update');
      el.dispatchEvent(e);
    })
  },
  unbind (el: HTMLElement) {
    $(el).off('input.autosize');
    autosize.destroy(el)
  }
}
