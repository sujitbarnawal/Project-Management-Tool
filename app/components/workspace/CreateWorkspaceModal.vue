<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="close"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {{ isEdit ? 'Edit Workspace' : 'Create New Workspace' }}
                </h3>

                <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {{ error }}
                </div>

                <div class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                      Workspace Name *
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="My Workspace"
                    />
                  </div>

                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your workspace..."
                    ></textarea>
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
              {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
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
    error.value = e.data?.message || e.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>