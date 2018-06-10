<template>
  <section class="container">
    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        Schemas

        <nuxt-link :to="{ name: 'schemas-schema', params: {'schema': 'new'} }">
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
            <sui-table-header-cell :width="4">Name</sui-table-header-cell>
            <sui-table-header-cell :width="2">Version</sui-table-header-cell>
            <sui-table-header-cell :width="3">Parent Schema</sui-table-header-cell>
            <sui-table-header-cell :width="3">Child Schemas</sui-table-header-cell>
            <sui-table-header-cell :width="3"></sui-table-header-cell>
          </sui-table-row>
        </sui-table-header>
        <sui-table-body>
          <sui-table-row v-for="schema of schemas" :key="schema.id">
            <sui-table-cell :width="1">{{ schema.id }}</sui-table-cell>
            <sui-table-cell :width="4">{{ schema.name }}</sui-table-cell>
            <sui-table-cell :width="2">{{ schema.version }}</sui-table-cell>
            <sui-table-cell :width="3">
              <schema-link :schema="schema.parentSchema" />
            </sui-table-cell>
            <sui-table-cell :width="3">
              <list-of-links :models="schema.childSchemas">
                <template slot-scope="scope">
                  <schema-link :schema="scope.model" />
                </template>
              </list-of-links>
            </sui-table-cell>
            <sui-table-cell :width="3" textAlign="center">
              <schema-link :schema="schema">
                <ui-button type="edit" context="table" />
              </schema-link>
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

import UiButton from '~/components/ui/Button'
import ListOfLinks from '~/components/ui/ListOfLinks'
import SchemaLink from '~/components/schema/SchemaLink'

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
  components: {
    ListOfLinks,
    SchemaLink,
    UiButton,
  }
}
</script>
