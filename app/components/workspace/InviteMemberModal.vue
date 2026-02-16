<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" @click="close"></div>

      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-100">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-8 pt-6 pb-6 sm:p-8">
            <div class="sm:flex sm:items-start">
               <div class="w-full">
                <h3 class="text-xl font-bold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                   <div class="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                   </div>
                  Invite Member
                </h3>

                <div v-if="error" class="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ error }}
                </div>

                <div v-if="success" class="mb-5 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                   <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  {{ success }}
                </div>

                <div class="space-y-5">
                  <div>
                    <label for="email" class="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400"
                      placeholder="colleague@example.com"
                    />
                    <p class="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      User must be registered in the system
                    </p>
                  </div>

                  <div>
                    <label for="role" class="block text-sm font-semibold text-gray-700 mb-1.5">
                      Role
                    </label>
                    <div class="relative">
                        <select
                        id="role"
                        v-model="form.role"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none bg-white"
                        >
                        <option value="member">Member - Can view and edit</option>
                        <option value="admin">Admin - Can manage boards and invite</option>
                        </select>
                         <svg class="w-5 h-5 text-gray-400 absolute right-3 top-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
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
              {{ loading ? 'Sending Invite...' : 'Send Invitation' }}
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
import { toast } from 'vue3-toastify';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  workspaceId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close', 'invited']);

const { inviteMember } = useWorkspace();

const loading = ref(false);
const error = ref('');
const success = ref('');

const form = reactive({
  email: '',
  role: 'member',
});

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    form.email = '';
    form.role = 'member';
    error.value = '';
    success.value = '';
  }
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    const response = await inviteMember(props.workspaceId, form.email, form.role);
    success.value = response.message;
    emit('invited');
      close();
    toast.success(response.message)
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Failed to invite member';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>