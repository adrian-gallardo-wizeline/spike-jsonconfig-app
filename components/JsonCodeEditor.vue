<template>
  <no-ssr class="json-code-editor">
    <codemirror 
      v-model="value"
      :options="options"
      @change="onChange"
      ref="myEditor"
    />
  </no-ssr>
</template>

<script>
const components = {}

if (process.browser) {
  components.codemirror = require('vue-codemirror-lite').codemirror

  require('codemirror/mode/javascript/javascript')

  require('codemirror/addon/hint/show-hint.js')
  require('codemirror/addon/hint/show-hint.css')
  require('codemirror/addon/hint/javascript-hint.js')

  require('codemirror/addon/lint/json-lint.js')
}

export default {
  props: ['value', 'options', 'onChange'],
  components,
}
</script>

<style scoped lang="scss">

.json-code-editor,
.json-code-editor /deep/ .vue-codemirror-wrap,
.json-code-editor /deep/ .CodeMirror {
  height: 100%;
}

</style>
