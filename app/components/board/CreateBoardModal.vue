<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        @click="close"
      ></div>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {{ isEdit ? 'Edit Board' : 'Create New Board' }}
                </h3>

                <div
                  v-if="error"
                  class="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
                >
                  {{ error }}
                </div>

                <div class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                      Board Name *
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="My Board"
                    />
                  </div>

                  <div>
                    <label
                      for="description"
                      class="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your board..."
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="color in colors"
                        :key="color"
                        type="button"
                        @click="form.backgroundColor = color"
                        class="w-12 h-12 rounded-md border-2 transition-all"
                        :class="
                          form.backgroundColor === color
                            ? 'border-gray-900 scale-110'
                            : 'border-gray-300'
                        "
                        :style="{ backgroundColor: color }"
                      ></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
            </button>
            <button
              type="button"
              @click="close"
              :disabled="loading"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
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
    error.value = e.data?.message || e.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>