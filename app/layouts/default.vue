<script setup lang="ts">
import AppNavbar from '~/components/AppNavbar.vue';

</script>

<template>
   <div class="min-h-screen">
      <AppNavbar />
      <main>
         <slot />
      </main>

   </div>

</template>