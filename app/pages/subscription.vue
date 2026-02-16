<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {toast} from "vue3-toastify"

useSeo("Subscription","Subscribe for the unlimited features")

const {  user, fetchUser } = useAuth();
const loading = ref(false);
const route = useRoute();


const isFree = computed(() => {
    const plan = user.value?.subscription_plan;
    return !plan || plan === 'free';
});


onMounted(async () => {
    await fetchUser();
    
    // Check for error query parameters
    const error = route.query.error;
    if (error) {
        const errorMessages: Record<string, string> = {
            'payment_incomplete': 'Payment was not completed. Please try again.',
            'invalid_transaction': 'Invalid transaction. Please contact support if this persists.',
            'verification_failed': 'Payment verification failed. Please try again or contact support.',
            'user_not_found': 'User account not found. Please contact support.'
        };
        
        const message = errorMessages[error as string] || 'An error occurred during payment.';
        toast.error(message);
        
        // Clean up the URL
        navigateTo('/subscription', { replace: true });
    }
});

// const config = useRuntimeConfig()

const initiatePayment = async () => {
    loading.value = true;
    try {
        const formData = {
            amount: "100",
            tax_amount: "0",
            total_amount: "100",
            transaction_uuid: 'sub_' + Date.now(),
            product_code: "EPAYTEST",
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: `${window.location.origin}/api/payment/success`,
            failure_url: `${window.location.origin}/payment/failure`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: "" 
        };
        const { signature, signed_field_names, transaction_uuid } = await $fetch('/api/payment/initiate', {
            method: 'POST',
            body: { total_amount: formData.total_amount }
        });
        
        formData.signature = signature;
        formData.signed_field_names = signed_field_names;
        formData.transaction_uuid = transaction_uuid;

        console.log('Payment form data:', formData);

        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");
        // form.setAttribute("action", String(config.public.esewaInitiationUrl));

        for (const key in formData) {
            const hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", formData[key as keyof typeof formData]);
            form.appendChild(hiddenField);
        }

        document.body.appendChild(form);
        console.log('Submitting form to eSewa...');
        form.submit();

    } catch (error:any) {
        console.error('Payment initiation failed', error);
        toast.error('Failed to initiate payment: ' + error.message);
        loading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Choose your plan
                </h1>
                <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                    Unlock the full potential of your team with our premium features.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <!-- Free Plan -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative transition-transform hover:-translate-y-1 duration-300">
                    <div class="p-8 flex-1">
                        <h3 class="text-xl font-semibold text-gray-900">Free</h3>
                        <p class="mt-4 flex items-baseline text-gray-900">
                            <span class="text-5xl font-extrabold tracking-tight">NPR 0</span>
                            <span class="ml-1 text-xl font-semibold text-gray-500">/month</span>
                        </p>
                        <p class="mt-6 text-gray-500">Perfect for individuals and small projects getting started.</p>

                        <ul role="list" class="mt-6 space-y-6">
                            <li class="flex">
                                <svg class="flex-shrink-0 w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                                <span class="ml-3 text-gray-500">2 Workspaces</span>
                            </li>
                            <li class="flex">
                                <svg class="flex-shrink-0 w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                                <span class="ml-3 text-gray-500">2 Boards per Workspace</span>
                            </li>
                             <li class="flex">
                                <svg class="flex-shrink-0 w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                                <span class="ml-3 text-gray-500">Basic Features</span>
                            </li>
                        </ul>
                    </div>
                    <div class="p-8 bg-gray-50 border-t border-gray-100">
                         <button v-if="isFree" class="w-full block bg-gray-200 border border-transparent rounded-xl py-3 px-6 text-center font-medium text-gray-700 cursor-default">
                            Current Plan
                        </button>
                         <button v-else class="w-full block bg-white border border-gray-300 rounded-xl py-3 px-6 text-center font-medium text-gray-700 cursor-default">
                            Downgrade (Not Available)
                        </button>
                    </div>
                </div>

                <!-- Premium Plan -->
                <div class="bg-white rounded-2xl shadow-xl border-2 border-indigo-500 overflow-hidden flex flex-col relative transition-transform hover:-translate-y-1 duration-300 transform scale-105 md:scale-100 lg:scale-105 z-10">
                     <div class="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 rounded-bl-xl text-sm font-bold" v-if="!isFree">
                        ACTIVE
                    </div>
                    <div class="p-8 flex-1">
                        <h3 class="text-xl font-semibold text-gray-900">Premium</h3>
                        <p class="mt-4 flex items-baseline text-gray-900">
                            <span class="text-5xl font-extrabold tracking-tight">NPR 100</span>
                            <span class="ml-1 text-xl font-semibold text-gray-500">/month</span>
                        </p>
                        <p class="mt-6 text-gray-500">For power users and growing teams who need more flexibility.</p>

                         <ul role="list" class="mt-6 space-y-6">
                            <li class="flex">
                                <svg class="flex-shrink-0 w-6 h-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                                <span class="ml-3 text-gray-500">Unlimited Workspaces</span>
                            </li>
                            <li class="flex">
                                <svg class="flex-shrink-0 w-6 h-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                                <span class="ml-3 text-gray-500">Unlimited Boards</span>
                            </li>
                            <li class="flex">
                                <svg class="flex-shrink-0 w-6 h-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                                <span class="ml-3 text-gray-500">Priority Support</span>
                            </li>
                        </ul>
                    </div>
                    <div class="p-8 bg-gray-50 border-t border-gray-100">
                        <button 
                            v-if="isFree" 
                            @click="initiatePayment" 
                            :disabled="loading"
                            class="w-full flex items-center justify-center bg-green-600 border border-transparent rounded-xl py-3 px-6 text-center font-bold text-white hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg"
                        >
                            <span v-if="loading">Processing...</span>
                            <span v-else>Pay with eSewa</span>
                        </button>
                         <button v-else class="w-full block bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl py-3 px-6 text-center font-bold cursor-default">
                             <span class="flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                Plan Active
                             </span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Test Credentials -->
             <div class="mt-16 max-w-3xl mx-auto bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                <div class="flex items-start gap-4">
                     <div class="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-gray-900 mb-2">Test Credentials</h4>
                        <p class="text-gray-600 mb-4 text-sm">
                            This is a test integration. You can use the following credentials to complete the payment flow on the eSewa interface.
                        </p>
                        <div class="grid sm:grid-cols-2 gap-4">
                            <div class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <span class="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">eSewa ID (Username)</span>
                                <code class="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">9806800001</code>
                            </div>
                            <div class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <span class="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Password</span>
                                <code class="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">Nepal@123</code>
                            </div>
                              <div class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <span class="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">MPIN</span>
                                <code class="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">1122</code>
                            </div>
                             <div class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <span class="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Token</span>
                                <code class="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">123456</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
