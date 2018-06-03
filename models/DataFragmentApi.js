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
    const url = `${this.endpoint}/${data.id}`

    const { fragmentSchema, datas, ...shallowData } = data

    await axios.patch(url, shallowData).then(response => response.data)
  }
}

export default new DataFragmentApi()