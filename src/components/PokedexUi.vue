<template>
  <div class="min-h-screen bg-gray-50">
    <header class="text-black shadow-lg">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <h1 class="text-2xl font-bold cursor-pointer">
            Pokemon Explorer
          </h1>
          <button class=" px-4 py-2 rounded">
            Back to List
          </button>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div>
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Pokemon Collection</h2>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          <div v-for="pokemon in pokemonList" :key="pokemon.name" @click="viewPokemon(pokemon.name)"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105 transition-transform">
            <div class="p-4">
              <img :src="getPokemonImage(pokemon.url)" :alt="pokemon.name" class="w-full h-32 object-contain mb-3"
                loading="lazy" />
              <h3 class="text-lg font-semibold text-gray-800 capitalize text-center">
                {{ pokemon.name }}
              </h3>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-gray-600">
            Showing {{ (currentPage - 1) * 10 + 1 }} - {{ Math.min(currentPage * 10, totalPokemon) }} of {{ totalPokemon
            }} Pokemon
          </div>

          <div class="flex gap-2">
            <button @click="previousPage" :disabled="currentPage === 1"
              class="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
              Previous
            </button>

            <div class="flex gap-1">
              <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                'px-3 py-2 rounded transition-colors',
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-600'
              ]">
                {{ page }}
              </button>
            </div>

            <button @click="nextPage" :disabled="currentPage >= totalPages"
              class="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { onAuthStateChanged } from 'firebase/auth'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../../firebase-conf'
const router = useRouter()
const pokemonList = ref([])
const currentPage = ref(1)
const totalPokemon = ref(0)
const loading = ref(false)
const itemsPerPage = 10
onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.log("not logged in")
    router.push("/login")
  } else {
    console.log("logged in")
  }
})
const totalPages = computed(() => {
  return Math.ceil(totalPokemon.value / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const fetchPokemonList = async () => {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * itemsPerPage
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`)
    const data = await response.json()

    pokemonList.value = data.results
    totalPokemon.value = data.count
  } catch (error) {
    console.error('Error fetching Pokemon list:', error)
  } finally {
    loading.value = false
  }
}



const getPokemonImage = (url) => {
  const id = url.split('/').filter(Boolean).pop()
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}


const viewPokemon = async (name) => {
  router.push({ name: 'pokemon', params: { name: name } })
}


const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchPokemonList()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchPokemonList()
  }
}

const goToPage = async (page) => {
  currentPage.value = page
  await fetchPokemonList()
}

onMounted(async () => {
  await fetchPokemonList()
})
</script>
