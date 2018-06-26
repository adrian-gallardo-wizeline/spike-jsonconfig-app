<template>
  <section class="container">
    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        Configs

        <nuxt-link :to="{ name: 'configs-id', params: {'id': 'new'} }">
          <sui-button color="orange" size="mini" :compact="true" floated="right">
            <i class="plus icon"></i>
            New
          </sui-button>
        </nuxt-link>
      </h2>
      <sui-table striped>
        <sui-table-header>
          <sui-table-row>
            <sui-table-header-cell :width="3">Name</sui-table-header-cell>
            <sui-table-header-cell :width="3">Identifier</sui-table-header-cell>
            <sui-table-header-cell :width="2">Version</sui-table-header-cell>
            <sui-table-header-cell :width="4">Schema</sui-table-header-cell>
            <!-- <sui-table-header-cell :width="3">Data Fragments Used</sui-table-header-cell> -->
            <sui-table-header-cell :width="4"></sui-table-header-cell>
          </sui-table-row>
        </sui-table-header>
        <sui-table-body>
          <sui-table-row v-for="config of configs" :key="config.id">
            <sui-table-cell :width="3">{{ config.name }}</sui-table-cell>
            <sui-table-cell :width="3">{{ config.identifier }}</sui-table-cell>
            <sui-table-cell :width="2">{{ config.version }}</sui-table-cell>
            <sui-table-cell :width="4">
              <nuxt-link :to="{name: 'schema-schema', params: {schema: config.schema.id} }">
                {{ config.schema.name }}
              </nuxt-link>
            </sui-table-cell>
            <!-- <sui-table-cell :width="3">
              <ul class="pl-0 list-inline" v-for="dataFragment of config.dataFragments" :key="dataFragment.id">
                <li class="list-inline-item">
                  <nuxt-link :to="editDataFragmentRoute(dataFragment)">
                    {{ dataFragment.name }}
                  </nuxt-link>
                </li>
              </ul>
            </sui-table-cell> -->
            <sui-table-cell :width="4" textAlign="center">
              <nuxt-link :to="historyRoute(config)">
                <sui-button color="green" size="mini" :compact="true" style="margin-right: 6px;">
                  <i class="history icon"></i>
                  History
                </sui-button>
              </nuxt-link>
              <nuxt-link :to="editRoute(config)">
                <sui-button color="blue" size="mini" :compact="true">
                  <i class="pencil alternate icon"></i>
                  Edit
                </sui-button>
              </nuxt-link>
            </sui-table-cell>
          </sui-table-row>
        </sui-table-body>
      </sui-table>
    </div>
  </section>
</template>

<script>

import Api from '~/models/DataApi'

export default {
  async asyncData({env}) {
    const configs = await Api.getAll()
    return {configs}
  },
  methods: {
    editRoute(config) {
      return {name: 'configs-id', params: {id: config.id} }
    },
    historyRoute(config) {
      return {name: 'config-history-configId', params: {configId: config.id} }
    },
    editDataFragmentRoute(dataFragment) {
      return {name: 'data-fragments-dataFragment', params: {dataFragment: dataFragment.id} }
    }
  }
}
</script>
