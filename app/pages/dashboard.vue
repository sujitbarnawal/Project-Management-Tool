<script setup lang="ts">
import WorkspaceList from '~/components/workspace/WorkspaceList.vue';

useSeo('Dashboard', "Welcome to dashboard")
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { user, fetchUser } = useAuth();
const {createWorkspace,fetchWorkspaces,workspaces,updateWorkspace,deleteWorkspace}=useWorkspace()

onMounted(async () => {
  if (!user.value) {
    await fetchUser();
  }
  await fetchWorkspaces()
});

const openCreate = ref(false)
const name = ref("")
const description = ref("")
const loading=ref(false)


const create =async()=>{
  loading.value=true
  try {
    const data={
      name:name.value,
      description:description?.value
    }
    const response = await createWorkspace(data)
    if(response.success){
      alert(response.message)
      await fetchWorkspaces()
      openCreate.value=false
      name.value=""
      description.value=""
    }else{
      alert("Failed to create")
    }
    
  } catch (error) {
    alert(error)
  } finally{
    loading.value=false
  }
}

const handleEdit = async (id: string, data: any) => {
  await updateWorkspace(id, data)
  await fetchWorkspaces()
}


const handleDelete = async (id: string) => {
  await deleteWorkspace(id)
  await fetchWorkspaces()
}

</script>

<template>
  <div class=" relative bg-gray-100">
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="flex justify-between">
        <h1 class="text-3xl font-semibold ">Workspaces</h1>
        <button @click="openCreate = true"
          class="flex flex-row-reverse   bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">New
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white">
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </svg>
        </button>
      </div>
      <div v-if="openCreate" class="fixed inset-0 flex items-center justify-center">
        <div class="w-[400px] bg-white rounded-lg px-6 py-4 shadow-lg">
          <h1 class="text-lg font-semibold mb-4">Add Workspace</h1>

          <label class="block text-sm mb-1">Name</label>
          <input required type="text" placeholder="Workspace Name" v-model="name" class="w-full border rounded px-3 py-2 mb-3" />

          <label class="block text-sm mb-1">Description</label>
          <input type="text" placeholder="Description (optional)" v-model="description"
            class="w-full border rounded px-3 py-2" />

          <div class="flex justify-end gap-2 mt-4">
            <button class="px-4 py-2 rounded bg-gray-200" @click="openCreate = false">
              Cancel
            </button>
            <button :disabled="loading" @click="create" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              {{loading?"Creating...":"Create"}}
            </button>
          </div>
        </div>
      </div>
      <WorkspaceList
      :workspaces="workspaces"
      @update="handleEdit"
      @delete="handleDelete"
      />
    </main>
  </div>
</template>