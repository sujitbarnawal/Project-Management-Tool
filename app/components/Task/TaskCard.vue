<template>
  <div
    class="bg-white rounded-md shadow-sm p-3 cursor-pointer hover:shadow-md transition group"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm text-gray-900 font-medium">{{ task.title }}</p>
        <p v-if="task.description" class="text-xs text-gray-500 mt-1 line-clamp-2">
          {{ task.description }}
        </p>
      </div>
      
      <button
        @click.stop="showMenu = !showMenu"
        class="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded relative"
      >
        <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>

        <div
          v-if="showMenu"
          v-click-outside="() => showMenu = false"
          class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20 border border-gray-200"
        >
          <button
            @click="handleDelete"
            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      </button>
    </div>

    <div v-if="task.dueDate" class="flex items-center mt-2 text-xs text-gray-500">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {{ formatDate(task.dueDate) }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click', 'delete']);

const showMenu = ref(false);

const handleDelete = (e: Event) => {
  e.stopPropagation();
  showMenu.value = false;
  if (confirm(`Delete "${props.task.title}"?`)) {
    emit('delete', props.task.id);
  }
};

const formatDate = (date: Date) => {
  const d = new Date(date);
  const now = new Date();
  const isOverdue = d < now;
  
  const formatted = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  
  return isOverdue ? `⚠️ ${formatted}` : formatted;
};

const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};
</script>