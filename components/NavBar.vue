<template>
  <sui-menu>
    <sui-menu-item :active="$route.name === 'schemas'">
      <nuxt-link to="/schemas">Schemas</nuxt-link>
    </sui-menu-item>
    <sui-menu-item :active="$route.name === 'fragment-schemas'">
      <nuxt-link to="/fragment-schemas">Fragment Schemas</nuxt-link>
    </sui-menu-item>
    <sui-menu-item :active="$route.name === 'data-fragments'">
      <nuxt-link to="/data-fragments">Data Fragments</nuxt-link>
    </sui-menu-item>
    <sui-menu-item :active="$route.name === 'configs'">
      <nuxt-link to="/configs">Configs</nuxt-link>
    </sui-menu-item>
  </sui-menu>
</template>
