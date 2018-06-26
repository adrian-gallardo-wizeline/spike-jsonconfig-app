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
    const url = data.id ? `${this.endpoint}/${data.id}` : this.endpoint
    const requestMethod = data.id ? axios.patch : axios.post

    const { dataFragments, schema, snapshots, ...shallowData } = data
    shallowData.schema = schema ? schema.id : null
    shallowData.dataFragments = dataFragments ?
      dataFragments.map(dataFragment => dataFragment.id) :
      []

    await requestMethod(url, shallowData).then(response => response.data)
  }

  getSnapshotUrl(configIdentifier, version) {
    return `${process.env.API_URL}/config/${configIdentifier}?v=${version}`
  }

}

export default new DataFragmentApi()