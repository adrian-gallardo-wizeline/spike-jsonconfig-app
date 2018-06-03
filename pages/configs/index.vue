<template>
  <section class="container">
    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">Configs</h2>
      <sui-table striped>
        <sui-table-header>
          <sui-table-row>
            <sui-table-header-cell :width="1">ID</sui-table-header-cell>
            <sui-table-header-cell :width="4">Name</sui-table-header-cell>
            <sui-table-header-cell :width="2">Version</sui-table-header-cell>
            <sui-table-header-cell :width="3">Schema</sui-table-header-cell>
            <sui-table-header-cell :width="3">Data Fragments Used</sui-table-header-cell>
            <sui-table-header-cell :width="3"></sui-table-header-cell>
          </sui-table-row>
        </sui-table-header>
        <sui-table-body>
          <sui-table-row v-for="entity of data" :key="entity.id">
            <sui-table-cell :width="1">{{ entity.id }}</sui-table-cell>
            <sui-table-cell :width="4">{{ entity.name }}</sui-table-cell>
            <sui-table-cell :width="2">{{ entity.version }}</sui-table-cell>
            <sui-table-cell :width="3">
              <nuxt-link :to="{name: 'schema-schema', params: {schema: entity.schema.id} }">
                {{ entity.schema.name }}
              </nuxt-link>
            </sui-table-cell>
            <sui-table-cell :width="3">
              <ul class="pl-0 list-inline" v-for="dataFragment of entity.dataFragments" :key="dataFragment.id">
                <li class="list-inline-item">
                  <nuxt-link :to="editDataFragmentRoute(dataFragment)">
                    {{ dataFragment.name }}
                  </nuxt-link>
                </li>
              </ul>
            </sui-table-cell>
            <sui-table-cell :width="3" textAlign="center">
              <nuxt-link :to="editRoute(entity)">
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
    const data = await Api.getAll()
    return {data}
  },
  methods: {
    editRoute(entity) {
      return {name: 'configs-id', params: {id: entity.id} }
    },
    editDataFragmentRoute(dataFragment) {
      return {name: 'data-fragments-dataFragment', params: {dataFragment: dataFragment.id} }
    }
  }
}
</script>
