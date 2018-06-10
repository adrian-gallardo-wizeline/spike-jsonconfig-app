<template>
  <sui-button :color="color" :size="size" :compact="compact">
    <i :class="icon"></i>
    {{ label }}
  </sui-button>
</template>

<script>
const buttonConfig = {
  edit: {
    label: 'Edit',
    icon: 'pencil alternate icon'
  },
}
const buttonContextConfig = {
  table: {
    color: 'blue',
    size: 'mini',
    compact: true,
  }
}
export default {
  props: ['type', 'context'],
  computed: {
    label() {
      return buttonConfig[this.type].label
    },
    icon() {
      return buttonConfig[this.type].icon
    },
    color() {
      return buttonContextConfig[this.context].color
    },
    size() {
      return buttonContextConfig[this.context].size
    },
    compact() {
      return buttonContextConfig[this.context].compact
    }
  }
}
</script>
