import axios from 'axios'
import merge from 'lodash/merge'

import SchemaApi from '~/models/SchemaApi'

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

  getMergedConfig(data) {
    const config = data.jsonData
    const mergedSchema = SchemaApi.getMergedSchema(data.schema)
    const extractedProps = SchemaApi.extractProps(mergedSchema)
    const mergedFragmentsConfig = this.getMergedFragmentsConfig(data.dataFragments)
    
    return merge({}, extractedProps, mergedFragmentsConfig, config)
  }

  getMergedFragmentsConfig(dataFragments) {
    const config = {}
    dataFragments.forEach(dataFragment => {
      const baseProp = dataFragment.fragmentSchema.baseProp
      const dataFragmentConfig = baseProp ?
        {[baseProp]: dataFragment.jsonData} :
        dataFragment.jsonData

      merge(config, dataFragmentConfig)
    })
    return config
  }
}

export default new DataFragmentApi()