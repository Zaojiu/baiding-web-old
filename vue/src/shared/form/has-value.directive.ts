export default {
  bind (el: HTMLElement) {
    const $el = $(el)
    if ($el.val() !== '') $el.addClass('v-has-value');

    $el.on('input.has-value', function () {
      if ($el.val() !== '') {
        $el.addClass('v-has-value');
      } else {
        $el.removeClass('v-has-value');
      }
    })
  },
  unbind (el: HTMLElement) {
    const $el = $(el)
    $el.off('input.has-value');
    if ($el.hasClass('v-has-value')) $el.removeClass('v-has-value');
  }
}
