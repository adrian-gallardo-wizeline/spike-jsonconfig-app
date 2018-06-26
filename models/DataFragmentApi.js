import axios from 'axios'
import merge from 'lodash/merge'
import setProp from 'lodash/set'
import defaultsDeep from 'lodash/defaultsDeep'
import cloneDeep from 'lodash/cloneDeep'

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
    // const otro = {"tenancy": {"aggregationApiUrl": "https://api.nationalgeographic.com/aggregation/v1/pages","clientAggregationApiKey": "OQg14wSkwkcyeZvsmZbv410LlD3rvn3b","serverSideAggregationApiKey": "NAQoa0treifoFzv2lWBk7CuXYSG1AZKK","sitemaps": ["https://relay.nationalgeographic.com/proxy/distribution/public/sitemap/%NATGEO_DOMAIN%/index.xml", "https://relay.nationalgeographic.com/proxy/distribution/public/sitemap/%NATGEO_DOMAIN%/news.xml"],"ads": {"freewheel": {"name": "Freewheel","env": {"prod": {"networkId": "511407","subdomain": "7cdaf","profile": "511407:natgeo_intl_display_linktag2_live"},"test": {"networkId": "511406","subdomain": "7cdae","profile": ""}},"preRoll": {"policyID": "24218898"}}},"analytics": {"googleTagManager": {"id": ""},"tealium": {"scriptUrl": "https://tags.tiqcdn.com/utag/fox/natgeo/dev/utag.js"}},"locale": {"abbreviation": "uk","country": "United Kingdom","language": "en-UK"},"navBarProps": {"showMenu": false,"loadRegistration": false,"showSearch": false,"showShop": false,"showSubscribe": false,"showSubheading": false,"showExtraLinks": false,"extraLinks": [{"show": false,"anchorText": "Where to Watch","anchorURL": "/where-to-watch"}, {"show": false,"anchorText": "TV Schedule","anchorURL": "/television-schedule"}],"endpoint": "https://appservices-staging.nationalgeographic.com/api/v1/globalnav/grouped/?topnav=chip-top-nav&contextualnav=chip-dev-nav&sitemenu=chip-test-nav&show_card"},"notFoundPage": "/404","video": {"providers": [{"name": "MPX","defaultAdNetwork": "Freewheel","account": {"name": "ngp","accountId": "XRRASC","lang": "uk"},"playerUrls": {"foxDev": "https://videoplayer-qa.int.ngeo.com/v1.9.6/?network=ngp-global-sites","foxQA": "https://videoplayer.nationalgeographic.com/v1.9.6/qa?network=ngp-global-sites","stable": "https://videoplayer.nationalgeographic.com/v1.9.6/?network=ngp-global-sites"}}]}}}
    return merge({}, extractedProps, config, mergedFragmentsConfig)
  }

  getMergedFragmentsConfig(dataFragments = []) {
    const config = {}
    dataFragments.forEach(dataFragment => {
      const baseProp = dataFragment.fragmentSchema.baseProp || 'tenancy.analytics' // TODO: REMOVE HARDCODED VALUE
      const dataFragmentConfig = baseProp ?
        setProp({}, baseProp, dataFragment.jsonData) :
        dataFragment.jsonData
      
      merge(config, dataFragmentConfig)
    })
    return config
  }
}

export default new DataFragmentApi()