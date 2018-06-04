import axios from 'axios'

class DataFragmentApi {

  constructor() {
    this.endpoint = `${process.env.API_URL}/datafragment`
  }

  async getAll() {
    return await axios.get(this.endpoint).then(response => response.data)
  }

  async get(id) {
    const url = `${this.endpoint}/${id}`
    return await axios.get(url).then(response => response.data)
  }

  async save(data) {
    const url = data.id ? `${this.endpoint}/${data.id}` : this.endpoint
    const requestMethod = data.id ? axios.patch : axios.post

    const { fragmentSchema, datas, ...shallowData } = data
    shallowData.fragmentSchema = fragmentSchema ? fragmentSchema.id : null

    await requestMethod(url, shallowData).then(response => response.data)
  }
}

export default new DataFragmentApi()