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
    const url = `${this.endpoint}/${schema.id}`

    const { childSchemas, parentSchema, composedFragments, ...shallowData } = schema

    await axios.patch(url, shallowData).then(response => response.data)
  }

  async fetchSchemaHierarchy(id) {
    const url = `${this.endpoint}/fetch-hierarchy/${id}`
    return await axios.get(url).then(response => response.data)
  }

  getMergedSchema(schema) {
    let jsonSchema = {}

    while (schema) {
      jsonSchema = merge({}, schema.jsonSchema, jsonSchema)
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
}

export default new SchemaApi()