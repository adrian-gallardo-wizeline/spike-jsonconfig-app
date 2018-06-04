<template>
  <section class="container">
    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        Data Fragments
        
        <nuxt-link :to="{ name: 'data-fragments-id', params: {'id': 'new'} }">
          <sui-button color="orange" size="mini" :compact="true" floated="right">
            <i class="plus icon"></i>
            New
          </sui-button>
        </nuxt-link>
      </h2>
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
          <sui-table-row v-for="dataFragment of dataFragments" :key="dataFragment.id">
            <sui-table-cell :width="1">{{ dataFragment.id }}</sui-table-cell>
            <sui-table-cell :width="5">{{ dataFragment.name }}</sui-table-cell>
            <sui-table-cell :width="2">{{ dataFragment.version }}</sui-table-cell>
            <sui-table-cell :width="5">
              <nuxt-link :to="{name: 'fragment-schemas-fragmentSchema', params: {fragmentSchema: dataFragment.fragmentSchema.id} }">
                {{ dataFragment.fragmentSchema.name }}
              </nuxt-link>
            </sui-table-cell>
            <sui-table-cell :width="3" textAlign="center">
              <nuxt-link :to="editRoute(dataFragment)">
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
    const dataFragments = await Api.getAll()
    return {dataFragments}
  },
  methods: {
    editRoute(dataFragment) {
      return {name: 'data-fragments-id', params: {id: dataFragment.id} }
    }
  }
}
</script>
