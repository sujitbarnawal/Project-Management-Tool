<script setup lang="ts">
import { toast } from 'vue3-toastify'

definePageMeta({
    middleware: 'guest'
})
useSeo("Reset Password", "Get otp through the email")


const email= ref("")
const loading=ref(false)

const handleSubmit=async()=>{
    loading.value=true;
    if(!email.value){
        toast.error("Email is required")
        loading.value=false;
        return
    }
    try {
        const response = await $fetch(`/api/auth/send-otp`,{
            method:"POST",
            body:{email:email.value}
        })
        if(response.success){
            toast.success(response.message)
            navigateTo('/auth/verify-otp')
        }
    } catch (error) {
        console.error(error)
    } finally{
        loading.value=false
    }

}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center p-4">

        <div class="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center gap-4">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 50" width="50px" height="50px">
                <circle cx="25" cy="25" r="25" fill="#3949Ab"></circle>
                <path fill="white" fill-rule="evenodd"
                    d="M10 25c0-1.778.614-3.505 1.745-4.91a8.32 8.32 0 0 1 4.5-2.843 8.57 8.57 0 0 1 5.361.42 8.188 8.188 0 0 1 3.966 3.507h12.905c1.393 0 2.523 1.091 2.523 2.435v3.478c0 .277-.114.543-.317.738a1.102 1.102 0 0 1-.764.306h-3.245v2.435c0 .277-.114.542-.316.738a1.102 1.102 0 0 1-.765.305h-3.605c-.286 0-.561-.11-.764-.305a1.025 1.025 0 0 1-.317-.738V28.13h-4.985a8.119 8.119 0 0 1-3.773 3.95 8.56 8.56 0 0 1-5.512.758 8.348 8.348 0 0 1-4.766-2.778A7.83 7.83 0 0 1 10 25.001Zm8.29-2.782c-.764 0-1.498.293-2.038.815a2.734 2.734 0 0 0-.845 1.968c0 .738.304 1.445.845 1.967.54.522 1.274.815 2.039.815.764 0 1.498-.293 2.039-.815.54-.522.844-1.23.844-1.967 0-.738-.303-1.446-.844-1.968a2.938 2.938 0 0 0-2.04-.815Z"
                    clip-rule="evenodd"></path>
            </svg>

            <h1 class="text-3xl font-bold text-indigo-600 mt-1 tracking-tight">Forgot Password</h1>

            <p class="text-gray-500 text-sm text-center -mt-1">Please enter your email to reset password</p>

            <div class="w-full mt-3">
                <div
                    class="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm gap-3 focus-within:ring-2 focus-within:ring-indigo-400 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500 flex-shrink-0"
                        viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <input v-model="email" id="emailInput" required type="email" placeholder="Enter your email address"
                        class="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm" />
                </div>
            </div>

            <button :disabled="loading" @click="handleSubmit"
                class="w-auto px-12 mt-3 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-full shadow-md transition-all duration-200 text-sm tracking-wide">
                {{loading?"Sending...":"Submit"}}
            </button>

        </div>
    </div>
</template>