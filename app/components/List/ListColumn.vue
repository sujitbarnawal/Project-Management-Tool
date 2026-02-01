<template>
  <div class="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-3 flex flex-col max-h-full relative">
    <!-- List Header -->
    <div class="flex justify-between items-center mb-3 relative">
      <!-- Title / Inline Edit -->
      <div class="flex-1">
        <div v-if="!isEditingTitle">
          <h3 class="font-semibold text-gray-900 cursor-pointer" @click="startEditTitle">
            {{ list.title }}
          </h3>
        </div>
        <div v-else>
          <input
            ref="titleInput"
            v-model="editTitle"
            @blur="saveTitle"
            @keyup.enter="saveTitle"
            @keyup.esc="cancelEditTitle"
            class="w-full px-2 py-1 text-sm font-semibold border border-blue-500 rounded focus:outline-none"
          />
        </div>
      </div>

      <!-- Three-dot menu -->
      <button @click="toggleMenu" class="p-1 hover:bg-gray-200 rounded">
        <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
          />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showMenu"
        class="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
      >
        <button
          @click="startEditTitle"
          class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          Edit list
        </button>
        <button
          @click="handleDeleteList"
          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Delete list
        </button>
      </div>
    </div>

    <!-- Tasks -->
    <VueDraggable
      v-model="localTasks"
      :group="{ name: 'tasks', pull: true, put: true }"
      :data-list-id="list.id"
      @end="handleDragEnd"
      class="flex-1 overflow-y-auto space-y-2 mb-2 min-h-[20px]"
      ghost-class="ghost"
      drag-class="dragging"
    >
      <TaskCard
        v-for="task in localTasks"
        :key="task.id"
        :task="task"
        :data-task-id="task.id"
        @click="$emit('openTask', task)"
        @delete="handleDeleteTask"
      />
    </VueDraggable>

    <!-- Empty State -->
    <div v-if="localTasks.length === 0" class="text-center py-4 text-gray-400 text-sm">
      No tasks yet
    </div>

    <!-- Add Task -->
    <div v-if="!isAddingTask">
      <button
        @click="startAddTask"
        class="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded transition flex items-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add a card
      </button>
    </div>

    <!-- Add Task Form -->
    <div v-else class="bg-white rounded-md shadow-sm p-2">
      <textarea
        ref="taskInput"
        v-model="newTaskTitle"
        @keyup.enter.exact="addTask"
        @keyup.esc="cancelAddTask"
        placeholder="Enter task title..."
        class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        rows="2"
      ></textarea>
      <div class="flex items-center mt-2 gap-2">
        <button
          @click="addTask"
          :disabled="!newTaskTitle.trim()"
          class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Add
        </button>
        <button @click="cancelAddTask" class="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

interface Task { id: string; title: string; description?: string }
interface List { id: string; title: string; tasks: Task[] }

const props = defineProps<{ list: List }>();
const emit = defineEmits<{
  (e: 'update'): void;
  (e: 'delete', listId: string): void;
  (e: 'taskMoved', data: { taskId: string; fromListId: string; toListId: string; newIndex: number }): void;
  (e: 'openTask', task: Task): void;
  (e: 'taskDeleted', taskId: string): void;
}>();

const { updateList } = useList();
const { createTask, updateTask, deleteTask } = useTask();

const showMenu = ref(false);
const isEditingTitle = ref(false);
const editTitle = ref('');
const titleInput = ref<HTMLInputElement | null>(null);

const isAddingTask = ref(false);
const newTaskTitle = ref('');
const taskInput = ref<HTMLTextAreaElement | null>(null);

const localTasks = ref([...props.list.tasks]);

// Watch for prop changes
watch(() => props.list.tasks, (tasks) => {
  localTasks.value.splice(0, localTasks.value.length, ...(tasks || []));
}, { deep: true });

// Menu
const toggleMenu = () => showMenu.value = !showMenu.value;

// Edit list title
const startEditTitle = () => {
  showMenu.value = false;
  editTitle.value = props.list.title;
  isEditingTitle.value = true;
  nextTick(() => titleInput.value?.focus());
};

const saveTitle = async () => {
  if (editTitle.value.trim() && editTitle.value !== props.list.title) {
    try {
      await updateList(props.list.id, { title: editTitle.value.trim() });
      emit('update');
    } catch (error: any) {
      alert(error.data?.message || 'Failed to update list');
    }
  }
  isEditingTitle.value = false;
};

const cancelEditTitle = () => {
  isEditingTitle.value = false;
  editTitle.value = '';
};

// Delete list
const handleDeleteList = () => {
  showMenu.value = false;
  if (confirm(`Delete "${props.list.title}"? All tasks will be deleted.`)) {
    emit('delete', props.list.id);
  }
};

// Add task
const startAddTask = () => {
  isAddingTask.value = true;
  nextTick(() => taskInput.value?.focus());
};

const addTask = async () => {
  if (!newTaskTitle.value.trim()) return;
  try {
    const task = await createTask({ listId: props.list.id, title: newTaskTitle.value.trim() });
    localTasks.value.push(task);
    newTaskTitle.value = '';
    taskInput.value?.focus();
    emit('update');
  } catch (error: any) {
    alert(error.data?.message || 'Failed to create task');
  }
};

const cancelAddTask = () => {
  isAddingTask.value = false;
  newTaskTitle.value = '';
};

// Delete task
const handleDeleteTask = async (taskId: string) => {
  try {
    await deleteTask(taskId);
    localTasks.value = localTasks.value.filter(t => t.id !== taskId);
    emit('taskDeleted', taskId);
  } catch (error: any) {
    alert(error.data?.message || 'Failed to delete task');
  }
};

// Drag & drop
const handleDragEnd = (event: any) => {
  const fromListId = event.from.getAttribute('data-list-id');
  const toListId = event.to.getAttribute('data-list-id');
  const taskId = event.item.getAttribute('data-task-id');

  if (taskId && fromListId && toListId) {
    emit('taskMoved', { taskId, fromListId, toListId, newIndex: event.newIndex });
  }
};
</script>
