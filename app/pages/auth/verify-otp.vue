<script setup lang="ts">
import { toast } from 'vue3-toastify'

definePageMeta({
    middleware: 'guest'
})

useSeo("Reset Password", "Verify OTP and set new password")

const otp = ref("")
const password = ref("")
const confirmPassword = ref("")
const loading = ref(false)

const handleSubmit = async () => {

    if (password.value !== confirmPassword.value) {
        toast.error("Passwords do not match")
        return
    }

    loading.value = true
    try {
        const response = await $fetch(`/api/auth/verify-otp`, {
            method: "POST",
            body: {
                otp: otp.value,
                password: password.value
            }
        })

        if (response.success) {
            toast.success(response.message)
            navigateTo('/')
        }

    } catch (error: any) {
        toast.error(error?.data?.statusMessage || "Something went wrong")
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center gap-4">

            <h1 class="text-3xl font-bold text-indigo-600 tracking-tight">
                Reset Password
            </h1>

            <p class="text-gray-500 text-sm text-center -mt-1">
                Enter OTP and your new password
            </p>

            <form @submit.prevent="handleSubmit" class="w-full mt-3 flex flex-col gap-4">

                <!-- OTP -->
                <div class="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 transition">
                    <input
                        v-model="otp"
                        required
                        maxlength="6"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        class="flex-1 bg-transparent outline-none text-gray-700 text-sm text-center tracking-widest"
                    />
                </div>

                <!-- New Password -->
                <div class="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 transition">
                    <input
                        v-model="password"
                        required
                        type="password"
                        placeholder="New Password"
                        class="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                    />
                </div>

                <!-- Confirm Password -->
                <div class="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 transition">
                    <input
                        v-model="confirmPassword"
                        required
                        type="password"
                        placeholder="Confirm Password"
                        class="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                    />
                </div>

                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-full shadow-md transition-all duration-200 text-sm tracking-wide"
                >
                    {{ loading ? "Updating..." : "Reset Password" }}
                </button>

            </form>
        </div>
    </div>
</template>
