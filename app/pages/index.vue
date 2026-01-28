<script setup lang="ts">

useSeo("Home","Welcome")

definePageMeta({
    layout:'auth',
    middleware:'guest'
})

</script>
<template>
    hello
</template>
