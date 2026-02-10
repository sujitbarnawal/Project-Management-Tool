<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50/50 via-gray-50 to-white">
    <!-- Navbar -->
    <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/60 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-3">
             <div class="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
             </div>
            <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">TaskFlow</h1>
          </div>
          <div class="flex items-center space-x-6">
            <NuxtLink to="/profile" class="flex items-center gap-2 group cursor-pointer">
              <div v-if="user?.avatar_url" class="h-8 w-8 rounded-full ring-2 ring-indigo-100 overflow-hidden">
                 <img :src="user.avatar_url" class="h-full w-full object-cover group-hover:scale-110 transition-transform"/>
              </div>
              <div v-else class="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold ring-2 ring-indigo-50 group-hover:bg-indigo-200 transition-colors">
                {{ user?.name?.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors hidden sm:block">
                {{ user?.name }}
              </span>
            </NuxtLink>
            <div class="h-6 w-px bg-gray-200"></div>
            <button @click="handleLogout"
              class="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>


    <main class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">My Workspaces</h2>
          <p class="mt-2 text-sm text-gray-500">Manage your projects and collaborate with your team efficiently.</p>
        </div>
        <button @click="openCreateModal"
          class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-105 hover:shadow-lg">
          <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Workspace
        </button>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="relative w-16 h-16">
           <div class="absolute inset-0 border-4 border-indigo-200 rounded-full animate-pulse"></div>
           <div class="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="mt-6 text-gray-500 font-medium">Loading your workspaces...</p>
      </div>

      <div v-else-if="!loading && workspaces.length === 0" class="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
        <div class="mx-auto h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
             <svg class="h-10 w-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">No workspaces yet</h3>
        <p class="mt-2 text-gray-500 max-w-sm mx-auto">Get started by creating a new workspace to organize your tasks and projects.</p>
        <div class="mt-8">
          <button @click="openCreateModal"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Workspace
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="workspace in workspaces" :key="workspace.id" class="transform transition-all duration-300 hover:scale-[1.02]">
            <WorkspaceCard :workspace="workspace" @edit="openEditModal" @delete="handleDelete" />
        </div>
      </div>
    </main>

    <CreateWorkspaceModal :is-open="showModal" :workspace="selectedWorkspace!" @close="closeModal"
      @created="handleCreated" @updated="handleUpdated" />
  </div>
</template>

<script setup lang="ts">
import CreateWorkspaceModal from '~/components/workspace/CreateWorkspaceModal.vue';
import { toast } from 'vue3-toastify'

const { user, logout } = useAuth();
const { workspaces, loading, fetchWorkspaces, deleteWorkspace } = useWorkspace();

const showModal = ref(false);
const selectedWorkspace = ref(null);

const handleLogout = async () => {
  await logout();
};

const openCreateModal = () => {
  selectedWorkspace.value = null;
  showModal.value = true;
};

const openEditModal = (workspace: any) => {
  selectedWorkspace.value = workspace;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedWorkspace.value = null;
};

const handleCreated = () => {

};

const handleUpdated = () => {

};

const handleDelete = async (workspaceId: string) => {
  try {
    await deleteWorkspace(workspaceId);
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to delete workspace');
  }
};


onMounted(async () => {
  await fetchWorkspaces();
});

definePageMeta({
  middleware: 'auth',
});
useSeo("Dashboard", "Welcome to Dashboard")
</script>