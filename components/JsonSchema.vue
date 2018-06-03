<template>
  <pre>
    <code style="white-space: pre;">
      {{ mergedSchema }}
    </code>
  </pre>
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
