<template>
  <div
    class="relative rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group"
    :style="{ backgroundColor: board.backgroundColor }"
    
  >
    <div class="p-6 h-32">
      <h3 @click="openBoard" class="text-lg hover:underline hover:cursor-pointer font-semibold text-white mb-2">{{ board.name }}</h3>
      <p v-if="board.description" class="text-sm text-white/80 line-clamp-2">
        {{ board.description }}
      </p>
    </div>

    <!-- Hover Options -->
    <div
      v-if="canManage"
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <button
        @click.stop="showMenu = !showMenu"
        class="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm"
      >
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
          />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showMenu"
        v-click-outside="() => (showMenu = false)"
        class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
      >
        <button
          @click="editBoard"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Edit
        </button>
        <button
          @click="confirmDelete"
          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  board: {
    type: Object,
    required: true,
  },
  userRole: {
    type: String,
    default: 'member',
  },
});

const emit = defineEmits(['edit', 'delete']);

const showMenu = ref(false);

const canManage = computed(() => {
  return props.userRole === 'owner' || props.userRole === 'admin';
});

const openBoard = () => {
  navigateTo(`/board/${props.board.id}`);
};

const editBoard = () => {
  showMenu.value = false;
  emit('edit', props.board);
};

const confirmDelete = () => {
  showMenu.value = false;
  if (
    confirm(
      `Are you sure you want to delete "${props.board.name}"? This will delete all lists and tasks.`
    )
  ) {
    emit('delete', props.board.id);
  }
};

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