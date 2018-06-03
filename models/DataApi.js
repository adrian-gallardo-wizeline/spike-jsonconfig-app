import axios from 'axios'
import SchemaApi from '~/models/SchemaApi'
import merge from 'lodash/merge'

class DataFragmentApi {

  constructor() {
    this.endpoint = `${process.env.API_URL}/data`
  }

  async getAll() {
    return await axios.get(this.endpoint).then(response => response.data)
  }

  async get(id) {
    const url = `${this.endpoint}/${id}`
    return await axios.get(url).then(response => response.data)
  }

  async save(data) {
    const url = `${this.endpoint}/${data.id}`

    const { dataFragments, schema, ...shallowData } = data

    await axios.patch(url, shallowData).then(response => response.data)
  }

  async getMergedSchema(data) {
    const schemaHierarchy = await SchemaApi.resolveSchemaHierarchy(data.schema)
    const flatenSchemaHierarchy = SchemaApi.flatenSchemaHierarchy(schemaHierarchy)

    return this.mergeJsonSchema(flatenSchemaHierarchy)
  }

  mergeJsonSchema(schemas) {
    return schemas.reduce((mergedSchema, currentSchema) => {
      return merge({}, mergedSchema, SchemaApi.mergeFragmentSchemas(currentSchema))
    }, {})
  }
}

export default new DataFragmentApi()