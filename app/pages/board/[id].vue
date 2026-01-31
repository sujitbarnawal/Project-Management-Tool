<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSeo } from '@/composables/useSeo'
import { useBoard } from '@/composables/useBoard'
import { useWorkspace } from '@/composables/useWorkspace'

// SEO
useSeo('Board', 'Manage your tasks and lists')

// Page meta
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const boardId = route.params.id as string

// Composables
const { fetchBoard, currentBoard, boards, loading: boardLoading } = useBoard()
const { currentWorkspace } = useWorkspace()

// Modals
const showCreateListModal = ref(false)
const newListTitle = ref('')
const lists = ref<any[]>([]) // just for UI

// Load board and populate lists placeholder
onMounted(async () => {
  await fetchBoard(boardId)
  // For now, dummy lists UI
  lists.value = currentBoard.value?.lists || []
})

// Add List (UI only)
const handleCreateList = () => {
  if (!newListTitle.value.trim()) return alert('List title is required')
  lists.value.push({
    id: Date.now(),
    title: newListTitle.value,
    tasks: []
  })
  newListTitle.value = ''
  showCreateListModal.value = false
}

// Add Task to a List (UI only)
const handleAddTask = (list: any) => {
  const taskTitle = prompt('Enter task title')
  if (taskTitle && taskTitle.trim() !== '') {
    list.tasks.push({ id: Date.now(), title: taskTitle })
  }
}
</script>

<template>
<section class="min-h-screen bg-gray-100">
  <!-- Navbar -->
  <nav class="flex items-center justify-between px-6 py-4 bg-white shadow-md">
    <h1 class="text-2xl font-bold text-blue-600 cursor-pointer" @click="router.push('/dashboard')">TaskFlow</h1>
    <h2 class="text-gray-700 font-medium">{{ currentBoard?.name || 'Board' }}</h2>
  </nav>

  <div class="px-6 py-8 max-w-7xl mx-auto">
    <!-- Workspace info -->
    <div class="mb-6 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-700">Workspace: {{ currentWorkspace?.name }}</h3>
      <button @click="showCreateListModal = true" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">+ Create List</button>
    </div>

    <!-- Lists Container -->
    <div class="flex space-x-6 overflow-x-auto pb-6">
      <div v-for="list in lists" :key="list.id" class="bg-white rounded-lg shadow p-4 w-64 flex-shrink-0">
        <div class="flex justify-between items-center mb-3">
          <h4 class="font-semibold text-gray-700">{{ list.title }}</h4>
          <button @click="list.tasks = []" class="text-gray-400 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Tasks -->
        <div class="space-y-2">
          <div v-for="task in list.tasks" :key="task.id" class="bg-gray-50 p-2 rounded shadow cursor-pointer hover:bg-gray-100 transition">
            {{ task.title }}
          </div>
        </div>

        <button @click="handleAddTask(list)" class="mt-3 w-full text-left text-blue-600 font-medium hover:underline">+ Add Task</button>
      </div>
    </div>
  </div>

  <!-- Create List Modal -->
  <div v-if="showCreateListModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">Create List</h3>
      <input v-model="newListTitle" placeholder="List Title" class="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <div class="flex justify-end space-x-3">
        <button @click="showCreateListModal = false" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition">Cancel</button>
        <button @click="handleCreateList" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Create</button>
      </div>
    </div>
  </div>
</section>
</template>
