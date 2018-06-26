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
  // require('@json-editor/json-editor')
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
  },
  watch: {
    data(data) {
       this.editor.setValue(data)
    }
  }
}

</script>

<style lang="scss" scoped>
.json-schema-form {
  & /deep/ .card {
    padding: 20px;
    margin: 0 0 20px;
    border: none;
    border-bottom: 1px dotted silver;
    border-radius: 0;
  }
  & /deep/ .btn-group {
    border-radius: 0;
    margin-bottom: 20px;
  }
  & /deep/ [type="button"] {
    border: none;
    font-size: 12px;
    padding: 5px 8px;
    margin-right: 8px;
    border-radius: 0;
  }

  & /deep/ {
    .card-block {
      background: #f7f7f7;
    }
    .card-block .card-block .card-block .card-block .card-block {
      background: #b5b5b5;
    }
    .card-block .card-block .card-block .card-block {
      background: #ccc;
    }
    .card-block .card-block .card-block {
      background: #dedede;
    }
    .card-block .card-block {
      background: #efefef;
    }
  }
}
</style>
