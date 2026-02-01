<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-200">
    <div class="flex items-start justify-between">
      <div class="flex-1" @click="openWorkspace">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ workspace.name }}</h3>
        <p v-if="workspace.description" class="text-sm text-gray-600 mb-3">
          {{ workspace.description }}
        </p>
        <div class="flex items-center text-xs text-gray-500">
          <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            {{ workspace.role || 'Member' }}
          </span>
          <span class="ml-3">
            Created {{ formatDate(workspace.createdAt) }}
          </span>
        </div>
      </div>

      <div class="relative" v-if="canManage">
        <button
          @click.stop="showMenu = !showMenu"
          class="p-2 hover:bg-gray-100 rounded-full"
        >
          <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showMenu"
          v-click-outside="() => showMenu = false"
          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
        >
          <button
            @click="editWorkspace"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            v-if="workspace.role === 'owner'"
            @click="confirmDelete"
            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  workspace: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete']);

const showMenu = ref(false);

const canManage = computed(() => {
  return props.workspace.role === 'owner' || props.workspace.role === 'admin';
});

const openWorkspace = () => {
  navigateTo(`/workspace/${props.workspace.id}`);
};

const editWorkspace = () => {
  showMenu.value = false;
  emit('edit', props.workspace);
};

const confirmDelete = () => {
  showMenu.value = false;
  if (confirm(`Are you sure you want to delete "${props.workspace.name}"? This action cannot be undone.`)) {
    emit('delete', props.workspace.id);
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};
</script>