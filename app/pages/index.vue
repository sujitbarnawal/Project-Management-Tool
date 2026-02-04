<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useSeo } from '@/composables/useSeo'

useSeo("Register or Login", "Welcome to TaskFlow")

definePageMeta({
    middleware: 'guest'
})

const name = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const state = ref("login")
const loading = ref(false)
const error = ref("")

const { register, login } = useAuth()

const submitForm = async () => {
    loading.value = true
    error.value = ""

    if (state.value === 'register' && password.value !== confirmPassword.value) {
        error.value = "Passwords do not match"
        loading.value = false
        return
    }

    if (state.value === 'register') {
        const data = { name: name.value, email: email.value, password: password.value }
        try {
            const response = await register(data)
            if (response.success) {
                alert(response.message)
                name.value = ""
                email.value = ""
                password.value = ""
                confirmPassword.value = ""
                navigateTo('/dashboard')
            }
        } catch (e: any) {
            error.value = e.data?.statusMessage || e.message || "Registration Failed"
        } finally {
            loading.value = false
        }
    } else {
        const data = { email: email.value, password: password.value }
        try {
            const response = await login(data)
            if (response.success) {
                alert(response.message)
                email.value = ""
                password.value = ""
                navigateTo('/dashboard')
            }
        } catch (e: any) {
            error.value = e.data?.statusMessage || e.message || "Login Failed"
        } finally {
            loading.value = false
        }
    }
}
</script>

<template>
    <section class="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-50 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50">
            <div class="text-center">
                <div class="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                    <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                </div>
                <h1 class="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                    TaskFlow
                </h1>
                <p class="mt-2 text-sm text-gray-600">
                    {{ state === 'login' ? 'Welcome back! Sign in to your account.' : 'Start your journey with us today.' }}
                </p>
            </div>

            <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{{ error }}</p>
                    </div>
                </div>
            </div>

            <form @submit.prevent="submitForm" class="mt-8 space-y-6">
                <div class="space-y-4">
                    <div v-if="state === 'register'">
                        <label class="block text-sm font-medium text-gray-700">Full Name</label>
                        <div class="mt-1">
                            <input v-model="name" required type="text" 
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" 
                                placeholder="Your Name" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email address</label>
                        <div class="mt-1">
                            <input v-model="email" required type="email" 
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" 
                                placeholder="you@example.com" />
                        </div>
                    </div>

                    <div class="relative">
                        <label class="block text-sm font-medium text-gray-700">Password</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <input v-model="password" :type="showPassword ? 'text' : 'password'" required
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors pr-10" 
                                placeholder="••••••••" />
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" @click="showPassword = !showPassword">
                                <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zM10 15a5 5 0 110-10 5 5 0 010 10z" />
                                    <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                                </svg>
                                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.293 2.293a1 1 0 011.414 0L17 15.586a1 1 0 11-1.414 1.414L14.243 15H14c-1.657 0-3-1.343-3-3V11h-.243L2.293 3.707a1 1 0 010-1.414zM10 5a5 5 0 015 5c0 .205-.022.406-.064.6l-7.536-7.536A4.972 4.972 0 0110 5z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div v-if="state === 'register'" class="relative">
                        <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors pr-10" 
                                placeholder="••••••••" />
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" @click="showConfirmPassword = !showConfirmPassword">
                                <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zM10 15a5 5 0 110-10 5 5 0 010 10z" />
                                    <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                                </svg>
                                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.293 2.293a1 1 0 011.414 0L17 15.586a1 1 0 11-1.414 1.414L14.243 15H14c-1.657 0-3-1.343-3-3V11h-.243L2.293 3.707a1 1 0 010-1.414zM10 5a5 5 0 015 5c0 .205-.022.406-.064.6l-7.536-7.536A4.972 4.972 0 0110 5z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <button :disabled="loading" type="submit"
                        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg v-if="!loading" class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                            </svg>
                            <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                        {{ state === "login" ? (loading ? "Signing in..." : "Sign in") : (loading ? "Creating account..." : "Create account") }}
                    </button>
                </div>
            </form>

            <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500 rounded-md">
                            {{ state === 'login' ? 'New here?' : 'Already have an account?' }}
                        </span>
                    </div>
                </div>

                <div class="mt-6 grid grid-cols-1 gap-3">
                    <button @click="state = state === 'login' ? 'register' : 'login'; error = ''"
                        class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        {{ state === 'login' ? 'Create an account' : 'Sign in to existing account' }}
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
