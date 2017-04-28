import autosize from "autosize"
import $ from 'jquery'

export default {
  inserted (el) {
    autosize(el);
    $(el).on('input.autosize', function () {
      const e = new Event('autosize:update');
      el.dispatchEvent(e);
    })
  },
  unbind (el) {
    $(el).off('input.autosize');
    autosize.destroy(el)
  }
}
