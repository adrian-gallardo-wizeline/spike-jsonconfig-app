import Vue from 'vue'

Vue.directive('async', function (el, binding) {
  Promise.resolve(binding.value).then(value => {
    el.innerText = value || binding.arg
  })
})