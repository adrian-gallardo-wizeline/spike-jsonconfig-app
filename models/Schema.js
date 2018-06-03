class Schema {
  constructor(data) {
    this.data = data
  }

  getData() {
    return this.data
  }

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
}

export default Schema