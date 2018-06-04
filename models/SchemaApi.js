import axios from 'axios'
import FragmentSchemaApi from '~/models/FragmentSchemaApi'
import merge from 'lodash/merge'
import Schema from './Schema';

class SchemaApi {

  constructor() {
    this.endpoint = `${process.env.API_URL}/schema`
  }

  async getAll() {
    return await axios.get(this.endpoint).then(response => response.data)
  }

  async get(id) {
    const url = `${this.endpoint}/${id}`
    return await axios.get(url).then(response => response.data)
  }

  async save(schema) {
    const url = schema.id ? `${this.endpoint}/${schema.id}` : this.endpoint
    const requestMethod = schema.id ? axios.patch : axios.post

    const { childSchemas, parentSchema, composedFragments, ...shallowData } = schema
    shallowData.parentSchema = parentSchema ? parentSchema.id : null
    shallowData.composedFragments = composedFragments ? 
      composedFragments.map(fragment => fragment.id) :
      []

    await requestMethod(url, shallowData).then(response => response.data)
  }

  async fetchSchemaHierarchy(schemaId) {
    const url = `${this.endpoint}/fetch-hierarchy/${schemaId}`
    return await axios.get(url).then(response => response.data)
  }

  getMergedSchema(schema) {
    let jsonSchema = {}

    while (schema) {
      let currentSchema = schema.jsonSchema

      if (schema.composedFragments) {
        schema.composedFragments.forEach(fragment => {
          const fragmentSchema = fragment.baseProp ?
            {properties: {[fragment.baseProp]: fragment.jsonSchema}} :
            fragment.jsonSchema
          currentSchema = merge({}, currentSchema, fragmentSchema)
        })
      }

      jsonSchema = merge({}, currentSchema, jsonSchema)
      schema = schema.parentSchema
    }
    return jsonSchema
  }

  getInheritanceChain(schema) {
    const inheritanceChain = []
    while (schema.parentSchema) {
      inheritanceChain.unshift(schema.parentSchema.name)
      schema = schema.parentSchema
    }
    return inheritanceChain
  }

  extractProps(schema) {
    const props = {}
    Object.keys(schema.properties).forEach(key => {
      const prop = schema.properties[key]
      if (prop.type === 'object') {
        props[key] = this.extractProps(prop)
      } else {
        props[key] = prop.default || ""
      }
    })
    return props
  }
}

export default new SchemaApi()