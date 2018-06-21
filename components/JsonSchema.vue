<template>
  <sui-segment>
    <code class="code">{{ mergedSchema }}</code>
  </sui-segment>
</template>

<script>
import SchemaApi from '~/models/SchemaApi'

export default {
  props: ['schema'],
  data() {
    return {
      ready: false,
    }
  },
  computed: {
    mergedSchema() {
      return JSON.stringify(SchemaApi.getMergedSchema(this.schema), null, 2)
    },
  },
}
</script>

<style lang="scss" scoped>
.code {
  white-space: pre;
  display: block;
  height: 100%;
  overflow: scroll;
}
</style>
