<template>
  <section class="container">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.14.0/jsoneditor.min.js"></script>

    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        {{ editMode ? `Edit Schema - ${schemaName }` : 'New Schema' }}

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
        <input type="text" class="form-control" id="name" placeholder="Enter schema name" v-model="schemaData.name">
      </div>

      <div class="form-group" v-if="editMode">
        <label for="version">Version</label>
        <input type="text" class="form-control" id="version" v-model="schemaData.version" readonly>
      </div>

      <div class="form-group" v-if="editMode && hasParentSchema">
        <label>Inherits From</label>
        <input type="text" class="form-control" v-model="inheritanceChain" readonly>
      </div>

      <div class="form-group" v-if="schemas.length > 0">
        <label>Parent Schema</label>
        <schema-selector 
          :schemas="schemas" 
          :excluded-schema="schemaData"
          :selected-schema-id="hasParentSchema ? schemaData.parentSchema.id : null" 
          @select="updateParentSchema" 
        />
      </div>

      <div class="schema-wrapper">
        <sui-grid divided="vertically">
          <sui-grid-row :columns="hasParentSchema ? 2 : 1">
            <sui-grid-column>
              <h3 is="sui-header">Schema Editor</h3>
              <no-ssr>
                <sui-segment class="jsoneditor-wrapper">
                  <codemirror 
                    v-model="jsonSchema"
                    :options="editorOption"
                    @change="onCodeChanged"
                    ref="myEditor"
                  />
                </sui-segment>
              </no-ssr>
            </sui-grid-column>
            <sui-grid-column v-if="hasParentSchema">
              <h3 is="sui-header">Merged schema</h3>
              <json-schema :schema="schemaData" class="jsoneditor-wrapper" />
            </sui-grid-column>
          </sui-grid-row>
        </sui-grid>
      </div>      
    </div>
  </section>
</template>

<script>

// import VueJsonPretty from 'vue-json-pretty'
// import VueAceEditor from 'vue2-ace-editor'
// import VJsoneditor from 'vue-jsoneditor';
import SchemaApi from '~/models/SchemaApi'
import Schema from '~/models/Schema'
import schemaTemplate from '~/models/utils/schemaTemplate.json'
console.log('schemaTemplate', schemaTemplate)
import JsonSchema from '~/components/JsonSchema'
import SchemaSelector from '~/components/SchemaSelector'

import jsonSchemaV7 from '~/assets/json-schema-v7.json'

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
    const schemaId = parseInt(params.schema)
    const schemaData = schemaId ? await SchemaApi.fetchSchemaHierarchy(schemaId) : schemaTemplate
    const schemas = await SchemaApi.getAll()
    const inheritanceChain = SchemaApi.getInheritanceChain(schemaData).join(' -> ')
    return {
      schemas,
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
    editMode() {
      return !!this.schemaData.id
    },
    hasParentSchema() {
      return !!this.schemaData.parentSchema
    }
    // editor() {
    //   // get current editor object
    //   const editor = this.$refs.myEditor.editor
    //   return this.$refs.myEditor.editor.on('blur', this.validateJSONSchema)
    // }
  },
  methods: {
    updateParentSchema(parentSchema) {
      this.schemaData = Object.assign({}, this.schemaData, { parentSchema })
    },
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
        
        this.$router.push({name: 'schemas'})

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
    JsonSchema,
    SchemaSelector,
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

<style scoped lang="scss">
.schema-wrapper {
  padding-left: 16px;
  padding-top: 10px;
}
.jsoneditor-wrapper {
  height: 700px;
}
.jsoneditor-wrapper /deep/ .vue-codemirror-wrap,
.jsoneditor-wrapper /deep/ .CodeMirror {
  height: 100%;
}

</style>