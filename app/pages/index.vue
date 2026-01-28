<script setup lang="ts">

useSeo("Register or Login","Welcome to TaskFLow")

definePageMeta({
    // layout:'auth',
    middleware:'guest'
})

const name=ref("")
const email=ref("")
const password=ref("")
const state=ref("login")
const {register,login}=useAuth()
const loading=ref(false)
const error=ref("")

const submitForm=async()=>{
    loading.value=true
    error.value=""
    if(state.value==='register'){
        const data={
            name:name.value,
            email:email.value,
            password:password.value
        }
        try {
           const response = await  register(data) 
           if(response.success){
            alert(response.message)
            name.value=""
            email.value=""
            password.value=""
            navigateTo('/dashboard')
           }

           
        } catch (e:any) {
            if(e instanceof Error){
                error.value=e.message
            }else{
                error.value="Registration Failed"
            }
            
        } finally{
            loading.value=false
        }
    }else{
        const data={
            email:email.value,
            password:password.value
        }
        try {
           const response = await  login(data) 
           if(response.success){
            alert(response.message)
            email.value=""
            password.value=""
            navigateTo('/dashboard')
           }

           
        } catch (e:any) {
            if(e instanceof Error){
                error.value=e.message
            }else{
                error.value="Login Failed"
            }
            
        } finally{
            loading.value=false
        }
    }
}

</script>
<template>
    <section class="flex max-md:p-2 items-center justify-center min-h-screen">
        <div class="max-w-md w-full space-y-2 p-4 bg-white rounded-lg shadow-lg">
            <h1 class="text-center text-3xl text-blue-600 font-semibold">TaskFlow</h1>
            <p class="text-md text-red-600">{{ error }}</p>
            <form @submit.prevent="submitForm" class="space-y-2">
                <label v-if="state==='register'" class="block text-lg font-semibold">Name</label>
                <input v-if="state==='register'" required v-model="name" class="px-3 py-2 outline:none focus:outline-none border-2 rounded-lg w-full" type="text" placeholder="Your Name">
                <label class="block text-lg font-semibold">Email</label>
                <input required v-model="email" class="px-3 py-2 outline:none focus:outline-none border-2 rounded-lg w-full" type="email" placeholder="Your Email">
                <label class="block text-lg font-semibold">Password</label>
                <input required v-model="password" class="px-3 py-2 outline:none focus:outline-none border-2 rounded-lg w-full" type="password" placeholder="Your Password">
                <button :disabled="loading" type="submit" class="bg-blue-600 hover:bg-blue-700 transition-colors w-full px-3 py-2 text-center text-white rounded-lg text-xl">
                    {{ state==="login"?(loading?"Logging in..":"Login"):(loading?"Creating...":"Create Account") }}
                </button>
            </form>
            <p v-if="state==='register'" class="text-center">Already have an account?<span @click="state='login'" class="underline text-blue-600 cursor-pointer">Login</span></p>
            <p v-if="state==='login'" class="text-center">Dont have an account?<span @click="state='register'" class="underline text-blue-600 cursor-pointer">Register</span></p>
        </div>
    </section>
</template>
