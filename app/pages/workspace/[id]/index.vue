<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50/50 via-gray-50 to-white">
    <!-- Navbar -->
    <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/60 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-6">
            <button @click="goBack" class="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 class="text-lg md:text-xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">{{ currentWorkspace?.name }}</h1>
              <p v-if="currentWorkspace?.description" class="text-xs hidden md:visible text-gray-500 font-medium">
                {{ currentWorkspace.description }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-6">
            <NuxtLink to="/profile" class="flex items-center gap-2 group cursor-pointer">
              <div v-if="user?.avatar_url" class="h-8 w-8 rounded-full ring-2 ring-indigo-100 overflow-hidden">
                 <img :src="user.avatar_url" class="h-full w-full object-cover group-hover:scale-110 transition-transform"/>
              </div>
              <div v-else class="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold ring-2 ring-indigo-50 group-hover:bg-indigo-200 transition-colors">
                {{ user?.name?.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors hidden sm:block">
                {{ user?.name }}
              </span>
            </NuxtLink>
            <div class="h-6 w-px bg-gray-200"></div>
            <button @click="handleLogout"
              class="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>


    <main class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div v-if="workspaceLoading" class="flex flex-col items-center justify-center py-20">
        <div class="relative w-16 h-16">
           <div class="absolute inset-0 border-4 border-indigo-200 rounded-full animate-pulse"></div>
           <div class="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="mt-6 text-gray-500 font-medium">Loading workspace...</p>
      </div>

      <div v-else class="space-y-12">

        <!-- Boards Section -->
        <div>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                </span>
                Boards
            </h2>
            <button v-if="canCreateBoard" @click="openCreateBoardModal"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-105">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Board
            </button>
          </div>

          <div v-if="boardLoading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          <div v-else-if="!boardLoading && boards.length === 0" class="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
            <div class="mx-auto h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <svg class="h-8 w-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">No boards created yet</h3>
            <p class="mt-2 text-gray-500">Boards help you organize tasks and workflows.</p>
            <div class="mt-6">
              <button @click="openCreateBoardModal"
                class="inline-flex items-center px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-medium transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Create First Board
              </button>
            </div>
          </div>


          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="board in boards" :key="board.id" class="transform transition-all duration-300 hover:scale-[1.02]">
                 <BoardCard :board="board" :user-role="currentWorkspace?.userRole" @edit="openEditBoardModal" @delete="handleDeleteBoard" />
            </div>
          </div>
        </div>


        <!-- Members Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                 <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span class="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </span>
                    Team Members
                    <span class="ml-2 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200">
                        {{ currentWorkspace?.members?.length || 0 }}
                    </span>
                </h3>
                <p class="text-sm text-gray-500 mt-1 ml-9">Manage access and roles for your team</p>
            </div>
            
            <button v-if="canManageMembers" @click="openInviteModal"
              class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Invite New Member
            </button>
          </div>

          <div class="divide-y divide-gray-100">
            <div v-for="member in currentWorkspace?.members" :key="member.userId"
              class="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
              <div class="flex items-center flex-1 min-w-0">
                <div class="relative">
                    <img
                    v-if="member.avatar_url"
                    :src="member.avatar_url"
                    alt=""
                    class="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    <div
                    v-else
                    class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white"
                    >
                    {{ member.name.charAt(0).toUpperCase() }}
                    </div>
                </div>
                
                <div class="ml-4 flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ member.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ member.email }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 ml-4">
                <select v-if="canChangeRole(member)" v-model="member.role" @change="changeRole(member)"
                  :class="['text-xs font-semibold rounded-lg border-0 py-1.5 pl-3 pr-8 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6 cursor-pointer bg-white', getRoleBadgeClass(member.role).replace('bg-', 'text-').replace('text-', 'bg-transparent ')]">
                  <!-- <option value="owner">Owner</option> -->
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
                <div v-else :class="['px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border', getRoleBadgeClass(member.role)]">
                  {{ member.role }}
                </div>

                <button v-if="canRemoveMember(member)" @click="handleRemoveMember(member)"
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Remove member">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <InviteMemberModal :is-open="showInviteModal" :workspace-id="workspaceId" @close="closeInviteModal"
          @invited="handleMemberInvited" />

    <CreateBoardModal :is-open="showBoardModal" :board="selectedBoard!" :workspace-id="workspaceId"
      @close="closeBoardModal" @created="handleBoardCreated" @updated="handleBoardUpdated" />
  </div>
</template>

<script setup lang="ts">
import CreateBoardModal from '~/components/board/CreateBoardModal.vue';
import InviteMemberModal from '~/components/workspace/InviteMemberModal.vue';
import { toast } from 'vue3-toastify'

const route = useRoute();
const { user, logout } = useAuth();
const { currentWorkspace, loading: workspaceLoading, fetchWorkspace,removeMember,updateMemberRole } = useWorkspace();
const { boards, loading: boardLoading, fetchBoards, deleteBoard } = useBoard();

const workspaceId = route.params.id as string;

const showBoardModal = ref(false);
const selectedBoard = ref(null);

const showInviteModal = ref(false);

const canManageMembers = computed(() => {
  const role = currentWorkspace.value?.userRole;
  return role === 'owner' || role === 'admin';
});

const canChangeRole = (member: any) => {
  return currentWorkspace.value?.userRole === 'owner' && member.role !== 'owner';
};
const canCreateBoard = computed(() => {
  const role = currentWorkspace.value?.userRole;
  return role === 'owner' || role === 'admin';
});

const canRemoveMember = (member: any) => {
  const userRole = currentWorkspace.value?.userRole;

  if (userRole === 'owner' && member.userId !== user.value?.id) {
    return member.role !== 'owner';
  }

  if (userRole === 'admin' && member.role === 'member') {
    return true;
  }
  
  return false;
};

const openInviteModal = () => {
  showInviteModal.value = true;
};

const closeInviteModal = () => {
  showInviteModal.value = false;
};

const handleMemberInvited = async () => {
  await fetchWorkspace(workspaceId);
};

const changeRole = async (member: any) => {
  try {
    await updateMemberRole(workspaceId, member.userId, member.role);
    await fetchWorkspace(workspaceId);
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to update member role');
    await fetchWorkspace(workspaceId);
  }
};

const handleRemoveMember = async (member: any) => {
  if (confirm(`Remove ${member.name} from this workspace?`)) {
    try {
      await removeMember(workspaceId, member.userId);
      await fetchWorkspace(workspaceId);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to remove member');
    }
  }
};

const handleLogout = async () => {
  await logout();
};

const goBack = () => {
  navigateTo('/dashboard');
};

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'owner':
      return 'bg-purple-100 text-purple-700';
    case 'admin':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const openCreateBoardModal = () => {
  selectedBoard.value = null;
  showBoardModal.value = true;
};

const openEditBoardModal = (board: any) => {
  selectedBoard.value = board;
  showBoardModal.value = true;
};

const closeBoardModal = () => {
  showBoardModal.value = false;
  selectedBoard.value = null;
};

const handleBoardCreated = () => {

};

const handleBoardUpdated = () => {

};

const handleDeleteBoard = async (boardId: string) => {
  try {
    await deleteBoard(boardId);
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to delete board');
  }
};

onMounted(async () => {
  await fetchWorkspace(workspaceId);
  await fetchBoards(workspaceId);
});

definePageMeta({
  middleware: 'auth',
});
useSeo("Workspace","Welcome to workspace")
</script>