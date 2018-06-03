<template>
  <section class="container">
    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">Schemas</h2>
      <sui-table striped>
        <sui-table-header>
          <sui-table-row>
            <sui-table-header-cell :width="1">ID</sui-table-header-cell>
            <sui-table-header-cell :width="5">Name</sui-table-header-cell>
            <sui-table-header-cell :width="2">Version</sui-table-header-cell>
            <sui-table-header-cell :width="5">Fragment Schema</sui-table-header-cell>
            <sui-table-header-cell :width="3"></sui-table-header-cell>
          </sui-table-row>
        </sui-table-header>
        <sui-table-body>
          <sui-table-row v-for="entity of data" :key="entity.id">
            <sui-table-cell :width="1">{{ entity.id }}</sui-table-cell>
            <sui-table-cell :width="5">{{ entity.name }}</sui-table-cell>
            <sui-table-cell :width="2">{{ entity.version }}</sui-table-cell>
            <sui-table-cell :width="5">
              <nuxt-link :to="{name: 'fragment-schemas-fragmentSchema', params: {fragmentSchema: entity.fragmentSchema.id} }">
                {{ entity.fragmentSchema.name }}
              </nuxt-link>
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

import Api from '~/models/DataFragmentApi'

export default {
  async asyncData({env}) {
    const data = await Api.getAll()
    return {data}
  },
  methods: {
    editRoute(entity) {
      return {name: 'data-fragments-dataFragment', params: {dataFragment: entity.id} }
    }
  }
}
</script>
