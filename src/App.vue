<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
const route = useRoute()
//console.log(route.params)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
