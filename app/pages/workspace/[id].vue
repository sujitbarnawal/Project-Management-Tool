<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSeo } from '@/composables/useSeo'
import { useWorkspace } from '@/composables/useWorkspace'
import { useBoard } from '@/composables/useBoard'

// SEO
useSeo('Workspace', 'Boards and tasks')

// Page meta
definePageMeta({
  middleware: 'auth'
})

// Route & router
const route = useRoute()
const router = useRouter()
const workspaceId = ref(route.params.id as string)

// Composables
const { fetchWorkspace, currentWorkspace } = useWorkspace()
const { boards, fetchBoards, createBoard, updateBoard, deleteBoard, loading } = useBoard()

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const boardToEdit = ref<any>(null)

// Form fields
const newBoardName = ref('')
const newBoardDescription = ref('')
const newBoardColor = ref('#0079BF')

// Board colors
const boardColors = [
  '#0079BF', // blue
  '#D29034', // orange
  '#519839', // green
  '#B04632', // red
  '#89609E', // purple
  '#CD5A91', // pink
  '#4BBF6B', // teal
  '#838C91', // gray
]

// Fetch workspace and boards
const loadWorkspaceData = async () => {
    await fetchWorkspace(workspaceId.value)
    await fetchBoards(workspaceId.value)
  try {
  } catch (err) {
    console.error('Error loading workspace or boards', err)
  }
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'owner':
      return 'bg-purple-100 text-purple-700';
    case 'admin':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

onMounted(() => loadWorkspaceData())

// Watch for route changes (switching workspace)
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      workspaceId.value = newId as string
      await loadWorkspaceData()
    }
  },
  { immediate: true } // This runs the logic as soon as the component is created
)

// Navigate to board page
const goToBoard = (boardId: string) => {
  router.push(`/board/${boardId}`)
}

// Create Board
const handleCreateBoard = async () => {
  if (!newBoardName.value.trim()) return alert('Board name is required')
  await createBoard({
    workspaceId: workspaceId.value,
    name: newBoardName.value,
    description: newBoardDescription.value,
    backgroundColor: newBoardColor.value
  })
  // Reset form
  newBoardName.value = ''
  newBoardDescription.value = ''
  newBoardColor.value = '#0079BF'
  showCreateModal.value = false
}

// Open edit modal
const handleOpenEdit = (board: any) => {
  boardToEdit.value = { ...board }
  showEditModal.value = true
}

// Update board
const handleUpdateBoard = async () => {
  if (!boardToEdit.value.name.trim()) return alert('Board name is required')
  await updateBoard(boardToEdit.value.id, {
    name: boardToEdit.value.name,
    description: boardToEdit.value.description,
    backgroundColor: boardToEdit.value.backgroundColor
  })
  showEditModal.value = false
}

// Delete board
const handleDeleteBoard = async (board: any) => {
  if (confirm(`Are you sure you want to delete "${board.name}"?`)) {
    await deleteBoard(board.id)
  }
}
</script>

<template>
<section class="min-h-screen bg-gray-50">
  <!-- Navbar -->
  <nav class="flex items-center justify-between px-6 py-4 bg-white shadow-md">
    <h1 class="text-2xl font-bold text-blue-600 cursor-pointer" @click="router.push('/dashboard')">TaskFlow</h1>
    <h2 class="text-gray-700 font-medium">{{ currentWorkspace?.name || 'Workspace' }}</h2>
  </nav>

  <!-- Main content -->
  <div class="max-w-6xl mx-auto px-6 py-8">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-gray-700">Boards</h3>
      <button @click="showCreateModal = true" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">+ New Board</button>
    </div>

    <!-- Boards Grid -->
    <div v-if="boards.length" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="board in boards" 
        :key="board.id" 
        :style="{ backgroundColor: board.backgroundColor || '#0079BF' }" 
        class="rounded-lg shadow hover:shadow-lg transition p-4 text-white relative cursor-pointer"
      >
        <h4 @click="goToBoard(board.id)" class="text-lg font-bold hover:underline">{{ board.name }}</h4>
        <p class="text-sm mt-1">{{ board.description || 'No description' }}</p>

        <!-- Actions -->
        <div class="absolute top-2 right-2 flex space-x-2">
          <button @click.stop="handleOpenEdit(board)" class="p-1 rounded hover:bg-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h.01M12 12h.01M18 12h.01"/>
            </svg>
          </button>
          <button @click.stop="handleDeleteBoard(board)" class="p-1 rounded hover:bg-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-200 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- No boards -->
    <div v-else class="text-center text-gray-500 mt-20">
      <p>No boards yet in this workspace.</p>
      <button @click="showCreateModal = true" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">+ Create Board</button>
    </div>
  </div>

  <!-- Workspace Members -->
        <div class="bg-white rounded-lg shadow-sm p-6 max-w-6xl mx-auto">
          <h3 class="text-lg font-semibold mb-4">
            Members ({{ currentWorkspace?.members?.length || 0 }})
          </h3>
          <div class="space-y-3">
            <div
              v-for="member in currentWorkspace?.members"
              :key="member.userId"
              class="flex items-center justify-between py-2"
            >
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold"
                >
                  {{ member.name.charAt(0).toUpperCase() }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                  <p class="text-xs text-gray-500">{{ member.email }}</p>
                </div>
              </div>
              <span
                class="px-3 py-1 text-xs font-medium rounded-full"
                :class="getRoleBadgeClass(member.role)"
              >
                {{ member.role }}
              </span>
            </div>
          </div>
        </div>


  <!-- Create Board Modal -->
  <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">Create Board</h3>
      <input v-model="newBoardName" placeholder="Board Name" class="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <textarea v-model="newBoardDescription" placeholder="Description (optional)" class="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      
      <p class="mb-2 font-medium text-gray-700">Choose Board Color</p>
      <div class="flex space-x-2 mb-3">
        <div 
          v-for="color in boardColors" 
          :key="color" 
          :style="{ backgroundColor: color }"
          @click="newBoardColor = color"
          :class="['w-8 h-8 rounded-full cursor-pointer border-2', newBoardColor === color ? 'border-black' : 'border-gray-200']"
        ></div>
      </div>

      <div class="flex justify-end space-x-3">
        <button @click="showCreateModal = false" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition">Cancel</button>
        <button @click="handleCreateBoard" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Create</button>
      </div>
    </div>
  </div>

  <!-- Edit Board Modal -->
  <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">Edit Board</h3>
      <input v-model="boardToEdit.name" placeholder="Board Name" class="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <textarea v-model="boardToEdit.description" placeholder="Description (optional)" class="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      
      <p class="mb-2 font-medium text-gray-700">Choose Board Color</p>
      <div class="flex space-x-2 mb-3">
        <div 
          v-for="color in boardColors" 
          :key="color" 
          :style="{ backgroundColor: color }"
          @click="boardToEdit.backgroundColor = color"
          :class="['w-8 h-8 rounded-full cursor-pointer border-2', boardToEdit.backgroundColor === color ? 'border-black' : 'border-gray-200']"
        ></div>
      </div>

      <div class="flex justify-end space-x-3">
        <button @click="showEditModal = false" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition">Cancel</button>
        <button @click="handleUpdateBoard" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Update</button>
      </div>
    </div>
  </div>

</section>
</template>