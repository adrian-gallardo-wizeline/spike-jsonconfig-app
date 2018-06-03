<template>
  <section class="container">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.js"></script>

    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        Edit Data Fragment - {{ pageTitle }}

        <sui-button color="orange" size="tiny" :compact="true" floated="right" @click="saveSchema" :disabled="!!error">
          <i class="save icon"></i>
          Save
        </sui-button>
      </h2>

      <div v-if="error" class="alert alert-danger" role="alert">
        {{error}}
      </div>

      <div class="form-group">
        <label for="fragment-schema">Fragment Schema</label>
        <input type="text" class="form-control" id="fragment-schema" v-model="dataFragment.fragmentSchema.name" readonly>
      </div>

      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" placeholder="Enter name" v-model="dataFragment.name">
      </div>

      <div class="form-group">
        <label for="version">Version</label>
        <input type="text" class="form-control" id="version" placeholder="Enter version" v-model="dataFragment.version" readonly>
      </div>

      <no-ssr>
        <JsonSchemaForm 
          :schema="dataFragment.fragmentSchema.jsonSchema" 
          :data="dataFragment.jsonData"
          @change="updateJsonData">
        </JsonSchemaForm>
      </no-ssr>
      
    </div>
  </section>
</template>

<script>

import Api from '~/models/DataFragmentApi'
import JsonSchemaForm from '~/components/JsonSchemaForm'

export default {
  async asyncData({params}) {
    const dataFragment = await Api.get(params.dataFragment)
    return {
      dataFragment,
      pageTitle: dataFragment.name,
    }
  },
  data() {
    return {
      error: null,
    }
  },
  components: {
    JsonSchemaForm,
  },
  methods: {
    updateJsonData(jsonData) {
      this.dataFragment.jsonData = jsonData
    },
    async saveSchema() {
      try {
        await Api.save(this.dataFragment)
        this.pageTitle = this.dataFragment.name,

        this.$notify({
          title: 'Fragmnt Schema saved successfully!',
          type: 'success',
        })
      } catch (error) {
        this.$notify({
          title: `Fragment Schema couldn't be saved`,
          text: error.message,
          type: 'error',
        })
      }
    }
  },
}
</script>

<style>
.jsoneditor-wrapper .CodeMirror {
  height: 700px;
}
</style>