<script setup lang="ts">
useSeo('Dashboard', "Welcome to dashboard")
definePageMeta({
  // layout: 'default',
  middleware: 'auth'
})

const { user, logout, fetchUser } = useAuth();

const handleLogout = async () => {
  await logout();
  navigateTo('/')
};

onMounted(async () => {
  if (!user.value) {
    await fetchUser();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold">Task Management</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">{{ user?.name }}</span>
            <button @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h2 class="text-2xl font-bold mb-4">Welcome, {{ user?.name }}!</h2>
        <p class="text-gray-600">Your dashboard will be built in the coming days.</p>
      </div>
    </main>
  </div>
</template>