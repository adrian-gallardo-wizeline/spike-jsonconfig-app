<template>
  <section class="container">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.js"></script>

    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        {{ pageTitle }}

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
        <input type="text" class="form-control" id="name" placeholder="Enter name" v-model="config.name">
      </div>

      <div class="form-group">
        <label for="version">Version</label>
        <input type="text" class="form-control" id="version" placeholder="Enter version" v-model="config.version" readonly>
      </div>

      <div class="form-group" v-if="schemas.length > 0">
        <label>Schema</label>
        <schema-selector 
          :schemas="schemas" 
          :value="config.schema ? config.schema.id : null" 
          @select="updateSchema" 
        />
      </div>

      <no-ssr v-if="jsonSchema">
        <JsonSchemaForm 
          :schema="jsonSchema" 
          :data="jsonData"
          @change="updateJsonData">
        </JsonSchemaForm>
      </no-ssr>
      
    </div>
  </section>
</template>

<script>
import merge from 'lodash/merge'

import DataApi from '~/models/DataApi'
import SchemaApi from '~/models/SchemaApi'

import JsonSchemaForm from '~/components/JsonSchemaForm'
import SchemaSelector from '~/components/SchemaSelector'

import jsonSchemaV7 from '~/assets/json-schema-v7'

import Ajv from 'ajv'
const ajv = new Ajv()
var validate = ajv.compile(jsonSchemaV7);

export default {
  async asyncData({params}) {
    const configId = parseInt(params.id)
    const config = configId ? await DataApi.get(configId) : {}

    config.schema = configId ? await SchemaApi.fetchSchemaHierarchy(config.schema.id) : {}
    const schemas = await SchemaApi.getAll()

    return {
      config,
      schemas,
      pageTitle: config.name,
    }
  },
  data() {
    return {
      error: null,
      editorConfig: process.env.CODEMIRROR_CONFIG,
    }
  },
  computed: {
    editMode() {
      return !!this.config.id
    },
    pageTitle() {
      return this.editMode ? `Edit Config - ${this.configName }` : 'New Config'
    },
    jsonSchema() {
      return this.config.schema ? SchemaApi.getMergedSchema(this.config.schema) : null
    },
    jsonData() {
      const data = this.config.jsonData
      const extractedProps = SchemaApi.extractProps(this.jsonSchema)
      return merge({}, extractedProps, data)
    }
  },
  methods: {
    updateJsonData(jsonData) {
      this.config.jsonData = jsonData
    },
    updateSchema(schema) {
      this.config = Object.assign({}, this.config, { schema: undefined, jsonData: {} })

      setTimeout(async () => {
        const fullSchema = schema ? await SchemaApi.fetchSchemaHierarchy(schema.id) : {}
        this.config = Object.assign({}, this.config, { schema: fullSchema })
      }, 500)
      
    },
    async saveSchema() {
      try {
        await DataApi.save(this.config)
        this.pageTitle = this.config.name,

        this.$notify({
          title: 'Config saved successfully!',
          type: 'success',
        })
        
        this.$router.push({name: 'configs'})

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
    JsonSchemaForm,
    SchemaSelector,
  }
}
</script>

<style>
.jsoneditor-wrapper .CodeMirror {
  height: 700px;
}
</style>