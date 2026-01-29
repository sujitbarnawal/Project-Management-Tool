<script setup lang="ts">
const route = useRoute();
const { user, logout } = useAuth();
const { currentWorkspace, loading, fetchWorkspaceById } = useWorkspace();

const workspaceId = route.params.id as string;

const handleLogout = async () => {
  await logout();
};

const goBack = () => {
  navigateTo('/dashboard');
};

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

onMounted(async () => {
  await fetchWorkspaceById(workspaceId);
});

definePageMeta({
  middleware: 'auth',
  layout:'default'
});
</script>
<template>
   

    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-gray-600">Loading workspace...</p>
      </div>

      <div v-else>

        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 class="text-lg font-semibold mb-4">Members ({{ currentWorkspace?.members?.length || 0 }})</h3>
          <div class="space-y-3">
            <div
              v-for="member in currentWorkspace?.members"
              :key="member.userId"
              class="flex items-center justify-between py-2"
            >
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ member.name.charAt(0).toUpperCase() }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                  <p class="text-xs text-gray-500">{{ member.email }}</p>
                </div>
              </div>
              <span class="px-3 py-1 text-xs font-medium rounded-full" :class="getRoleBadgeClass(member.role)">
                {{ member.role }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">Boards</h3>
          <div class="text-center py-12 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="mt-2"></p>
          </div>
        </div>
      </div>
    </main>

</template>

