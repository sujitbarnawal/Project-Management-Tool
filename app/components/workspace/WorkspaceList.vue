<script setup lang="ts">
defineProps<{
  workspaces: any[]
}>()

const emit = defineEmits<{
  (e: 'update', id: string, data: any): void
  (e: 'delete', id: string): void
}>()


const showEdit = ref(false)
const showDelete = ref(false)
const activeWorkspace = ref<any>(null)
const loading = ref(false)

const name = ref('')
const description = ref('')

const openEdit = (ws: any) => {
  activeWorkspace.value = ws
  name.value = ws.name
  description.value = ws.description || ''
  showEdit.value = true
}

const submitEdit = async () => {
  loading.value = true
   emit('update', activeWorkspace.value.id, {
    name: name.value,
    description: description.value
  })
  loading.value = false
  showEdit.value = false
}

const openDelete = (ws: any) => {
  activeWorkspace.value = ws
  showDelete.value = true
}

const confirmDelete = async () => {
  loading.value = true
   emit('delete', activeWorkspace.value.id)
  loading.value = false
  showDelete.value = false
}
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
    <div
      v-for="ws in workspaces"
      :key="ws.id"
      class="bg-white rounded-xl shadow p-4 relative"
    >
      <div class="flex justify-between">
        <div>
          <h2 class="text-lg mb-2 font-semibold hover:underline hover:cursor-pointer" @click="navigateTo(`/workspace/${ws.id}`)">{{ ws.name }}</h2>
          <h3 class="text-md mb-2">{{ ws.description }}</h3>

          <span class="text-xs px-2   py-1 rounded-full bg-blue-100 text-blue-700">
            {{ ws.role }}
          </span>
        </div>

        <div class="relative">
          <button @click="ws.open = !ws.open">⋮</button>

          <div
            v-if="ws.open"
            class="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10"
          >
            <button
              class="block w-full px-3 py-2 hover:bg-gray-100 text-left"
              @click="openEdit(ws); ws.open = false"
            >
              Edit
            </button>
            <button
              class="block w-full px-3 py-2 hover:bg-gray-100 text-left text-red-600"
              @click="openDelete(ws); ws.open = false"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>


  <div
    v-if="showEdit"
    class="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
  >
    <div class="bg-white w-[400px] rounded-lg p-5">
      <h2 class="text-lg font-semibold mb-4">Edit Workspace</h2>

      <label class="block text-sm mb-1">Name</label>
      <input
        v-model="name"
        class="w-full border rounded px-3 py-2 mb-3"
      />

      <label class="block text-sm mb-1">Description</label>
      <input
        v-model="description"
        class="w-full border rounded px-3 py-2"
      />

      <div class="flex justify-end gap-2 mt-4">
        <button class="px-4 py-2 bg-gray-200 rounded" @click="showEdit = false">
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded"
          :disabled="loading"
          @click="submitEdit"
        >
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showDelete"
    class="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
  >
    <div class="bg-white w-[350px] rounded-lg p-5">
      <h2 class="text-lg font-semibold mb-2">Delete Workspace</h2>
      <p class="text-sm text-gray-600">
        Are you sure you want to delete
        <strong>{{ activeWorkspace?.name }}</strong>?
      </p>

      <div class="flex justify-end gap-2 mt-4">
        <button class="px-4 py-2 bg-gray-200 rounded" @click="showDelete = false">
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-red-600 text-white rounded"
          :disabled="loading"
          @click="confirmDelete"
        >
          {{ loading ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>