<template>
  <section class="container">
    <div>
      <h2 is="sui-header" class="heading" textAlign="left" :dividing="true">
        Fragment Schemas

        <nuxt-link :to="{ name: 'fragment-schemas-id', params: {'id': 'new'} }">
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
            <sui-table-header-cell :width="5">Composed Schemas</sui-table-header-cell>
            <sui-table-header-cell :width="3"></sui-table-header-cell>
          </sui-table-row>
        </sui-table-header>
        <sui-table-body>
          <sui-table-row v-for="fragmentSchema of fragmentSchemas" :key="fragmentSchema.id">
            <sui-table-cell :width="1">{{ fragmentSchema.id }}</sui-table-cell>
            <sui-table-cell :width="5">{{ fragmentSchema.name }}</sui-table-cell>
            <sui-table-cell :width="2">{{ fragmentSchema.version }}</sui-table-cell>
            <sui-table-cell :width="5">
              <ul class="pl-0 list-inline" v-for="schema of fragmentSchema.composedSchemas" :key="schema.id">
                <li class="list-inline-item">
                  <nuxt-link :to="{name: 'schemas-schema', params: {schema: schema.id} }">
                    {{ schema.name }}
                  </nuxt-link>
                </li>
              </ul>
            </sui-table-cell>
            <sui-table-cell :width="3" textAlign="center">
              <nuxt-link :to="{name: 'fragment-schemas-id', params: {id: fragmentSchema.id} }">
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

import FragmentSchemaApi from '~/models/FragmentSchemaApi'

export default {
  async asyncData({env}) {
    const fragmentSchemas = await FragmentSchemaApi.getAll()
    return {fragmentSchemas}
  },
}
</script>
