<template>
  <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 group h-full flex flex-col">
    <div class="flex items-start justify-between mb-4">
      <div class="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
        {{ workspace.name.charAt(0).toUpperCase() }}
      </div>
       <div class="relative" v-if="canManage">
        <button
          @click.stop="showMenu = !showMenu"
          class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        <div
          v-if="showMenu"
          v-click-outside="() => showMenu = false"
          class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-20 overflow-hidden"
        >
          <button
            @click="editWorkspace"
            class=" w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
             <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            Edit Workspace
          </button>
          <button
            v-if="workspace.role === 'owner'"
            @click="confirmDelete"
            class=" w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
    
    <div class="flex-1" @click="openWorkspace">
        <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1 break-all">{{ workspace.name }}</h3>
        <p class="text-sm text-gray-500 mb-4 line-clamp-2 h-10 leading-relaxed">
          {{ workspace.description || 'No description provided.' }}
        </p>
    </div>
    
    <div class="pt-4 border-t border-gray-50 flex items-center justify-between text-xs mt-auto">
        <div class="flex items-center gap-2">
           <span :class="['px-2.5 py-1 rounded-full font-medium', workspace.role === 'owner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700']">
            {{ workspace.role || 'Member' }}
          </span>
        </div>
        <span class="text-gray-400">
             {{ formatDate(workspace.createdAt) }}
        </span>
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