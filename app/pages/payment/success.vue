<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-12">
    <div class="max-w-lg w-full">
      <!-- Main Card -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
        <!-- Animated Background Pattern -->
        <div class="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-8 overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div class="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3 animate-pulse delay-150"></div>
          </div>
          
          <!-- Icon -->
          <div class="relative flex justify-center mb-4">
            <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm animate-bounce-slow">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg animate-scale-in">
                <svg class="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Title -->
          <h1 class="relative text-3xl md:text-4xl font-extrabold text-white text-center mb-2">
            Payment Successful!
          </h1>
          <p class="relative text-green-100 text-center text-sm">
            Your subscription has been activated
          </p>
        </div>
        
        <!-- Content -->
        <div class="p-8 md:p-10">
          <!-- Success Message -->
          <div class="mb-8">
            <p class="text-gray-700 text-center text-base leading-relaxed mb-6">
              Congratulations! Your premium subscription is now active. You now have access to:
            </p>
            <ul class="space-y-3 text-sm text-gray-600">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Unlimited Workspaces</strong> - Create as many workspaces as you need</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Unlimited Boards</strong> - No limits on your project boards</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Priority Support</strong> - Get help when you need it</span>
              </li>
            </ul>
          </div>

          <!-- Redirect Info -->
          <div class="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-green-600 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-sm text-gray-700 font-medium">
                Redirecting to dashboard in <span class="font-bold text-green-600 text-lg">{{ secondsLeft }}s</span>
              </p>
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
              <div 
                class="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-75 ease-linear rounded-full shadow-sm"
                :style="{ width: progressWidth + '%' }"
              ></div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <button 
              @click="redirectNow"
              class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0 flex items-center justify-center gap-2 group"
            >
              <span>Go to Dashboard</span>
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button 
              @click="navigateTo('/profile')"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              View Subscription Details
            </button>
          </div>
        </div>
      </div>
      
      <!-- Help Text -->
      <p class="text-center text-sm text-gray-500 mt-6">
        Thank you for your support! 🎉
      </p>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const secondsLeft = ref(5)
const progressWidth = ref(0)
let intervalId = null

const startCountdown = () => {
  const totalSeconds = 5
  const intervalMs = 30 // Update every 30ms for smooth animation
  const totalIntervals = (totalSeconds * 1000) / intervalMs
  let currentInterval = 0

  intervalId = setInterval(() => {
    currentInterval++
    progressWidth.value = (currentInterval / totalIntervals) * 100
    secondsLeft.value = Math.ceil((totalIntervals - currentInterval) * intervalMs / 1000)

    if (currentInterval >= totalIntervals) {
      clearInterval(intervalId)
      redirect()
    }
  }, intervalMs)
}

const redirect = () => {
  navigateTo('/dashboard')
}

const redirectNow = () => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  redirect()
}

onMounted(() => {
  startCountdown()
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { 
    transform: translateY(0);
  }
  50% { 
    transform: translateY(-10px);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes scale-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.animate-scale-in {
  animation: scale-in 0.5s ease-out;
}
</style>
