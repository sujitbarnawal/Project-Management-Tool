<script setup lang="ts">
  useSeo('Dashboard',"Welcome to dashboard")
  definePageMeta({
    layout:'default',
    middleware:'auth'
  })
</script>

<template>
    dashboard
</template>