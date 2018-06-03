<template>
  <section class="container">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.js"></script>

    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        Edit Config - {{ pageTitle }}

        <sui-button color="orange" size="tiny" :compact="true" floated="right" @click="saveSchema" :disabled="!!error">
          <i class="save icon"></i>
          Save
        </sui-button>
      </h2>

      <div v-if="error" class="alert alert-danger" role="alert">
        {{error}}
      </div>

      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" placeholder="Enter name" v-model="data.name">
      </div>

      <div class="form-group">
        <label for="version">Version</label>
        <input type="text" class="form-control" id="version" placeholder="Enter version" v-model="data.version" readonly>
      </div>
{{ mergedSchema}}
      <no-ssr>
        <JsonSchemaForm 
          :schema="mergedSchema" 
          :data="data.jsonData"
          @change="updateJsonData">
        </JsonSchemaForm>
      </no-ssr>
      
    </div>
  </section>
</template>

<script>

import DataApi from '~/models/DataApi'
import SchemaApi from '~/models/SchemaApi'
import JsonSchemaForm from '~/components/JsonSchemaForm'

import jsonSchemaV7 from '~/assets/json-schema-v7'

import Ajv from 'ajv'
const ajv = new Ajv()
var validate = ajv.compile(jsonSchemaV7);

export default {
  async asyncData({params}) {
    const data = await DataApi.get(params.id)

    const mergedSchema = await DataApi.getMergedSchema(data)
    
    return {
      data,
      mergedSchema,
      pageTitle: data.name,
      jsonData: JSON.stringify(data.jsonData, null, 4),
    }
  },
  data() {
    return {
      error: null,
      editorConfig: process.env.CODEMIRROR_CONFIG,
    }
  },
  methods: {
    updateJsonData(jsonData) {
      this.data.jsonData = jsonData
    },
    async saveSchema() {
      try {
        await Api.save(this.data)
        this.pageTitle = this.data.name,

        this.$notify({
          title: 'Config saved successfully!',
          type: 'success',
        })
      } catch (error) {
        this.$notify({
          title: `Config couldn't be saved`,
          text: error.message,
          type: 'error',
        })
      }
    }
  },
  components: {
    JsonSchemaForm
  }
}
</script>

<style>
.jsoneditor-wrapper .CodeMirror {
  height: 700px;
}
</style>