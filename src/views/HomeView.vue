<script setup>
import PokedexUi from '../components/PokedexUi.vue'
import { auth } from '../../firebase-conf'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
</script>

<template>
  <main>
    <PokedexUi />
  </main>
</template>
