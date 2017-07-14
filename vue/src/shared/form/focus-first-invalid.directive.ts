export default {
  bind (el: HTMLElement) {
    const $el = $(el)
    $el.on('submit.focus-first-invalid', function () {
      $el.find('.has-error input, .has-error textarea').eq(0).focus()
    })
  },
  unbind (el: HTMLElement) {
    $(el).off('submit.focus-first-invalid')
  }
}
