<script setup lang="ts">
import AppNavbar from '~/components/AppNavbar.vue';

</script>

<template>
   <AppNavbar/>
   <main>
        <slot/>
   </main>
   <AppFooter/> 
</template>