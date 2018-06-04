<template>
  <section class="container">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.js"></script>

    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        {{ pageTitle }}

        <sui-button color="orange" size="tiny" :compact="true" floated="right" @click="save" :disabled="!!error">
          <i class="save icon"></i>
          Save
        </sui-button>
      </h2>

      <div v-if="error" class="alert alert-danger" role="alert">
        {{error}}
      </div>

      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" placeholder="Enter name" v-model="fragmentData.name">
      </div>

      <div class="form-group" v-if="editMode">
        <label for="version">Version</label>
        <input type="text" class="form-control" id="version" placeholder="Enter version" v-model="fragmentData.version" readonly>
      </div>

      <div class="form-group">
        <label for="name">Key Prop</label>
        <input type="text" class="form-control" id="name" placeholder="Enter key prop for this JSON schema" v-model="fragmentData.baseProp">
      </div>

      <no-ssr>
        <div>
          <h3 is="sui-header">Schema Editor</h3>
          <sui-segment class="jsoneditor-wrapper">
            <codemirror 
              v-model="jsonSchema"
              :options="editorConfig"
              @change="onCodeChanged"
              ref="myEditor"
            >
            </codemirror>   
          </sui-segment>
        </div>
        
      </no-ssr>
      
    </div>
  </section>
</template>

<script>

import FragmentSchemaApi from '~/models/FragmentSchemaApi'
import schemaTemplate from '~/models/utils/schemaTemplate.json'
import jsonSchemaV7 from '~/assets/json-schema-v7'

import Ajv from 'ajv'
const ajv = new Ajv()
var validate = ajv.compile(jsonSchemaV7);

export default {
  async asyncData({params}) {
    const fragmentId = parseInt(params.fragmentSchema)
    const fragmentData = fragmentId ? await FragmentSchemaApi.get(params.fragmentSchema) : schemaTemplate

    return {
      fragmentData,
      fragmentName: fragmentData.name,
      jsonSchema: JSON.stringify(fragmentData.jsonSchema, null, 4),
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
      return !!this.fragmentData.id
    },
    pageTitle() {
      return this.editMode ? `Edit Fragment Schema - ${this.fragmentName }` : 'New Fragment Schema'
    }
  },
  methods: {
    onCodeChanged(jsonSchema) {
      this.validateJSONSchema(jsonSchema)
    },
    validateJSONSchema(jsonSchema = null) {
      this.setError(null)

      try {
        const fragmentData = JSON.parse(jsonSchema || this.jsonSchema)
        var valid = validate(fragmentData)

        if (valid) {
          return fragmentData
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
    async save() {
      const jsonSchema = this.validateJSONSchema()
      if (!jsonSchema) {
        return
      }
      this.fragmentData.jsonSchema = jsonSchema
      try {
        await FragmentSchemaApi.save(this.fragmentData)
        this.fragmentName = this.fragmentData.name,

        this.$notify({
          title: 'Fragmnt Schema saved successfully!',
          type: 'success',
        })

        this.$router.push({name: 'fragment-schemas'})

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