<template>
  <div>
    <h3 is="sui-header">JSON Data</h3>
    <sui-segment class="jsoneditor-wrapper">
      <form ref="form" class="json-schema-form"></form>
    </sui-segment>
  </div>
  
</template>

<script>

if (process.browser) {
  require('@json-editor/json-editor')
}

export default {
  data() {
    return {
      info: '',
      options: {},
      editor: null,
    }
  },
  props: ['schema', 'data'],
  mounted() {
    if (!process.browser || !this.$refs.form) {
      return
    }
    this.options = {
      theme: 'bootstrap4',
      schema: this.schema,

      startval: this.data,
      disable_collapse: true,
      disable_edit_json: true,
      disable_properties: true,
    }
    this.editor = new JSONEditor(this.$refs.form, this.options)

    if (!this.editor || typeof this.editor.on !== 'function') {
      return
    }


    this.editor.on('change', () => {
      this.info = this.editor.getValue()
      this.$emit('change', this.editor.getValue())
    });
  }
}

</script>

<style lang="scss" scoped>
.json-schema-form {
  & /deep/ .card {
    padding: 35px;
    margin-bottom: 35px;
  }
}
</style>
