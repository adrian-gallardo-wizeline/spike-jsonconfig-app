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
            <sui-table-header-cell :width="5">Parent Schema</sui-table-header-cell>
            <sui-table-header-cell :width="3"></sui-table-header-cell>
          </sui-table-row>
        </sui-table-header>
        <sui-table-body>
          <sui-table-row v-for="schema of schemas" :key="schema.id">
            <sui-table-cell :width="1">{{ schema.id }}</sui-table-cell>
            <sui-table-cell :width="5">{{ schema.name }}</sui-table-cell>
            <sui-table-cell :width="2">{{ schema.version }}</sui-table-cell>
            <sui-table-cell :width="5">{{ schema.parentSchema ? schema.parentSchema.name : '--' }}</sui-table-cell>
            <sui-table-cell :width="3" textAlign="center">
              <nuxt-link :to="editRoute(schema)">
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

import SchemaApi from '~/models/SchemaApi'
import Schema from '~/models/Schema'

export default {
  async asyncData({env}) {
    const schemas = await SchemaApi.getAll()
    return {schemas}
  },
  methods: {
    editRoute(schema) {
      return {name: 'schemas-schema', params: {schema: schema.id} }
    }
  },
}
</script>
