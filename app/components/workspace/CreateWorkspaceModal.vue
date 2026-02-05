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
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                   </div>
                  {{ isEdit ? 'Edit Workspace' : 'Create New Workspace' }}
                </h3>

                <div v-if="error" class="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ error }}
                </div>

                <div class="space-y-5">
                  <div>
                    <label for="name" class="block text-sm font-semibold text-gray-700 mb-1.5">
                      Workspace Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>

                  <div>
                    <label for="description" class="block text-sm font-semibold text-gray-700 mb-1.5">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="3"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400 resize-none"
                      placeholder="What is this workspace for?"
                    ></textarea>
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
              {{ loading ? 'Saving...' : (isEdit ? 'Update Workspace' : 'Create Workspace') }}
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
  workspace: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'created', 'updated']);

const { createWorkspace, updateWorkspace } = useWorkspace();

const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  description: '',
});

const isEdit = computed(() => !!props.workspace);

// Watch for workspace prop changes
watch(() => props.workspace, (newWorkspace) => {
  if (newWorkspace) {
    form.name = newWorkspace.name;
    form.description = newWorkspace.description || '';
  }
}, { immediate: true });

// Reset form when modal opens/closes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    form.name = '';
    form.description = '';
    error.value = '';
  } else if (props.workspace) {
    form.name = props.workspace.name;
    form.description = props.workspace.description || '';
  }
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (isEdit.value) {
      const updated = await updateWorkspace(props.workspace.id, {
        name: form.name,
        description: form.description || undefined,
      });
      emit('updated', updated);
    } else {
      const created = await createWorkspace({
        name: form.name,
        description: form.description || undefined,
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