<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useWorkspace } from '@/composables/useWorkspace'
import { useSeo } from '@/composables/useSeo'

useSeo('Dashboard', 'Your workspace dashboard')

definePageMeta({
  middleware: 'auth'
})

const { user, logout } = useAuth()
const { workspaces, fetchWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace, loading } = useWorkspace()


const showCreateModal = ref(false)
const showEditModal = ref(false)
const workspaceToEdit = ref<any>(null)

const newWorkspaceName = ref('')
const newWorkspaceDescription = ref('')

onMounted(async () => {
  await fetchWorkspaces()
})

const handleCreateWorkspace = async () => {
  if (!newWorkspaceName.value.trim()) return alert('Workspace name is required')
  await createWorkspace({ name: newWorkspaceName.value, description: newWorkspaceDescription.value })
  newWorkspaceName.value = ''
  newWorkspaceDescription.value = ''
  showCreateModal.value = false
}

const handleOpenEdit = (workspace: any) => {
  workspaceToEdit.value = { ...workspace }
  showEditModal.value = true
}


const handleUpdateWorkspace = async () => {
  if (!workspaceToEdit.value.name.trim()) return alert('Workspace name is required')
  await updateWorkspace(workspaceToEdit.value.id, { 
    name: workspaceToEdit.value.name, 
    description: workspaceToEdit.value.description 
  })
  showEditModal.value = false
}


const handleDeleteWorkspace = async (workspace: any) => {
  if (confirm(`Are you sure you want to delete "${workspace.name}"?`)) {
    await deleteWorkspace(workspace.id)
  }
}

</script>

<template>
<section class="min-h-screen bg-gray-50">

  <nav class="flex items-center justify-between px-6 py-4 bg-white shadow-md">
    <h1 class="text-2xl font-bold text-blue-600">TaskFlow</h1>
    <div class="flex items-center space-x-4">
      <span class="font-medium text-gray-700">Hi, {{ user?.name }}</span>
      <button @click="logout" class="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition">Logout</button>
    </div>
  </nav>

 
  <div class="max-w-6xl mx-auto px-6 py-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-700">Your Workspaces</h2>
      <button @click="showCreateModal = true" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">+ Add New</button>
    </div>

    
    <div v-if="workspaces.length" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="workspace in workspaces" :key="workspace.id" class="bg-white rounded-lg shadow hover:shadow-lg transition p-4 relative">
        <h3 @click="navigateTo(`/workspace/${workspace.id}`)" class="text-lg hover:underline hover:cursor-pointer font-bold text-gray-800">{{ workspace.name }}</h3>
        <p class="text-gray-500 text-sm mt-1">{{ workspace.description || 'No description' }}</p>

        
        <div class="absolute top-2 right-2">
          <button @click="handleOpenEdit(workspace)" class="p-1 rounded hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h.01M12 12h.01M18 12h.01"/>
            </svg>
          </button>
          <button @click="handleDeleteWorkspace(workspace)" class="p-1 rounded hover:bg-gray-200 ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    
    <div v-else class="text-center text-gray-500 mt-20">
      <p>You don't have any workspaces yet.</p>
      <button @click="showCreateModal = true" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">+ Create Workspace</button>
    </div>
  </div>


  <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">Create Workspace</h3>
      <input v-model="newWorkspaceName" placeholder="Workspace Name" class="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <textarea v-model="newWorkspaceDescription" placeholder="Description (optional)" class="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <div class="flex justify-end space-x-3">
        <button @click="showCreateModal = false" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition">Cancel</button>
        <button @click="handleCreateWorkspace" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Create</button>
      </div>
    </div>
  </div>

  
  <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">Edit Workspace</h3>
      <input v-model="workspaceToEdit.name" placeholder="Workspace Name" class="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <textarea v-model="workspaceToEdit.description" placeholder="Description (optional)" class="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <div class="flex justify-end space-x-3">
        <button @click="showEditModal = false" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition">Cancel</button>
        <button @click="handleUpdateWorkspace" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Update</button>
      </div>
    </div>
  </div>
</section>
</template>
