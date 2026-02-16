<script setup>
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    const response = await $fetch(
      `/api/invitations/${route.params.token}/accept`,
      { method: "POST" }
    );

    router.push(`/workspace/${response.workspaceId}`);
  } catch (err) {
    router.push(`/?redirect=/invite/${route.params.token}`);
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <p>Processing invitation...</p>
  </div>
</template>
