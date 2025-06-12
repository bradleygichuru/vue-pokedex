<script setup>
import PokedexUi from '../components/PokedexUi.vue'
import { auth } from '../../firebase-conf'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
const router = useRouter()
onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.log("not logged in")
    router.push("/login")
  } else {
    console.log("logged in")
  }
})
</script>

<template>
  <main>
    <PokedexUi />
  </main>
</template>
