<template>
  <div class="flex-shrink-0 w-80 bg-[#f1f2f4] rounded-xl p-3 flex flex-col max-h-full min-h-[calc(100vh-100px)] relative shadow-sm border border-white/20">

    <div class="flex justify-between items-center mb-3 px-1 pt-1 relative group/header">

      <div class="flex-1 min-w-0">
        <div v-if="!isEditingTitle">
          <h3 class="font-bold text-gray-700 text-sm cursor-pointer px-2 py-1 -ml-2 rounded-md hover:bg-gray-200 transition-colors truncate" @click="startEditTitle">
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
            class="w-full px-2 py-1 text-sm font-bold border-2 border-indigo-500 rounded-md focus:outline-none"
          />
        </div>
      </div>


      <button @click="toggleMenu" class="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md opacity-0 group-hover/header:opacity-100 transition-opacity">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>


      <div
        v-if="showMenu"
        v-click-outside="() => showMenu = false"
        class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl z-20 border border-gray-100 overflow-hidden"
      >
        <button
          @click="startEditTitle"
          class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Rename list
        </button>
        <div class="h-px bg-gray-100 my-1"></div>
        <button
          @click="handleDeleteList"
          class="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          Delete list
        </button>
      </div>
    </div>


    <VueDraggable
      v-model="localTasks"
      :group="{ name: 'tasks', pull: true, put: true }"
      :data-list-id="list.id"
      @end="handleDragEnd"
      class="flex-1 overflow-y-auto overflow-x-hidden space-y-2.5 mb-2 min-h-[10px] pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
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


    <div v-if="!isAddingTask">
      <button
        @click="startAddTask"
        class="w-full px-2 py-2 text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors flex items-center mb-1 group"
      >
        <svg class="w-4 h-4 mr-2 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add a task
      </button>
    </div>


    <div v-else class="bg-white rounded-lg shadow-sm border border-indigo-200 p-2 animate-fade-in-up">
      <textarea
        ref="taskInput"
        v-model="newTaskTitle"
        @keyup.enter.exact="addTask"
        @keyup.esc="cancelAddTask"
        placeholder="Enter a title for this card..."
        class="w-full px-2 py-1.5 text-sm border-0 focus:ring-0 resize-none placeholder-gray-400"
        rows="3"
      ></textarea>
      <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <button
          @click="addTask"
          :disabled="!newTaskTitle.trim() || loadingAddTask"
          class="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
        >
          <svg v-if="loadingAddTask" class="animate-spin w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loadingAddTask ? 'Adding...' : 'Add Card' }}
        </button>
        <button @click="cancelAddTask" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
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

const loadingAddTask = ref(false);
const loadingUpdateTitle = ref(false);

const localTasks = ref([...props.list.tasks]);


watch(() => props.list.tasks, (tasks) => {
  localTasks.value.splice(0, localTasks.value.length, ...(tasks || []));
}, { deep: true });


const toggleMenu = () => showMenu.value = !showMenu.value;


const startEditTitle = () => {
  showMenu.value = false;
  editTitle.value = props.list.title;
  isEditingTitle.value = true;
  nextTick(() => titleInput.value?.focus());
};

const saveTitle = async () => {
  if (editTitle.value.trim() && editTitle.value !== props.list.title) {
    loadingUpdateTitle.value = true;
    try {
      await updateList(props.list.id, { title: editTitle.value.trim() });
      emit('update');
    } catch (error: any) {
      alert(error.data?.message || 'Failed to update list');
    } finally {
      loadingUpdateTitle.value = false;
    }
  }
  isEditingTitle.value = false;
};

const cancelEditTitle = () => {
  isEditingTitle.value = false;
  editTitle.value = '';
};


const handleDeleteList = () => {
  showMenu.value = false;
  if (confirm(`Delete "${props.list.title}"? All tasks will be deleted.`)) {
    emit('delete', props.list.id);
  }
};


const startAddTask = () => {
  isAddingTask.value = true;
  nextTick(() => taskInput.value?.focus());
};

const addTask = async () => {
  if (!newTaskTitle.value.trim()) return;
  loadingAddTask.value = true;
  try {
    const task = await createTask({ listId: props.list.id, title: newTaskTitle.value.trim() });
    localTasks.value.push(task);
    newTaskTitle.value = '';
    taskInput.value?.focus();
    emit('update');
  } catch (error: any) {
    alert(error.data?.message || 'Failed to create task');
  } finally {
    loadingAddTask.value = false;
  }
};

const cancelAddTask = () => {
  isAddingTask.value = false;
  newTaskTitle.value = '';
};


const handleDeleteTask = async (taskId: string) => {
  try {
    await deleteTask(taskId);
    localTasks.value = localTasks.value.filter(t => t.id !== taskId);
    emit('taskDeleted', taskId);
  } catch (error: any) {
    alert(error.data?.message || 'Failed to delete task');
  }
};


const handleDragEnd = (event: any) => {
  const fromListId = event.from.getAttribute('data-list-id');
  const toListId = event.to.getAttribute('data-list-id');
  const taskId = event.item.getAttribute('data-task-id');

  if (taskId && fromListId && toListId) {
    emit('taskMoved', { taskId, fromListId, toListId, newIndex: event.newIndex });
  }
};
</script>
