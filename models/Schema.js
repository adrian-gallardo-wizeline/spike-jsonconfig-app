import get from 'lodash/get'
import set from 'lodash/set'
import merge from 'lodash/merge'
import SchemaApi from './SchemaApi'

class Schema {

  static fromArray(schemas) {
    return schemas.map(schema => new Schema(schema))
  }

  constructor(data) {
    this.data = data
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

  getId() {
    return this.data.id
  }

  getName() {
    return this.data.name
  }

  getVersion() {
    return this.data.version
  }

  getJsonSchema() {
    return this.data.jsonSchema
  }

  async getParentSchema() {
    if (!this.data.parentSchema) {
      return null
    }
    if (typeof this.data.parentSchema === 'number') {
      this.data.parentSchema = await SchemaApi.get(this.data.parentSchema)
    }
    if (!(this.data.parentSchema instanceof Schema)) {
      this.data.parentSchema = new Schema(this.data.parentSchema)
    }
    return this.data.parentSchema
  }

  async fetchHierarchy() {
    let parentSchema = await this.getParentSchema()
    while (parentSchema) {
      parentSchema = await parentSchema.getParentSchema()
    }
    return parentSchema
  }

  getMergedSchema() {
    let jsonSchema = {}
    let schema = this
    while(schema) {
      jsonSchema = merge({}, schema.getData().jsonSchema, jsonSchema)
      schema = schema.parentSchema
    }
    return jsonSchema
  }

  toString() {
    return this.data.name
  }

}

export default Schema