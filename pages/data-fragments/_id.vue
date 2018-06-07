<template>
  <section class="container">
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
        <input type="text" class="form-control" id="name" placeholder="Enter name" v-model="dataFragment.name">
      </div>

      <div class="form-group">
        <label for="version">Version</label>
        <input type="text" class="form-control" id="version" placeholder="Enter version" v-model="dataFragment.version" readonly>
      </div>

      <div class="form-group" v-if="fragments.length > 0">
        <label>Fragment Schema</label>
        <schema-selector 
          :schemas="fragments" 
          :value="dataFragment.fragmentSchema ? dataFragment.fragmentSchema.id : null" 
          @select="updateFragmentSchema" 
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

import DataFragmentApi from '~/models/DataFragmentApi'
import SchemaApi from '~/models/SchemaApi'
import FragmentSchemaApi from '~/models/FragmentSchemaApi'

import JsonSchemaForm from '~/components/JsonSchemaForm'
import SchemaSelector from '~/components/SchemaSelector'

import merge from 'lodash/merge'

export default {
  async asyncData({params}) {
    const dataFragmentId = parseInt(params.id)
    const dataFragment = dataFragmentId ? await DataFragmentApi.get(dataFragmentId) : {
      jsonData: {
        "sampleData": "sampleValue"
      }
    }
    const fragments = await FragmentSchemaApi.getAll()

    return {
      dataFragment,
      fragments,
      dataFragmentName: dataFragment.name,
    }
  },
  data() {
    return {
      error: null,
    }
  },
  computed: {
    editMode() {
      return !!this.dataFragment.id
    },
    pageTitle() {
      return this.editMode ? `Edit Data Fragment - ${this.dataFragmentName }` : 'New Data Fragment'
    },
    jsonSchema() {
      return this.dataFragment.fragmentSchema ? this.dataFragment.fragmentSchema.jsonSchema : null
    },
    jsonData() {
      const data = this.dataFragment.jsonData
      const extractedProps = SchemaApi.extractProps(this.jsonSchema)
      return merge({}, extractedProps, data)
    }
  },
  methods: {
    updateFragmentSchema(fragmentSchema) {
      this.dataFragment = Object.assign({}, this.dataFragment, { fragmentSchema: undefined, jsonData: {} })

      setTimeout(() => {
        this.dataFragment = Object.assign({}, this.dataFragment, { fragmentSchema })
      }, 500)
      
    },
    updateJsonData(jsonData) {
      console.log(jsonData)
      this.dataFragment.jsonData = jsonData
    },
    async saveSchema() {
      try {
        await DataFragmentApi.save(this.dataFragment)
        this.dataFragmentName = this.dataFragment.name,

        this.$notify({
          title: 'Fragmnt Schema saved successfully!',
          type: 'success',
        })
        
        this.$router.push({name: 'data-fragments'})

      } catch (error) {
        this.$notify({
          title: `Fragment Schema couldn't be saved`,
          text: error.message,
          type: 'error',
        })
      }
    }
  },
  components: {
    JsonSchemaForm,
    SchemaSelector,
  },
}
</script>

<style>
.jsoneditor-wrapper .CodeMirror {
  height: 700px;
}
</style>