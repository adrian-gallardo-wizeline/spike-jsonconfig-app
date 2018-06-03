import axios from 'axios'
import FragmentSchemaApi from '~/models/FragmentSchemaApi'
import merge from 'lodash/merge'
import Schema from './Schema'

class SchemaApi {

  constructor() {
    this.endpoint = `${process.env.API_URL}/schema`
  }

  async getAll() {
    return await axios.get(this.endpoint)
      .then(response => {
        const schemas = response.data
        return schemas.map(schemaData => new Schema(schemaData))
      })
  }

  async get(id) {
    const url = `${this.endpoint}/${id}`
    return await axios.get(url)
      .then(response => {
        const schemaData = response.data
        return new Schema(schemaData)
      })
  }

  async save(schema) {
    const url = `${this.endpoint}/${schema.id}`

    const { childSchemas, parentSchema, composedFragments, ...shallowData } = schema.getData()

    return await axios.patch(url, shallowData)
      .then(response => {
        const schemaData = response.data
        return new Schema(schemaData)
      })
  }

  async getComposedFragments(schemaId) {
    const url = `${this.endpoint}/${schema.id}`

    const { childSchemas, parentSchema, composedFragments, ...shallowData } = schema

    await axios.patch(url, shallowData).then(response => response.data)
  }

  async resolveSchemaHierarchy(schema) {
    if (!schema) {
      return
    }
    if (typeof schema.parentSchema === 'number') {
      schema.parentSchema = await this.get(schema.parentSchema)
      schema.composedFragments = await FragmentSchemaApi.getBySchema(schema.id)
    }
    await this.resolveSchemaHierarchy(schema.parentSchema)
    return schema
  }

  flatenSchemaHierarchy(schema) {
    const schemas = []

    let currentSchema = schema
    while (currentSchema) {
      schemas.unshift(currentSchema)
      currentSchema = currentSchema.parentSchema
    }
    return schemas
  }
}

export default new SchemaApi()