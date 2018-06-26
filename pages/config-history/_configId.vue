<template>
  <section class="container">
    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        Config history - {{ config.name }} ({{ config.identifier }})
      </h2>
      <sui-table striped>
        <sui-table-header>
          <sui-table-row>
            <sui-table-header-cell :width="10">Version</sui-table-header-cell>
            <sui-table-header-cell :width="3">Created At</sui-table-header-cell>
            <sui-table-header-cell :width="3"></sui-table-header-cell>
          </sui-table-row>
        </sui-table-header>
        <sui-table-body>
          <sui-table-row v-for="configSnapshot of configSnapshots" :key="configSnapshot.id">
            <sui-table-cell :width="10">{{ configSnapshot.version }}</sui-table-cell>
            <sui-table-cell :width="3">{{ getSnapshotDate(configSnapshot) }}</sui-table-cell>
            <sui-table-cell :width="3" textAlign="center">
              <a :href="getSnapshotUrl(configSnapshot)" target="_blank">
                <sui-button color="blue" size="mini" :compact="true">
                  <i class="search icon"></i>
                  View
                </sui-button>
              </a>
            </sui-table-cell>
          </sui-table-row>
        </sui-table-body>
      </sui-table>
    </div>
  </section>
</template>

<script>

import DataApi from '~/models/DataApi'
import ConfigSnapshotApi from '~/models/ConfigSnapshotApi'
import moment from 'moment'

export default {
  async asyncData({params}) {
    const configId = parseInt(params.configId)
    const config = await DataApi.get(configId)
    const configSnapshots = await ConfigSnapshotApi.getForConfig(configId)
    return {
      config,
      configSnapshots,
    }
  },
  methods: {
    getSnapshotDate(configSnapshot) {
      return moment(configSnapshot.createdAt).format('YYYY-MM-DD')
    },
    getSnapshotUrl(configSnapshot) {
      return DataApi.getSnapshotUrl(this.config.identifier, configSnapshot.version)
    },
  }
}
</script>
