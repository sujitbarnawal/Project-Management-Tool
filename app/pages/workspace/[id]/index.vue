<template>
  <div class="min-h-screen bg-gray-50">

    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="text-gray-600 hover:text-gray-900">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ currentWorkspace?.name }}</h1>
              <p v-if="currentWorkspace?.description" class="text-sm text-gray-600">
                {{ currentWorkspace.description }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ user?.name }}</span>
            <button @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>


    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div v-if="workspaceLoading" class="text-center py-12">
        <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <p class="mt-4 text-gray-600">Loading workspace...</p>
      </div>

      <div v-else>

        <div class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Boards</h2>
            <button @click="openCreateBoardModal"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>

            </button>
          </div>

          <div v-if="boardLoading" class="text-center py-8">
            <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>

          <div v-else-if="!boardLoading && boards.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No boards</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new board.</p>
            <div class="mt-6">
              <button @click="openCreateBoardModal"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Board
              </button>
            </div>
          </div>


          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <BoardCard v-for="board in boards" :key="board.id" :board="board" :user-role="currentWorkspace?.userRole"
              @edit="openEditBoardModal" @delete="handleDeleteBoard" />
          </div>
        </div>


        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">
              Members ({{ currentWorkspace?.members?.length || 0 }})
            </h3>
            <button v-if="canManageMembers" @click="openInviteModal"
              class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Invite Member
            </button>
          </div>

          <div class="space-y-3">
            <div v-for="member in currentWorkspace?.members" :key="member.userId"
              class="flex items-center justify-between py-2">
              <div class="flex items-center flex-1">
                <div
                  class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ member.name.charAt(0).toUpperCase() }}
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                  <p class="text-xs text-gray-500">{{ member.email }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">

                <select v-if="canChangeRole(member)" v-model="member.role" @change="changeRole(member)"
                  class="text-xs font-medium rounded-full border-0 pr-8" :class="getRoleBadgeClass(member.role)">
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
                <span v-else class="px-3 py-1 text-xs font-medium rounded-full" :class="getRoleBadgeClass(member.role)">
                  {{ member.role }}
                </span>

                <button v-if="canRemoveMember(member)" @click="handleRemoveMember(member)"
                  class="p-1 text-red-600 hover:bg-red-50 rounded">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <InviteMemberModal :is-open="showInviteModal" :workspace-id="workspaceId" @close="closeInviteModal"
          @invited="handleMemberInvited" />
      </div>
    </main>

    <CreateBoardModal :is-open="showBoardModal" :board="selectedBoard!" :workspace-id="workspaceId"
      @close="closeBoardModal" @created="handleBoardCreated" @updated="handleBoardUpdated" />
  </div>
</template>

<script setup lang="ts">
import CreateBoardModal from '~/components/board/CreateBoardModal.vue';
import InviteMemberModal from '~/components/workspace/InviteMemberModal.vue';

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
    alert(error.data?.message || 'Failed to update member role');
    await fetchWorkspace(workspaceId);
  }
};

const handleRemoveMember = async (member: any) => {
  if (confirm(`Remove ${member.name} from this workspace?`)) {
    try {
      await removeMember(workspaceId, member.userId);
      await fetchWorkspace(workspaceId);
    } catch (error: any) {
      alert(error.data?.message || 'Failed to remove member');
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
    alert(error.data?.message || 'Failed to delete board');
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