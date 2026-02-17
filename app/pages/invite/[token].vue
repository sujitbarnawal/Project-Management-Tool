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

useSeo("Invitation","Invitaion Workflow")
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Processing invitation...</h2>
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
    </div>
</template>
