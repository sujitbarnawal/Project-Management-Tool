<script setup lang="ts">

useSeo("Register or Login","Welcome to TaskFLow")

definePageMeta({
    layout:'auth',
    middleware:'guest'
})

</script>
<template>
    <p class="text-red-400">Hello</p>
</template>
