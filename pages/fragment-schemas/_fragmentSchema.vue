<template>
  <section class="container">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.js"></script>

    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        Edit Fragment Schema - {{ pageTitle }}

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
        <input type="text" class="form-control" id="name" placeholder="Enter name" v-model="schema.name">
      </div>

      <div class="form-group">
        <label for="version">Version</label>
        <input type="text" class="form-control" id="version" placeholder="Enter version" v-model="schema.version" readonly>
      </div>

      <div class="form-group">
        <label for="name">Key Prop</label>
        <input type="text" class="form-control" id="name" placeholder="Enter key prop for this JSON fragment" v-model="schema.baseProp">
      </div>

      <no-ssr>
        <sui-segment class="jsoneditor-wrapper">
          <codemirror 
            v-model="jsonSchema"
            :options="editorConfig"
            @change="onCodeChanged"
            ref="myEditor"
          >
          </codemirror>   
        </sui-segment>
      </no-ssr>
      
    </div>
  </section>
</template>

<script>

import Api from '~/models/FragmentSchemaApi'
import jsonSchemaV7 from '~/assets/json-schema-v7'

import Ajv from 'ajv'
const ajv = new Ajv()
var validate = ajv.compile(jsonSchemaV7);

export default {
  async asyncData({params}) {
    const schema = await Api.get(params.fragmentSchema)
    return {
      schema,
      pageTitle: schema.name,
      jsonSchema: JSON.stringify(schema.jsonSchema, null, 4),
    }
  },
  data() {
    return {
      error: null,
      editorConfig: process.env.CODEMIRROR_CONFIG,
    }
  },
  methods: {
    onCodeChanged(jsonSchema) {
      this.validateJSONSchema(jsonSchema)
    },
    validateJSONSchema(jsonSchema = null) {
      this.setError(null)

      try {
        const schema = JSON.parse(jsonSchema || this.jsonSchema)
        var valid = validate(schema)

        if (valid) {
          return schema
        } else {
          this.setError(validate.errors)
        }        
      } catch (error) {
        this.setError(error.message)
      }
    },
    setError(error) {
      this.error = error
    },
    async saveSchema() {
      const jsonSchema = this.validateJSONSchema()
      if (!jsonSchema) {
        return
      }
      this.schema.jsonSchema = jsonSchema
      try {
        await Api.save(this.schema)
        this.pageTitle = this.schema.name,

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