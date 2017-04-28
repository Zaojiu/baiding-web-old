import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import focus from './focus.directive'
import focusFirstInvalid from './focus-first-invalid.directive'
import autosize from './autosize.directive'
import hasValue from './has-value.directive'
import localeCN from 'vee-validate/dist/locale/zh_CN'

Validator.addLocale(localeCN);


Vue.use(VeeValidate, { locale: 'zh_CN' });

export default {
  focus,
  focusFirstInvalid,
  autosize,
  hasValue
}
