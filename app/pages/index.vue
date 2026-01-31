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
            error.value = e instanceof Error ? e.message : "Registration Failed"
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
            error.value = e instanceof Error ? e.message : "Login Failed"
        } finally {
            loading.value = false
        }
    }
}
</script>

<template>
    <section class="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div class="max-w-md w-full space-y-6 p-6 bg-white rounded-xl shadow-xl border border-gray-200">
            <h1 class="text-center text-3xl font-bold text-blue-600">TaskFlow</h1>

            <p v-if="error" class="text-center text-red-600 font-medium">{{ error }}</p>

            <form @submit.prevent="submitForm" class="space-y-4">

                <div v-if="state === 'register'" class="space-y-1">
                    <label class="block text-lg font-medium text-gray-700">Name</label>
                    <input v-model="name" required type="text" placeholder="Your Name"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <!-- Email -->
                <div class="space-y-1">
                    <label class="block text-lg font-medium text-gray-700">Email</label>
                    <input v-model="email" required type="email" placeholder="Your Email"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div class="space-y-1 relative">
                    <label class="block text-lg font-medium text-gray-700">Password</label>
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" required
                        placeholder="Your Password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
                    <span @click="showPassword = !showPassword"
                        class="absolute top-2/3 bottom-1/2 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700">
                        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zM10 15a5 5 0 110-10 5 5 0 010 10z" />
                            <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                d="M2.293 2.293a1 1 0 011.414 0L17 15.586a1 1 0 11-1.414 1.414L14.243 15H14c-1.657 0-3-1.343-3-3V11h-.243L2.293 3.707a1 1 0 010-1.414zM10 5a5 5 0 015 5c0 .205-.022.406-.064.6l-7.536-7.536A4.972 4.972 0 0110 5z" />
                        </svg>
                    </span>
                </div>

                <div v-if="state === 'register'" class="space-y-1 relative">
                    <label class="block text-lg font-medium text-gray-700">Confirm Password</label>
                    <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required
                        placeholder="Confirm Password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
                    <span @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute top-2/3 bottom-1/2 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700">
                        <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path
                                d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zM10 15a5 5 0 110-10 5 5 0 010 10z" />
                            <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                d="M2.293 2.293a1 1 0 011.414 0L17 15.586a1 1 0 11-1.414 1.414L14.243 15H14c-1.657 0-3-1.343-3-3V11h-.243L2.293 3.707a1 1 0 010-1.414zM10 5a5 5 0 015 5c0 .205-.022.406-.064.6l-7.536-7.536A4.972 4.972 0 0110 5z" />
                        </svg>
                    </span>
                </div>

                <button :disabled="loading" type="submit"
                    class="w-full py-3 text-white bg-blue-600 rounded-lg text-xl font-medium hover:bg-blue-700 transition-all disabled:opacity-60">
                    {{ state === "login" ? (loading ? "Logging in..." : "Login") : (loading ? "Creating..." : "CreateAccount") }}
                </button>
            </form>

            <p class="text-center text-gray-600">
                <span v-if="state === 'register'">Already have an account? <span @click="state = 'login'"
                        class="text-blue-600 cursor-pointer underline">Login</span></span>
                <span v-else>Don't have an account? <span @click="state = 'register'"
                        class="text-blue-600 cursor-pointer underline">Register</span></span>
            </p>
        </div>
    </section>
</template>
