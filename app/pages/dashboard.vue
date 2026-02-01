<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ user?.name }}</span>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">My Workspaces</h2>
          <p class="mt-1 text-sm text-gray-600">Manage your workspaces and collaborate with your team</p>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Workspace
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-gray-600">Loading workspaces...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && workspaces.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No workspaces</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new workspace.</p>
        <div class="mt-6">
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Workspace
          </button>
        </div>
      </div>

      <!-- Workspaces Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WorkspaceCard
          v-for="workspace in workspaces"
          :key="workspace.id"
          :workspace="workspace"
          @edit="openEditModal"
          @delete="handleDelete"
        />
      </div>
    </main>

    <!-- Create/Edit Modal -->
    <CreateWorkspaceModal
      :is-open="showModal"
      :workspace="selectedWorkspace!"
      @close="closeModal"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import CreateWorkspaceModal from '~/components/workspace/CreateWorkspaceModal.vue';

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
  // Workspace already added to list by composable
};

const handleUpdated = () => {
  // Workspace already updated in list by composable
};

const handleDelete = async (workspaceId: string) => {
  try {
    await deleteWorkspace(workspaceId);
  } catch (error: any) {
    alert(error.data?.message || 'Failed to delete workspace');
  }
};

// Fetch workspaces on mount
onMounted(async () => {
  await fetchWorkspaces();
});

definePageMeta({
  middleware: 'auth',
});
</script>