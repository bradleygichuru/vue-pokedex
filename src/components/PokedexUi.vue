<script setup>
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../../firebase-conf'
const router = useRouter()
const pokemonList = ref([])
const currentPage = ref(1)
const totalPokemon = ref(0)
const loading = ref(false)
const itemsPerPage = 10
const searchTerm = ref('')
const allPokemon = ref([])
const isLoggedIn = ref(false)
const isSearchActive = computed(() => {
  return searchTerm.value.trim().length > 0
})

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/login")
  })

}
onAuthStateChanged(auth, (user) => {
  if (!user) {
    isLoggedIn.value = false
    console.log("not logged in")
    router.push("/login")
  } else {
    isLoggedIn.value = true
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


const displayedPokemon = computed(() => {
  return isSearchActive.value ? filteredPokemon.value : pokemonList.value
})
const fetchAllPokemon = async () => {
  try {
    // Fetch first 151 Pokemon (or adjust as needed)
    const limit = 151
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
    const data = await response.json()
    allPokemon.value = data.results
  } catch (error) {
    console.error('Error fetching all Pokemon:', error)
  }
}
const handleSearch = () => {
  if (isSearchActive.value) {
    currentPage.value = 1
  }
}
watch(searchTerm, () => {
  handleSearch()
})
const filteredPokemon = computed(() => {
  if (!isSearchActive.value) return []

  const term = searchTerm.value.toLowerCase().trim()
  return allPokemon.value.filter(pokemon =>
    pokemon.name.toLowerCase().includes(term)
  )
})

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
  await fetchAllPokemon()
})
</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <header class="text-black shadow-lg">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <h1 class="text-2xl font-bold cursor-pointer">
            Pokemon Explorer
          </h1>
          <button class="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded transition-colors" v-if="isLoggedIn"
            type="button" @click="handleSignOut()">Logout</button>
        </nav>
      </div>

    </header>
    <div class="m-6">
      <div class="relative max-w-md mx-auto">
        <input v-model="searchTerm" type="text" placeholder="Search Pokemon by name..."
          class="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="handleSearch" />
        <div class="absolute left-3 top-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button v-if="searchTerm" @click="clearSearch" class="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <main class="container mx-auto px-4 py-8">
      <div>
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Pokemon Collection</h2>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          <div v-for="pokemon in displayedPokemon" :key="pokemon.name" @click="viewPokemon(pokemon.name)"
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

        <div v-if="!isSearchActive && displayedPokemon.length > 0"
          class="flex flex-col sm:flex-row justify-between items-center gap-4">
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
