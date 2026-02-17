<script setup>
definePageMeta({
    middleware: 'guest'
})
const {user}=useAuth()
const cookie = useCookie("userCookie")
const supabase = useSupabase()

onMounted(async () => {
    try {
        const { data, error } = await supabase.auth.getSession()

        if (error || !data.session) {
            console.error("No session found", error)
            navigateTo('/?error=no_session')
            return
        }

        const response =await $fetch('/api/auth/google-login', {
            method: 'POST',
            body: {
                access_token: data.session.access_token
            }
        })
        user.value=response.user
        cookie.value=response.user

        await supabase.auth.signOut()
        navigateTo('/dashboard')
    } catch (e) {
        console.error("Google login error", e)
        navigateTo('/?error=google_callback_failed')
    }
})

useSeo("Callback", "Google login callback page")
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Processing login...</h2>
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
    </div>
</template>