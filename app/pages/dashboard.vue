<script setup lang="ts">
useSeo('Dashboard', "Welcome to dashboard")
definePageMeta({
  layout: 'default',
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
  <div class=" bg-gray-100">
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h2 class="text-xl font-bold mb-4">Welcome, {{ user?.name }}!</h2>
      </div>
    </main>
  </div>
</template>