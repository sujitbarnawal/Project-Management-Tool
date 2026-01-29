<script setup lang="ts">
const { user, logout } = useAuth();

const handleLogout = async () => {
  await logout();
  navigateTo('/')
};
</script>

<template>
    <nav class="bg-white shadow-sm ">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 @click="navigateTo('/dashboard')" class="text-xl cursor-pointer font-bold">TaskFlow</h1>
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
</template>