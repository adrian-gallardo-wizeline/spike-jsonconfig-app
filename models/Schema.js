import get from 'lodash/get'
import set from 'lodash/set'
import SchemaApi from './SchemaApi'

class Schema {
  constructor(data) {
    this.data = data

    if (this.data.parentSchema && this.data.parentSchema !== 'number') {
      this.data.parentSchema = new Schema(this.data.parentSchema)
    }
    if (this.data.childSchemas) {
      this.data.childSchemas.map(childSchema => {
        return typeof childSchema === 'number' ? childSchema : new Schema(childSchema)
      })
    }
  }

  getData() {
    return this.data
  }

  // get(path, defaultValue = null) {
  //   return get(this.data, path, defaultValue)
  // }

  // set(path, value) {
  //   return set(this.data, path, value)
  // }

  getJsonSchemaWithMergedFragments() {
    const fragments = this.data.composedFragments || []
    return fragments.reduce((mergedSchema, fragment) => {

      // We have to merge the new props in the parent schema properties
      const schema = {
        properties: {
          [fragment.baseProp]: fragment.jsonSchema,
        }
      }
      return merge({}, mergedSchema, schema)
    }, this.data.jsonSchema)
  }

  async getJsonSchemaWithMergedHierarchy() {
    // await SchemaApi.populateSchemaHierarchyIfNeeded(this)
  }

  getId() {
    return this.data.id
  }

  getName() {
    return this.data.name
  }

  getVersion() {
    return this.data.version
  }

  async getParentSchema() {
    if (typeof this.data.parentSchema === 'number') {
      this.data.parentSchema = await SchemaApi.get(this.data.parentSchema)
    }
    return this.data.parentSchema
  }

  toString() {
    return this.data.name
  }
}

export default Schema