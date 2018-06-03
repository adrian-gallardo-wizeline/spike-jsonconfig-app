import Vue from 'vue'
import VueCodeMirror from 'vue-codemirror-lite'

require('codemirror/mode/javascript/javascript')

require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/show-hint.css')
require('codemirror/addon/hint/javascript-hint.js')

require('codemirror/addon/lint/json-lint.js')

Vue.use(VueCodeMirror)