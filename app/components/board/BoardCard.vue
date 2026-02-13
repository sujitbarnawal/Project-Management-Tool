<template>
  <div
    class="relative h-32 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
  >
    <div @click="openBoard"
      class="absolute inset-0 rounded-2xl overflow-hidden" 
      :style="{ backgroundColor: board.backgroundColor || '#4F46E5' }"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none"></div>
      <div class="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none"></div>

      <div class="p-5 relative z-10 flex flex-col h-full justify-between">
        <div>
          <h3  class="text-lg font-bold text-white mb-1 drop-shadow-sm truncate">{{ board.name }}</h3>
          <p v-if="board.description" class="text-xs text-white/90 line-clamp-2 leading-relaxed">
             {{ board.description }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="canManage"
      class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-50"
    >
      <button
        @click.stop="showMenu = !showMenu"
        class="p-1.5 bg-black/20 hover:bg-black/40 rounded-lg text-white backdrop-blur-sm transition-colors"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
          />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showMenu"
        v-click-outside="() => (showMenu = false)"
        class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden py-1"
      >
        <button
          @click="editBoard"
          class=" w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          Edit Board
        </button>
        <button
          @click="confirmDelete"
          :disabled="loadingDelete"
          class=" w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!loadingDelete" class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          <svg v-else class="animate-spin w-4 h-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ loadingDelete ? 'Deleting...' : 'Delete Board' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue3-toastify'
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

const { deleteBoard } = useBoard();
const showMenu = ref(false);
const loadingDelete = ref(false);

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

const confirmDelete = async () => {
  if (
    confirm(
      `Are you sure you want to delete "${props.board.name}"? This will delete all lists and tasks.`
    )
  ) {
    loadingDelete.value = true;
    try {
      await deleteBoard(props.board.id);
      emit('delete', props.board.id);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete board');
    } finally {
      loadingDelete.value = false;
      showMenu.value = false;
    }
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