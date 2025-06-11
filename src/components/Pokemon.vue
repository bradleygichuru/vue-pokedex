<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
console.log({ name: route.params.name })
const loadingDetail = ref(false)
onMounted(async () => {
  await fetchPokemonDetail(route.params.name)

})
const selectedPokemon = ref(null)
const fetchPokemonDetail = async (name) => {
  loadingDetail.value = true
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    const data = await response.json()
    selectedPokemon.value = data
  } catch (error) {
    console.error('Error fetching Pokemon detail:', error)
  } finally {
    loadingDetail.value = false
  }
}

const getTypeColor = (type) => {
  const colors = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300'
  }
  return colors[type] || 'bg-gray-400'
}


</script>
<template>
  <main>
    <header class="text-black shadow-lg">
      <div class="container mx-auto mt-2 px-4 py-4">
        <nav class="flex items-center justify-between">
          <h1 class="text-2xl font-bold cursor-pointer" @click="router.push('/')">
            Pokemon Explorer
          </h1>
          <button v-if="currentView !== 'list'" @click="router.push('/')"
            class="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
            Back to List
          </button>
        </nav>
      </div>
    </header>

    <div v-if="loadingDetail" class="flex justify-center items-center py-12 m-3">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="selectedPokemon" class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="md:flex">
          <!-- Pokemon Image -->
          <div class="md:w-1/2 bg-gradient-to-br from-blue-100 to-purple-100 p-8 flex items-center justify-center">
            <img
              :src="selectedPokemon.sprites.other['official-artwork'].front_default || selectedPokemon.sprites.front_default"
              :alt="selectedPokemon.name" class="w-64 h-64 object-contain" />
          </div>

          <!-- Pokemon Info -->
          <div class="md:w-1/2 p-8">
            <h1 class="text-4xl font-bold text-gray-800 capitalize mb-2">
              {{ selectedPokemon.name }}
            </h1>
            <p class="text-gray-600 mb-4">#{{ selectedPokemon.id.toString().padStart(3, '0') }}</p>

            <!-- Types -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">Types</h3>
              <div class="flex gap-2">
                <span v-for="type in selectedPokemon.types" :key="type.type.name" :class="'bg-gray-400'"
                  class="px-3 py-1 rounded-full text-white text-sm font-medium capitalize">
                  {{ type.type.name }}
                </span>
              </div>
            </div>

            <!-- Stats -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-3">Base Stats</h3>
              <div class="space-y-2">
                <div v-for="stat in selectedPokemon.stats" :key="stat.stat.name" class="flex items-center">
                  <div class="w-24 text-sm text-gray-600 capitalize">
                    {{ stat.stat.name.replace('-', ' ') }}
                  </div>
                  <div class="flex-1 mx-3">
                    <div class="bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        :style="{ width: Math.min((stat.base_stat / 255) * 100, 100) + '%' }"></div>
                    </div>
                  </div>
                  <div class="w-12 text-sm font-medium text-gray-800">
                    {{ stat.base_stat }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Physical Info -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-700 mb-1">Height</h4>
                <p class="text-2xl font-bold text-blue-600">{{ (selectedPokemon.height / 10).toFixed(1) }}m</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-700 mb-1">Weight</h4>
                <p class="text-2xl font-bold text-blue-600">{{ (selectedPokemon.weight / 10).toFixed(1) }}kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

</template>
