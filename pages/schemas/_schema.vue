<template>
  <section class="container">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.js"></script>

    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        Edit Schema - {{ schemaName }}

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
        <input type="text" class="form-control" id="name" placeholder="Enter name" v-model="schemaData.name">
      </div>

      <div class="form-group">
        <label for="version">Version</label>
        <input type="text" class="form-control" id="version" placeholder="Enter version" v-model="schemaData.version" readonly>
      </div>

      <div class="form-group">
        <label>Inherits From</label>
        <input type="text" class="form-control" v-model="inheritanceChain" readonly>
      </div>
      
      <json-schema :schema="schemaData"></json-schema>

      <no-ssr>
        <sui-segment class="jsoneditor-wrapper">
          <codemirror 
            v-model="jsonSchema"
            :options="editorOption"
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

// import VueJsonPretty from 'vue-json-pretty'
// import VueAceEditor from 'vue2-ace-editor'
// import VJsoneditor from 'vue-jsoneditor';
import SchemaApi from '~/models/SchemaApi'
import Schema from '~/models/Schema'

import JsonSchema from '~/components/JsonSchema'

import jsonSchemaV7 from '~/assets/json-schema-v7'

// import { Validator } from 'jsonschema'
// const v = new Validator();
// const instance = {
//   "name": "Jeremy Dorn"
// }

import Ajv from 'ajv'
const ajv = new Ajv()
var validate = ajv.compile(jsonSchemaV7);

export default {
  async asyncData({params}) {
    const schemaData = await SchemaApi.fetchSchemaHierarchy(params.schema)
    const inheritanceChain = SchemaApi.getInheritanceChain(schemaData).join(' -> ')
    return {
      schemaData,
      inheritanceChain,
      schemaName: schemaData.name,
      jsonSchema: JSON.stringify(schemaData.jsonSchema, null, 4),
    }
  },
  data() {
    return {
      editorOption: {
        mode: {name: "javascript", json: true},
        indentUnit: 4,
        smartIndent: true,
        tabSize: 4,
        electricChars: true,
        lineNumbers: true,
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      },
      error: null,
    }
  },
  computed: {
    // editor() {
    //   // get current editor object
    //   const editor = this.$refs.myEditor.editor
    //   return this.$refs.myEditor.editor.on('blur', this.validateJSONSchema)
    // }
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
          this.schemaData.jsonSchema = schema
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
      this.schemaData.jsonSchema = jsonSchema
      try {
        await SchemaApi.save(this.schemaData)
        this.schemaName = this.schemaData.name,

        this.$notify({
          title: 'Schema saved successfully!',
          type: 'success',
        })
      } catch (error) {
        this.$notify({
          title: `Schema couldn't be saved`,
          text: error.message,
          type: 'error',
        })
      }
    }
  },
  components: {
    JsonSchema
  },
  // head: {
  //   link: [
  //     { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.css' },
  //   ],
  //   script: [
  //     { src: 'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.js' },
  //   ]
  // }
}
</script>

<style>
.jsoneditor-wrapper .CodeMirror {
  height: 700px;
}
</style>