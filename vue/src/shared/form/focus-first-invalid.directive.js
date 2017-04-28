import $ from 'jquery'

export default {
  bind (el) {
    const $el = $(el)
    $el.on('submit.focus-first-invalid', function () {
      $el.find('.has-error input, .has-error textarea').eq(0).focus()
    })
  },
  unbind (el) {
    $(el).off('submit.focus-first-invalid')
  }
}
