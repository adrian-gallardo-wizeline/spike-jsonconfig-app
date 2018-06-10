<template>
  <ul v-if="models && models.length > 0" class="pl-0 list-inline">
    <li class="list-inline-item" v-for="model of models" :key="model[idProp]">
      <slot :model="model"></slot>
    </li>
  </ul>
  <span v-else>--</span>
</template>

<script>
export default {
  props: ['models', 'name', 'id'],
  computed: {
    idProp() {
      return this.id || 'id'
    },
    nameProp() {
      return this.name || 'name'
    }
  }
}
</script>
