<template>
  <nuxt-link v-if="schema" :to="{name: 'schemas-schema', params: {schema: schema.id} }">
    <slot>{{ schema.name }}</slot>
  </nuxt-link>
  <span v-else>--</span>
</template>

<script>
export default {
  props: ['schema']
}
</script>

