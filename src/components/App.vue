<script setup lang="ts">
import Menu from '@/components/Menu.vue';
import Info from '@/components/Info.vue';
import Error from '@/components/Error.vue';
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <Menu />
    <Info />
    <Error />
    <RouterView />
  </div>
</template>