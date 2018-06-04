<template>
  <sui-grid class="grid">
    <sui-grid-row class="pt-0">
      <sui-grid-column :width="8">
        <sui-dropdown
          fluid
          placeholder="Select Parent Schema"
          selection
          :options="dropdownOptions"
          v-model="selectedSchemaId"
        />
      </sui-grid-column>
      <sui-grid-column :width="2">
        <sui-icon v-if="selectedSchemaId" @click="removeSelected" color="red" size="large" name="times circle outline" />
      </sui-grid-column>
    </sui-grid-row>
  </sui-grid>
</template>

<script>
export default {
  props: ['schemas', 'excludedSchema', 'selectedSchemaId'],
  computed: {
    dropdownOptions() {
      var options = this.schemas.filter(schema => {
        return this.excludedSchema.id ? schema.id !== this.excludedSchema.id : true
      }).map(schema => {
        return { text: schema.name, value: schema.id }
      })
      return options
    },
    selectedSchema() {
      return this.schemas.find(schema => schema.id === this.selectedSchemaId)
    }
  },
  methods: {
    removeSelected() {
      this.selectedSchemaId = null
    }
  },
  watch: {
    selectedSchemaId(value) {
       this.$emit('select', this.selectedSchema)
    }
  }
}
</script>

<style lang="scss" scoped>
.grid {
  margin: 0!important;
}
.grid /deep/ .column {
  padding-right: 0!important;
}
.grid /deep/ .column + .column {
  padding-left: 7px!important;
  padding-top: 7px!important;
  cursor: pointer;
}
</style>

