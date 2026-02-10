<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200/60 p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative z-0"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0 pr-6">
        <p class="text-base text-gray-900 font-semibold leading-tight mb-2 break-words">{{ task.title }}</p>
        <p v-if="task.description" class="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {{ task.description }}
        </p>
      </div>
      
      <button
        @click.stop="showMenu = !showMenu"
        class="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg absolute top-3 right-3 transition-opacity"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>

        <div
          v-if="showMenu"
          v-click-outside="() => showMenu = false"
          class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-20 border border-gray-100 overflow-hidden"
        >
          <button
            @click="handleDelete"
            class="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Delete Card
          </button>
        </div>
      </button>
    </div>

    <div class="flex items-center justify-between pt-3 border-t border-gray-100/50 mt-1">
      <div v-if="task.dueDate" class="flex items-center text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-200/60">
        <svg class="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formatDate(task.dueDate) }}
      </div>
      <div v-else></div> <!-- Spacer -->
      
      <div class="flex -space-x-2 overflow-hidden pl-2" v-if="task.assignees && task.assignees.length > 0">
        <div 
          v-for="assignee in task.assignees.slice(0, 3)" 
          :key="assignee.user.id"
          class="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-white shadow-sm"
          :title="assignee.user.name"
        >
          <img
            v-if="assignee.user.avatar_url"
            :src="assignee.user.avatar_url"
            alt=""
            class="h-full w-full rounded-full object-cover"
          />
          <div
            v-else
            class="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-inner"
          >
            {{ assignee.user.name.charAt(0).toUpperCase() }}
          </div>
        </div>
        <div v-if="task.assignees.length > 3" class="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-600 font-bold border border-gray-200 shadow-sm">
            +{{ task.assignees.length - 3 }}
        </div>
      </div>
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