<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50/50 via-gray-50 to-white py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
        <h2 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Profile Settings</h2>
        <NuxtLink to="/" class="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </NuxtLink>
      </div>

      <div class="p-6 space-y-6">
        <!-- Avatar Section -->
        <div class="flex flex-col items-center space-y-3">
          <div class="relative group">
            <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 ring-4 ring-indigo-50 shadow-lg">
              <img
                v-if="user?.avatar_url"
                :src="user.avatar_url"
                alt="Profile"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl font-bold"
              >
                {{ user?.name?.charAt(0).toUpperCase() }}
              </div>
              
              <!-- Hover Overlay -->
              <label 
                class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
              >
                <span class="text-white text-xs font-semibold bg-black/20 px-3 py-1 rounded-full border border-white/30">Change</span>
                <input type="file" class="hidden" accept="image/*" @change="handleAvatarUpload" />
              </label>
            </div>
            <div v-if="uploadingAvatar" class="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full backdrop-blur-sm z-10">
              <svg class="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 font-medium">Click image to upload new avatar</p>
        </div>

        <!-- Profile Form -->
        <form @submit.prevent="updateProfile" class="space-y-5 max-w-lg mx-auto w-full">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-gray-50/50 focus:bg-white"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div class="relative">
                <input
                :value="user?.email"
                type="email"
                disabled
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100/50 text-gray-500 cursor-not-allowed"
                />
                 <svg class="w-5 h-5 text-gray-400 absolute right-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <p class="mt-1.5 text-xs text-gray-400">Email cannot be changed for security reasons.</p>
          </div>
          
           <!-- Subscription Section -->
           <div class="pt-3 border-t border-gray-100">
            <h3 class="text-base font-semibold text-gray-800 mb-3">Subscription</h3>
            <div class="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p class="text-sm text-gray-500 font-medium">Current Plan</p>
                <p class="text-lg font-bold text-gray-900 capitalize flex items-center gap-2">
                  {{ user?.subscription_plan === 'free' ? 'Free' : 'Premium' }}
                  <span v-if="user?.subscription_plan === 'premium'" class="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold ring-1 ring-yellow-400/50">PRO</span>
                </p>
                <p v-if="subscriptionExpiryFormatted" class="text-xs text-gray-500 mt-1">
                  Expires on: {{ subscriptionExpiryFormatted }}
                </p>
              </div>
              <NuxtLink to="/subscription" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm whitespace-nowrap">
                {{ user?.subscription_plan === 'free' ? 'Upgrade Plan' : 'Manage' }}
              </NuxtLink>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Saving Changes...' : 'Save Changes' }}
            </button>
          </div>

          <!-- Messages -->
          <transition enter-active-class="transition ease-out duration-200" leave-active-class="transition ease-in duration-150" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
            <div v-if="message.text" :class="['p-3 rounded-xl text-sm font-medium flex items-center gap-2', message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100']">
                <svg v-if="message.type === 'success'" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <svg v-else class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {{ message.text }}
            </div>
          </transition>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, fetchUser } = useAuth();

const loading = ref(false);
const uploadingAvatar = ref(false);
const message = ref({ type: '', text: '' });

const form = ref({
  name: user.value?.name || '',
});

// Update form when user data usually loads
watch(() => user.value, (newUser) => {
  if (newUser) {
    form.value.name = newUser.name;
  }
}, { immediate: true });

// Computed property for subscription expiry
const subscriptionExpiryFormatted = computed(() => {

  const expiryDate = user.value?.subscription_expiry;
  
  if (!expiryDate) {
    console.log('No expiry date found');
    return null;
  }
  
  try {
    const date = new Date(expiryDate);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.log('Invalid date:', expiryDate);
      return null;
    }
    
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    console.log('Formatted expiry date:', formatted);
    return formatted;
  } catch (error) {
    console.error('Error formatting subscription expiry:', error);
    return null;
  }
});

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0]!;
  const formData = new FormData();
  formData.append('file', file);

  uploadingAvatar.value = true;
  message.value = { type: '', text: '' };

  try {
    await $fetch('/api/users/upload-avatar', {
      method: 'POST',
      body: formData,
    });
    
    await fetchUser(); // Refresh user data to get new avatar URL
    message.value = { type: 'success', text: 'Avatar updated successfully!' };
  } catch (error: any) {
    message.value = { type: 'error', text: error.data?.message || 'Failed to upload avatar' };
  } finally {
    uploadingAvatar.value = false;
    input.value = ''; // Reset input
  }
};

const updateProfile = async () => {
  if (!user.value) return;
  
  loading.value = true;
  message.value = { type: '', text: '' };

  try {
    await $fetch(`/api/users/${user.value.id}`, {
      method: 'PATCH',
      body: { name: form.value.name },
    });
    
    await fetchUser(); // Refresh data
    message.value = { type: 'success', text: 'Profile updated successfully!' };
  } catch (error: any) {
    message.value = { type: 'error', text: error.data?.message || 'Failed to update profile' };
  } finally {
    loading.value = false;
  }
};

useSeo("Profile","Manage your profile and account settings")
</script>

