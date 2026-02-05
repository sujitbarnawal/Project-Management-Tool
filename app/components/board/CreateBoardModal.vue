<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm"
        @click="close"
      ></div>

      <div
        class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-100"
      >
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-8 pt-6 pb-6 sm:p-8">
            <div class="sm:flex sm:items-start">
               <div class="w-full">
                <h3 class="text-xl font-bold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                   <div class="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                   </div>
                  {{ isEdit ? 'Edit Board' : 'Create New Board' }}
                </h3>

                <div
                  v-if="error"
                  class="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                >
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ error }}
                </div>

                <div class="space-y-5">
                  <div>
                    <label for="name" class="block text-sm font-semibold text-gray-700 mb-1.5">
                      Board Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400"
                      placeholder="e.g. Project Launch"
                    />
                  </div>

                  <div>
                    <label
                      for="description"
                      class="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="3"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400 resize-none"
                      placeholder="What is this board for?"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div class="flex flex-wrap gap-3">
                      <button
                        v-for="color in colors"
                        :key="color"
                        type="button"
                        @click="form.backgroundColor = color"
                        class="w-10 h-10 rounded-full transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                        :style="{ backgroundColor: color }"
                      >
                         <svg v-if="form.backgroundColor === color" class="w-6 h-6 text-white absolute inset-0 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-4 sm:flex sm:flex-row-reverse border-t border-gray-100">
            <button
              type="submit"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-2.5 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
            >
               <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Saving...' : isEdit ? 'Update Board' : 'Create Board' }}
            </button>
            <button
              type="button"
              @click="close"
              :disabled="loading"
              class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  board: {
    type: Object,
    default: null,
  },
  workspaceId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close', 'created', 'updated']);

const { createBoard, updateBoard } = useBoard();

const loading = ref(false);
const error = ref('');

const colors = [
  '#0079BF',
  '#D29034',
  '#519839',
  '#B04632',
  '#89609E',
  '#CD5A91',
  '#4BBF6B',
  '#00AECC',
  '#838C91',
];

const form = reactive({
  name: '',
  description: '',
  backgroundColor: '#0079BF',
});

const isEdit = computed(() => !!props.board);

watch(
  () => props.board,
  (newBoard) => {
    if (newBoard) {
      form.name = newBoard.name;
      form.description = newBoard.description || '';
      form.backgroundColor = newBoard.backgroundColor || '#0079BF';
    }
  },
  { immediate: true }
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      form.name = '';
      form.description = '';
      form.backgroundColor = '#0079BF';
      error.value = '';
    } else if (props.board) {
      form.name = props.board.name;
      form.description = props.board.description || '';
      form.backgroundColor = props.board.backgroundColor || '#0079BF';
    }
  }
);

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (isEdit.value) {
      const updated = await updateBoard(props.board.id, {
        name: form.name,
        description: form.description || undefined,
        backgroundColor: form.backgroundColor,
      });
      emit('updated', updated);
    } else {
      const created = await createBoard({
        workspaceId: props.workspaceId,
        name: form.name,
        description: form.description || undefined,
        backgroundColor: form.backgroundColor,
      });
      emit('created', created);
    }
    close();
  } catch (e: any) {
    error.value = e.data?.statusMessage || e.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>