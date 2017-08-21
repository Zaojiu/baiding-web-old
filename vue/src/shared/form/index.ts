import Vue from 'vue';
import * as VeeValidate from 'vee-validate';
import focus from './focus.directive';
import focusFirstInvalid from './focus-first-invalid.directive';
import autosize from './autosize.directive';
import hasValue from './has-value.directive';
const localeCN = require('vee-validate/dist/locale/zh_CN');

Vue.use(VeeValidate);

VeeValidate.Validator.addLocale(localeCN);
VeeValidate.Validator.setLocale('zh_CN');

export default {
  focus,
  focusFirstInvalid,
  autosize,
  hasValue
}
