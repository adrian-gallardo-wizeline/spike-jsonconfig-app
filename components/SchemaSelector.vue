<template>
  <sui-grid class="grid">
    <sui-grid-row class="pt-0">
      <sui-grid-column :width="15">
        <sui-dropdown
          fluid
          placeholder="Select Parent Schema"
          selection
          :options="dropdownOptions"
          v-model="selectedValueId"
          :multiple="multiple"
        />
      </sui-grid-column>
      <sui-grid-column :width="1">
        <sui-icon v-if="hasValue" @click="removeSelected" color="red" size="large" name="times circle outline" />
      </sui-grid-column>
    </sui-grid-row>
  </sui-grid>
</template>

<script>
export default {
  props: ['schemas', 'excludedSchema', 'value', 'multiple'],
  data() {
    return {
      selectedValueId: this.value,
    }
  },
  computed: {
    dropdownOptions() {
      var options = this.schemas
      if (this.excludedSchema && this.excludedSchema.id) {
        options = options.filter(schema => {
          return this.excludedSchema.id ? schema.id !== this.excludedSchema.id : true
        })
      }
      
      options = options.map(schema => {
        return { text: schema.name, value: schema.id }
      })
      return options
    },
    selectedValue() {
      if (!this.selectedValueId) {
        return
      }
      if (this.selectedValueId instanceof Array) {
        return this.selectedValueId.map(schemaId => this.findSchema(schemaId))
      }
      return this.findSchema(this.selectedValueId)
    },
    hasValue() {
      return this.selectedValueId instanceof Array ?
        this.selectedValueId.length > 0 :
        !!this.selectedValueId
    }
  },
  methods: {
    removeSelected() {
      this.selectedValueId = null
    },
    findSchema(schemaId) {
      return this.schemas.find(schema => schema.id === schemaId)
    },
  },
  watch: {
    selectedValueId(value) {
       this.$emit('select', this.selectedValue)
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

