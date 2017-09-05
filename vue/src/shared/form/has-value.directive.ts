export const hasValue = {
  update(el: HTMLElement) {
    const $el = $(el);
    if ($el.val() !== '') {
      $el.addClass('v-has-value');
    } else {
      $el.removeClass('v-has-value');
    }
  }
};
