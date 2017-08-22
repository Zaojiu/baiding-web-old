import Vue from 'vue';
import VeeValidate from 'vee-validate';
import {focus} from './focus.directive';
import {focusFirstInvalid} from './focus-first-invalid.directive';
import {autosize} from './autosize.directive';
import {hasValue} from './has-value.directive';

Vue.use(VeeValidate);

export const form = {
  focus,
  focusFirstInvalid,
  autosize,
  hasValue
};
