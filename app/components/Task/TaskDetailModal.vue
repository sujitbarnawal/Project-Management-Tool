<template>
  <div v-if="isOpen && task" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm" @click="close"></div>

      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-100">
        <!-- Close Button -->
        <button @click="close" class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <!-- Header Image (Optional if we had covers) -->
        <div class="h-4 bg-gradient-to-r from-indigo-500 to-purple-500 w-full"></div>

        <div class="px-8 py-6">
          <!-- Title Section -->
          <div class="flex items-start mb-8 mr-10">
             <div class="mt-1.5 mr-4 p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
             </div>
             <div class="flex-1">
                 <input
                    v-model="localTask.title"
                    @blur="saveTitle"
                    class="text-2xl font-bold text-gray-900 w-full border-0 border-b-2 border-transparent focus:border-indigo-500 focus:ring-0 px-0 bg-transparent transition-colors placeholder-gray-400"
                    placeholder="Task title"
                  />
                  <div class="text-sm text-gray-500 mt-1">
                    in list <span class="font-medium text-gray-700 underline decoration-dotted">{{ currentListTitle || '...' }}</span>
                  </div>
             </div>
          </div>


          <div class="grid grid-cols-1 md:grid-cols-12 gap-10">
            <!-- Main Content -->
            <div class="md:col-span-8 space-y-8">

              <!-- Description -->
              <div>
                <div class="flex items-center mb-3">
                   <div class="text-gray-700 font-semibold text-lg flex items-center gap-2">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                      Description
                   </div>
                </div>
                <!-- Attachments Section -->
                <div class="mb-8">
                  <div class="flex items-center justify-between mb-3">
                     <div class="text-gray-700 font-semibold text-lg flex items-center gap-2">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                        Attachments
                     </div>
                     <label class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg cursor-pointer transition-colors flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add
                        <input type="file" @change="handleFileUpload" class="hidden" />
                     </label>
                  </div>
                  
                  <div v-if="uploadingAttachment" class="flex items-center gap-2 text-sm text-gray-500 mb-3 ml-7">
                      <svg class="animate-spin w-4 h-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                  </div>

                  <div v-if="taskData?.attachments?.length > 0" class="space-y-2 ml-7">
                    <div v-for="attachment in taskData.attachments" :key="attachment.id" class="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors group">
                        <a :href="attachment.url" target="_blank" class="flex items-center gap-3 flex-1 min-w-0">
                             <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                             </div>
                             <div class="truncate">
                                 <p class="text-sm font-medium text-gray-900 truncate">{{ attachment.filename }}</p>
                                 <p class="text-xs text-gray-500">Added {{ formatDate(attachment.createdAt) }}</p>
                             </div>
                        </a>
                        <button 
                            @click="deleteAttachment(attachment.id)" 
                            class="p-2 text-gray-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            :disabled="deletingAttachmentId === attachment.id"
                        >
                             <svg v-if="deletingAttachmentId === attachment.id" class="animate-spin w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                  </div>
                  <div v-else class="ml-7 text-sm text-gray-400 italic">No attachments yet</div>
                </div>
                <div class="ml-7">
                    <textarea
                    v-model="localTask.description"
                    @blur="saveDescription"
                    placeholder="Add a more detailed description..."
                    class="w-full px-4 py-3 text-sm bg-gray-50 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none transition-all placeholder-gray-500"
                    rows="4"
                    ></textarea>
                </div>
              </div>


              <!-- Comments -->
              <div>
                   <div class="flex gap-4 border-b border-gray-100 mb-6">
                      <button 
                        @click="activeTab = 'comments'"
                        :class="['pb-3 text-sm font-semibold transition-colors relative', activeTab === 'comments' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700']"
                      >
                          Comments
                          <span v-if="activeTab === 'comments'" class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
                      </button>
                      <button 
                        @click="activeTab = 'history'"
                        :class="['pb-3 text-sm font-semibold transition-colors relative', activeTab === 'history' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700']"
                      >
                          History
                          <span v-if="activeTab === 'history'" class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
                      </button>
                   </div>
                </div>
                
                <!-- History Tab -->
                <div v-if="activeTab === 'history'" class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    <div v-if="loadingActivities" class="text-center py-4">
                        <svg class="animate-spin h-6 w-6 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <div v-else-if="activities.length > 0" class="space-y-4">
                        <div v-for="activity in activities" :key="activity.id" class="flex gap-3">
                             <div class="mt-0.5">
                                 <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                     {{ activity.userName?.charAt(0).toUpperCase() }}
                                 </div>
                             </div>
                             <div class="flex-1">
                                 <p class="text-sm text-gray-900">
                                     <span class="font-semibold">{{ activity.userName }}</span> 
                                     <span class="text-gray-600">{{ formatActivity(activity) }}</span>
                                 </p>
                                 <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(activity.createdAt) }}</p>
                             </div>
                        </div>
                    </div>
                    <div v-else class="text-center text-sm text-gray-500 py-4 italic">
                        No activity recorded yet
                    </div>
                </div>

                <!-- Comments Tab -->
                <div v-if="activeTab === 'comments'">

                <div class="flex gap-4 mb-6">
                    <div class="flex-shrink-0">
                        <img
                        v-if="user?.avatar_url"
                        :src="user.avatar_url"
                        class="w-8 h-8 rounded-full border border-gray-200"
                        />
                         <div v-else class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {{ user?.name?.charAt(0).toUpperCase() }}
                         </div>
                    </div>
                     <div class="flex-1">
                        <div class="relative shadow-sm rounded-xl bg-white border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-shadow">
                            <textarea
                                v-model="newComment"
                                placeholder="Write a comment..."
                                class="w-full px-4 py-3 text-sm border-0 focus:ring-0 resize-none h-14 min-h-[56px] focus:min-h-[100px] transition-all"
                            ></textarea>
                            <div class="bg-gray-50 px-2 py-2 flex justify-end border-t border-gray-100" v-if="newComment">
                                <button
                                    @click="addComment"
                                    :disabled="!newComment.trim() || loadingComment"
                                    class="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <svg v-if="loadingComment" class="animate-spin w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {{ loadingComment ? 'Saving...' : 'Save' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Comments List -->
                <div class="space-y-6">
                  <div
                    v-for="comment in taskComments"
                    :key="comment.id"
                    class="flex gap-4 group"
                  >
                    <img
                      v-if="comment.userAvatarUrl"
                      :src="comment.userAvatarUrl"
                      alt=""
                      class="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-100"
                    />
                    <div v-else class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {{ comment.userName.charAt(0).toUpperCase() }}
                    </div>
                    
                    <div class="flex-1">
                      <div class="flex items-baseline gap-2 mb-1">
                         <span class="text-sm font-bold text-gray-900">{{ comment.userName }}</span>
                         <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                      </div>
                      
                      <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-sm text-gray-700 relative hover:shadow-md transition-shadow">
                        {{ comment.content }}
                         <button
                            v-if="comment.userId === user?.id"
                            @click="deleteComment(comment.id)"
                            :disabled="deletingCommentId === comment.id"
                            class="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                          >
                            <svg v-if="deletingCommentId === comment.id" class="animate-spin w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="md:col-span-4 space-y-6">
              <!-- Assignees -->
              <div class="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Assignees</label>
                
                <div class="flex flex-wrap gap-2 mb-3" v-if="taskData?.assignees && taskData.assignees.length > 0">
                    <div
                        v-for="assignee in taskData.assignees"
                        :key="assignee.user.id"
                        class="flex items-center gap-2 bg-white px-2 py-1.5 rounded-lg border border-gray-200 shadow-sm group hover:border-red-200 transition-colors cursor-pointer"
                        @click="unassignUser(assignee.user.id)"
                        title="Click to remove"
                    >
                        <img
                            v-if="assignee.user.avatar_url"
                            :src="assignee.user.avatar_url"
                            class="w-5 h-5 rounded-full object-cover"
                        />
                         <div v-else class="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                            {{ assignee.user.name.charAt(0).toUpperCase() }}
                        </div>
                        <span class="text-xs font-medium text-gray-700 group-hover:text-red-600">{{ assignee.user.name }}</span>
                    </div>
                </div>

                <div class="relative">
                    <button
                    @click="toggleAssigneeSelect"
                    class="w-full px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-lg border border-gray-200 shadow-sm transition-all flex items-center justify-between"
                    >
                    <span>Assign Member</span>
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>

                    <!-- Assignee Dropdown -->
                    <div v-if="showAssigneeSelect" class="absolute left-0 right-0 top-full mt-2 p-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                        <div v-if="loadingMembers" class="text-center py-4">
                             <svg class="animate-spin h-5 w-5 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <div v-else-if="workspaceMembers.length > 0" class="space-y-0.5">
                            <button
                                v-for="member in workspaceMembers"
                                :key="member.userId"
                                @click="assignUser(member.userId)"
                                class="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm flex items-center transition-colors"
                            >
                                <img
                                    v-if="member.avatar_url"
                                    :src="member.avatar_url"
                                    class="w-6 h-6 rounded-full object-cover mr-3 border border-gray-200"
                                />
                                <div v-else class="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                    {{ member.name.charAt(0).toUpperCase() }}
                                </div>
                                <span class="font-medium text-gray-700">{{ member.name }}</span>
                            </button>
                        </div>
                        <p v-else class="text-xs text-gray-500 text-center py-2">No members found</p>
                        
                        <div class="border-t border-gray-100 pt-1 mt-1">
                            <button 
                                @click="inviteMember"
                                class="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm flex items-center gap-2 text-indigo-600 transition-colors"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Invite new member
                            </button>
                        </div>
                    </div>
                 </div>
              </div>


              <!-- Due Date -->
              <div class="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Due Date</label>
                <div class="relative">
                    <input
                    v-model="dueDateInput"
                    @change="saveDueDate"
                    type="date"
                    class="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700 font-medium cursor-pointer"
                    />
                     <svg class="w-5 h-5 text-gray-400 absolute right-3 top-2 pointer-events-none bg-white pl-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              </div>

              <!-- Actions -->
              <div class="pt-4 mt-4 border-t border-gray-100">
                <button
                  @click="handleDelete"
                  :disabled="loadingDelete"
                  class="w-full px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold rounded-xl flex items-center justify-center transition-colors gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="loadingDelete" class="animate-spin w-4 h-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                       <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  {{ loadingDelete ? 'Deleting...' : 'Delete Task' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  task: { type: Object, default: null },
  currentListTitle: { type: String, default: '' },
});

const emit = defineEmits(['close', 'updated', 'deleted']);

const { user } = useAuth();
const { updateTask, deleteTask, fetchTask } = useTask();
const { currentBoard } = useBoard();
const { fetchWorkspace } = useWorkspace();

const localTask = ref(props.task ? { ...props.task } : { title: '', description: '', dueDate: null });
const taskData = ref<any>(null);
const dueDateInput = ref('');
const newComment = ref('');
const taskComments = ref<any[]>([]);
const showAssigneeSelect = ref(false);
const workspaceMembers = ref<any[]>([]);
const loadingMembers = ref(false);
const loadingComment = ref(false);
const loadingDelete = ref(false);
const deletingCommentId = ref<string | null>(null);

// New features state
const uploadingAttachment = ref(false);
const deletingAttachmentId = ref<string | null>(null);
const activeTab = ref('comments');
const activities = ref<any[]>([]);
const loadingActivities = ref(false);

// Load workspace members
const loadWorkspaceMembers = async () => {
    if (workspaceMembers.value.length > 0 || loadingMembers.value) return;
    
    // Try to get workspaceId from currentBoard
    const workspaceId = currentBoard.value?.workspaceId;
    
    if (workspaceId) {
        loadingMembers.value = true;
        try {
            const workspaceData: any = await fetchWorkspace(workspaceId);
            workspaceMembers.value = workspaceData.members || [];
        } catch (e) {
            console.error("Failed to load workspace members", e);
        } finally {
            loadingMembers.value = false;
        }
    }
};

const toggleAssigneeSelect = async () => {
    showAssigneeSelect.value = !showAssigneeSelect.value;
    if (showAssigneeSelect.value) {
        await loadWorkspaceMembers();
    }
};

// Fetch full task data with comments
const loadTaskData = async () => {
  if (!props.task) return;
  try {
    const data = await fetchTask(props.task.id);
    taskData.value = data;
    
    // Load comments
    const commentsResponse: any = await $fetch(`/api/tasks/${props.task.id}/comments`);
    taskComments.value = commentsResponse.comments;

    // Try automated load
    const workspaceId = currentBoard.value?.workspaceId;
    if (workspaceId) {
       loadWorkspaceMembers();
       loadActivities();
    }
  } catch (error) {
    console.error('Failed to load task data:', error);
  }
};

const loadActivities = async () => {
    const workspaceId = currentBoard.value?.workspaceId;
    if (!workspaceId) return;

    loadingActivities.value = true;
    try {
        const data: any = await $fetch(`/api/workspaces/${workspaceId}/activities`);
        // Filter for this task
        activities.value = data.activities.filter((act: any) => 
            act.entityType === 'task' && act.entityId === props.task?.id
        );
    } catch (e) {
        console.error("Failed to load activities", e);
    } finally {
        loadingActivities.value = false;
    }
}

const handleFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !props.task) return;

    const file = input.files[0]!;
    const formData = new FormData();
    formData.append('file', file);

    uploadingAttachment.value = true;
    try {
        await $fetch(`/api/tasks/${props.task.id}/attachments`, {
            method: 'POST',
            body: formData,
        });
        await loadTaskData();
    } catch (error: any) {
        toast.error(error.data?.message || 'Failed to upload attachment');
    } finally {
        uploadingAttachment.value = false;
        input.value = '';
    }
}

const deleteAttachment = async (attachmentId: string) => {
    if (!props.task || !confirm('Delete this attachment?')) return;
    
    deletingAttachmentId.value = attachmentId;
    try {
        await $fetch(`/api/tasks/${props.task.id}/attachments/${attachmentId}`, {
            method: 'DELETE',
        });
        await loadTaskData();
    } catch (error: any) {
        toast.error(error.data?.message || 'Failed to delete attachment');
    } finally {
        deletingAttachmentId.value = null;
    }
}

const inviteMember = async () => {
    const email = prompt("Enter email address to invite:");
    if (!email || !email.trim()) return;
    
    const workspaceId = currentBoard.value?.workspaceId;
    if (!workspaceId) return;

    try {
        await $fetch(`/api/workspaces/${workspaceId}/members/invite`, {
            method: 'POST',
            body: { email: email.trim(), role: 'member' }
        });
        toast.success(`Invitation sent to ${email}`);
        showAssigneeSelect.value = false;
        await loadWorkspaceMembers(); // Refresh list to see if they appear (if auto-added)
    } catch (error: any) {
        toast.error(error.data?.message || 'Failed to invite member');
    }
}

const formatActivity = (activity: any) => {
    // Basic formatter based on action
    switch(activity.action) {
        case 'created': return 'created this task';
        case 'updated': return 'updated this task';
        case 'deleted': return 'deleted this task';
        case 'moved': return 'moved this task';
        case 'commented': return 'commented on this task';
        default: return activity.action.replace('_', ' ');
    }
}

// Update localTask when prop changes
watch(
  () => props.task,
  (newTask) => {
    if (!newTask) return;
    localTask.value = { ...newTask };
    dueDateInput.value = newTask.dueDate
      ? new Date(newTask.dueDate).toISOString().split('T')[0]!
      : '';
    
    if (props.isOpen) {
      loadTaskData();
    }
  },
  { immediate: true }
);

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadTaskData();
    activeTab.value = 'comments'; // Reset tab
  }
});

// Save handlers
const saveTitle = async () => {
  if (!props.task) return;
  if (localTask.value.title !== props.task.title) {
    await updateTask(props.task.id, { title: localTask.value.title });
    emit('updated');
  }
};

const saveDescription = async () => {
  if (!props.task) return;
  if (localTask.value.description !== props.task.description) {
    await updateTask(props.task.id, { description: localTask.value.description });
    emit('updated');
  }
};

const saveDueDate = async () => {
  if (!props.task) return;
  const dueDate = dueDateInput.value ? new Date(dueDateInput.value).toISOString() : null;
  await updateTask(props.task.id, { dueDate });
  emit('updated');
};

// Comments
const addComment = async () => {
  if (!props.task || !newComment.value.trim()) return;

  loadingComment.value = true;
  try {
    await $fetch(`/api/tasks/${props.task.id}/comments`, {
      method: 'POST',
      body: { content: newComment.value.trim() },
    });
    
    newComment.value = '';
    await loadTaskData();
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to add comment');
  } finally {
    loadingComment.value = false;
  }
};

const deleteComment = async (commentId: string) => {
  if (!props.task) return;
  if (confirm('Delete this comment?')) {
    deletingCommentId.value = commentId;
    try {
      await $fetch(`/api/tasks/${props.task.id}/comments/${commentId}`, {
        method: 'DELETE',
      });
      await loadTaskData();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete comment');
    } finally {
      deletingCommentId.value = null;
    }
  }
};

// Assignees
const assignUser = async (userId: string) => {
    if (!props.task) return;
    try {
        await $fetch(`/api/tasks/${props.task.id}/assignees/${userId}`, {
            method: 'POST',
        });
        showAssigneeSelect.value = false;
        await loadTaskData();
    } catch (error: any) {
        toast.error(error.data?.message || 'Failed to assign user');
    }
}

const unassignUser = async (userId: string) => {
  if (!props.task) return;
  try {
    await $fetch(`/api/tasks/${props.task.id}/assignees/${userId}`, {
      method: 'DELETE',
    });
    await loadTaskData();
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to unassign user');
  }
};

const handleDelete = async () => {
  if (!props.task) return;
  if (confirm(`Delete "${localTask.value.title}"?`)) {
    loadingDelete.value = true;
    try {
      await deleteTask(props.task.id);
      emit('deleted');
      close();
    } catch (error: any) {
        toast.error(error.data?.message || 'Failed to delete task');
    } finally {
        loadingDelete.value = false;
    }
  }
};

const close = () => emit('close');

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>
