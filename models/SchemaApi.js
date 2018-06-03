import axios from 'axios'
import FragmentSchemaApi from '~/models/FragmentSchemaApi'
import merge from 'lodash/merge'
import Schema from './Schema'

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

  mergeFragmentSchemas(schema) {
    console.log('schemaApi', schema)
    if (!schema.composedFragments) {
      return schema.jsonSchema
    }
    const mergedSchema = schema.composedFragments.reduce((mergedSchema, fragment) => {
      let schema = {
        properties: {
          [fragment.baseProp]: fragment.jsonSchema,
        }
      }
      return merge({}, mergedSchema, schema)
    }, schema.jsonSchema)

    return mergedSchema
  }
}

export default new SchemaApi()