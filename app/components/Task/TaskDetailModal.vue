<template>
  <div v-if="isOpen && task" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-start justify-center min-h-screen px-4 pt-20 pb-20">
      <div class="fixed inset-0 transition-opacity bg-black bg-opacity-50" @click="close"></div>

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div class="p-6">

          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-start">
                <svg class="w-6 h-6 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div class="flex-1">
                  <input
                    v-model="localTask.title"
                    @blur="saveTitle"
                    class="text-xl font-semibold text-gray-900 w-full border-0 focus:ring-2 focus:ring-blue-500 rounded px-2 -ml-2"
                  />
                </div>
              </div>
            </div>
            <button @click="close" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>


          <div class="grid grid-cols-3 gap-6">
            <div class="col-span-2 space-y-6">

              <div>
                <div class="flex items-center mb-2">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <h3 class="text-sm font-semibold text-gray-900">Description</h3>
                </div>
                <textarea
                  v-model="localTask.description"
                  @blur="saveDescription"
                  placeholder="Add a more detailed description..."
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="4"
                ></textarea>
              </div>

              <!-- Comments Placeholder -->
              <div>
                <div class="flex items-center mb-2">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <h3 class="text-sm font-semibold text-gray-900">Comments</h3>
                </div>
                <p class="text-sm text-gray-500">Comments feature coming soon!</p>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-2">Due Date</label>
                <input
                  v-model="dueDateInput"
                  @change="saveDueDate"
                  type="date"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-2">Actions</label>
                <button
                  @click="handleDelete"
                  class="w-full px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center justify-center"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  task: { type: Object, default: null }, // ✅ Make optional
});

const emit = defineEmits(['close', 'updated', 'deleted']);

const { updateTask, deleteTask } = useTask();

const localTask = ref(props.task ? { ...props.task } : { title: '', description: '', dueDate: null });
const dueDateInput = ref('');

// Update localTask when prop changes
watch(
  () => props.task,
  (newTask) => {
    if (!newTask) return;
    localTask.value = { ...newTask };
    dueDateInput.value = newTask.dueDate
      ? new Date(newTask.dueDate).toISOString().split('T')[0]!
      : '';
  },
  { immediate: true }
);

// Save handlers
const saveTitle = async () => {
  if (!props.task) return;
  if (localTask.value.title !== props.task.title) {
    await updateTask(props.task.id, { title: localTask.value.title });
    emit('updated');
  }
};

const saveDescription = async () => {
  if (!props.task) return;
  if (localTask.value.description !== props.task.description) {
    await updateTask(props.task.id, { description: localTask.value.description });
    emit('updated');
  }
};

const saveDueDate = async () => {
  if (!props.task) return;
  const dueDate = dueDateInput.value ? new Date(dueDateInput.value).toISOString() : null;
  await updateTask(props.task.id, { dueDate });
  emit('updated');
};

const handleDelete = async () => {
  if (!props.task) return;
  if (confirm(`Delete "${localTask.value.title}"?`)) {
    await deleteTask(props.task.id);
    emit('deleted');
    close();
  }
};

const close = () => emit('close');
</script>
