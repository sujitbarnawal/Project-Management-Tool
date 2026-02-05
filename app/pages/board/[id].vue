<template>
  <div class="h-screen flex flex-col overflow-hidden bg-cover bg-center transition-all duration-500 ease-in-out" 
       :style="{ backgroundColor: currentBoard?.backgroundColor || '#0079BF' }">
    <!-- Gradient Overlay for better contrast -->
    <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>

    <nav class="bg-black/20 backdrop-blur-md border-b border-white/10 relative z-10 shrink-0">
      <div class="max-w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-14">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 class="text-lg font-bold text-white drop-shadow-sm truncate max-w-xs sm:max-w-md">{{ currentBoard?.name }}</h1>
          </div>
          <div class="flex items-center space-x-4">
             <div class="flex -space-x-2 mr-4">
                <!-- Example of board members could go here later -->
             </div>
            <NuxtLink to="/profile" class="flex items-center gap-2 group cursor-pointer hover:bg-white/20 p-1.5 px-3 rounded-lg transition-colors">
                <div v-if="user?.avatar_url" class="h-7 w-7 rounded-full ring-2 ring-white/30 overflow-hidden">
                    <img :src="user.avatar_url" class="h-full w-full object-cover"/>
                </div>
                <div v-else class="h-7 w-7 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white/30">
                     {{ user?.name?.charAt(0).toUpperCase() }}
                </div>
              <span class="text-sm text-white font-medium group-hover:text-white/90 hidden sm:block">
                {{ user?.name }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>


    <main class="flex-1 overflow-x-auto overflow-y-hidden relative z-10">
      <div v-if="loading" class="flex flex-col items-center justify-center h-full text-white">
        <svg class="animate-spin h-12 w-12 mb-4 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <p class="font-medium animate-pulse">Loading board...</p>
      </div>

      <div v-else class="flex h-full p-6 space-x-6 items-start">
        <ListColumn v-for="list in currentBoard?.lists" :key="list.id" :list="list" @update="refetchBoard"
          @delete="handleDeleteList" @taskMoved="handleTaskMoved" @openTask="openTaskDetail"
          @taskDeleted="handleTaskDeleted" />


        <div class="shrink-0 w-80">
          <div v-if="!isAddingList">
            <button @click="startAddList"
              class="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl p-4 text-white font-semibold transition-all duration-200 flex items-center shadow-sm border border-white/10 group">
              <span class="bg-black/20 p-1 rounded-md mr-3 group-hover:bg-black/30 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
              </span>
              Add another list
            </button>
          </div>

          <div v-else class="bg-gray-100 rounded-xl p-4 shadow-xl border border-white/20 animate-fade-in-up">
            <input ref="listInput" v-model="newListTitle" @keyup.enter="addList" @keyup.esc="cancelAddList"
              placeholder="Enter list title..."
              class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm mb-3" />
            <div class="flex items-center gap-2">
              <button @click="addList" :disabled="!newListTitle.trim()"
                class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors">
                Add List
              </button>
              <button @click="cancelAddList" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>


    <TaskDetailModal
      :is-open="showTaskModal"
      :task="selectedTask"
      :current-list-title="selectedTaskListTitle"
      @close="closeTaskDetail"
      @updated="refetchBoard"
      @deleted="handleTaskDeleted"
    />
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
const selectedTaskListTitle = ref('');

const goBack = () => {
  if (currentBoard.value?.workspaceId) {
    navigateTo(`/workspace/${currentBoard.value.workspaceId}`);
  } else {
    navigateTo('/dashboard');
  }
};


const refetchBoard = async () => {
  await fetchBoard(boardId, true);
};


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


const handleDeleteList = async (listId: string) => {
  try {
    await deleteList(listId);
    await refetchBoard();
  } catch (error: any) {
    alert(error.data?.message || 'Failed to delete list');
  }
};


const handleTaskMoved = ({ taskId, fromListId, toListId, newIndex }: any) => {
  const fromList = currentBoard.value.lists.find((l: any) => l.id === fromListId);
  const toList = currentBoard.value.lists.find((l: any) => l.id === toListId);
  if (!fromList || !toList) return;
  
  const taskIndex = fromList.tasks.findIndex((t: any) => t.id === taskId);
  if (taskIndex === -1) return;

  const [task] = fromList.tasks.splice(taskIndex, 1);
  toList.tasks.splice(newIndex, 0, task);


  updateTask(taskId, { listId: toListId, position: newIndex });
};



const openTaskDetail = (task: any) => {
  selectedTask.value = task;
  // Find which list this task belongs to
  const list = currentBoard.value?.lists?.find((l: any) => l.tasks.some((t: any) => t.id === task.id));
  selectedTaskListTitle.value = list ? list.title : '';
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

useSeo("Board","Welcome to board")
</script>
