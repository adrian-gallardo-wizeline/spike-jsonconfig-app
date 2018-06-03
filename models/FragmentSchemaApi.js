import axios from 'axios'

class FragmentSchemaApi {

  constructor() {
    this.endpoint = `${process.env.API_URL}/fragmentschema`
  }

  async getAll() {
    return await axios.get(this.endpoint).then(response => response.data)
  }

  async get(id) {
    const url = `${this.endpoint}/${id}`
    return await axios.get(url).then(response => response.data)
  }

  async save(fragmentschema) {
    const url = `${this.endpoint}/${fragmentschema.id}`

    const {composedSchemas, dataFragments, ...shallowData} = fragmentschema

    await axios.patch(url, shallowData).then(response => response.data)
  }

  async getBySchema(schemaId) {
    const fragments = await this.getAll()
    
    return fragments.filter(fragmentSchema => {
      return fragmentSchema.composedSchemas.some(schema => schema.id === schemaId)
    })
  }
}

export default new FragmentSchemaApi()