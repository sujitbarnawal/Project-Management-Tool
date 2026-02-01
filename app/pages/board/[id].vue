<template>
  <div class="min-h-screen" :style="{ backgroundColor: currentBoard?.backgroundColor || '#0079BF' }">
    <!-- Navbar -->
    <nav class="bg-black/20 backdrop-blur-sm border-b border-white/20">
      <div class="max-w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-14">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="text-white hover:text-white/80">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 class="text-xl font-bold text-white">{{ currentBoard?.name }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-white">{{ user?.name }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Board Content -->
    <main class="p-4 h-[calc(100vh-3.5rem)] overflow-x-auto">
      <div v-if="loading" class="text-center py-12 text-white">
        <svg class="animate-spin h-12 w-12 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <p class="mt-4">Loading board...</p>
      </div>

      <div v-else class="flex space-x-4 h-full">
        <!-- Lists -->
        <ListColumn v-for="list in currentBoard?.lists" :key="list.id" :list="list" @update="refetchBoard"
          @delete="handleDeleteList" @taskMoved="handleTaskMoved" @openTask="openTaskDetail"
          @taskDeleted="handleTaskDeleted" />

        <!-- Add List -->
        <div class="flex-shrink-0 w-80">
          <div v-if="!isAddingList">
            <button @click="startAddList"
              class="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-white font-medium transition flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add another list
            </button>
          </div>

          <div v-else class="bg-gray-100 rounded-lg p-3">
            <input ref="listInput" v-model="newListTitle" @keyup.enter="addList" @keyup.esc="cancelAddList"
              placeholder="Enter list title..."
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div class="flex items-center mt-2 gap-2">
              <button @click="addList" :disabled="!newListTitle.trim()"
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50">
                Add List
              </button>
              <button @click="cancelAddList" class="px-3 py-1 text-sm text-gray-700 hover:text-gray-900">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Task Detail Modal -->
    <TaskDetailModal :is-open="showTaskModal" :task="selectedTask" @close="closeTaskDetail" @updated="refetchBoard"
      @deleted="handleTaskDeleted" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { user } = useAuth();
const { currentBoard, loading, fetchBoard } = useBoard();
const { createList, deleteList } = useList();
const { updateTask } = useTask();

const boardId = route.params.id as string;

const isAddingList = ref(false);
const newListTitle = ref('');
const listInput = ref<HTMLInputElement | null>(null);

const showTaskModal = ref(false);
const selectedTask = ref<any>(null);

const goBack = () => {
  if (currentBoard.value?.workspaceId) {
    navigateTo(`/workspace/${currentBoard.value.workspaceId}`);
  } else {
    navigateTo('/dashboard');
  }
};

// Refetch board data
const refetchBoard = async () => {
  await fetchBoard(boardId);
};

// Add list
const startAddList = () => {
  isAddingList.value = true;
  nextTick(() => listInput.value?.focus());
};

const addList = async () => {
  if (!newListTitle.value.trim()) return;
  try {
    await createList({ boardId, title: newListTitle.value.trim() });
    newListTitle.value = '';
    isAddingList.value = false;
    await refetchBoard();
  } catch (error: any) {
    alert(error.data?.message || 'Failed to create list');
  }
};

const cancelAddList = () => {
  isAddingList.value = false;
  newListTitle.value = '';
};

// Delete list
const handleDeleteList = async (listId: string) => {
  try {
    await deleteList(listId);
    await refetchBoard();
  } catch (error: any) {
    alert(error.data?.message || 'Failed to delete list');
  }
};

// Handle task moved between lists
const handleTaskMoved = ({ taskId, fromListId, toListId, newIndex }: any) => {
  const fromList = currentBoard.value.lists.find((l: any) => l.id === fromListId);
  const toList = currentBoard.value.lists.find((l: any) => l.id === toListId);
  if (!fromList || !toList) return;
  
  const taskIndex = fromList.tasks.findIndex((t: any) => t.id === taskId);
  if (taskIndex === -1) return;

  const [task] = fromList.tasks.splice(taskIndex, 1);
  toList.tasks.splice(newIndex, 0, task);

  // Optionally: persist to backend
  updateTask(taskId, { listId: toListId, position: newIndex });
};


// Task detail modal
const openTaskDetail = (task: any) => {
  selectedTask.value = task;
  showTaskModal.value = true;
};

const closeTaskDetail = () => {
  showTaskModal.value = false;
  selectedTask.value = null;
};

const handleTaskDeleted = async () => {
  await refetchBoard();
};

onMounted(async () => {
  await fetchBoard(boardId);
});

definePageMeta({
  middleware: 'auth',
});
</script>
