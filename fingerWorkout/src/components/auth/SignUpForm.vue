<script setup>
import BaseButton from '@/components/common/AppButton.vue';
import BaseInput from '@/components/common/AppInput.vue';
</script>

<template>
    <form class="text-textColor h-fit flex flex-col gap-6 p-4 border-4 border-textColor min-w-80 rounded-lg">
        <div>
            <h5 class="text-center">Sign Up</h5>
            <hr class="">
        </div>
        <BaseInput
            v-model="name"
            label="Display Name:"
            type="text"
            placeholder="your username"
            :error="nameError"
            required
        />
        <BaseInput
            v-model="email"
            label="Email Address :"
            type="email"
            placeholder="your@email.com"
            :error="emailError"
            required
        />
        <BaseInput
            v-model="password"
            label="Password :"
            type="password"
            placeholder="******"
            :error="passwordError"
            required
        />

        <div class="flex flex-col gap-2 justify-center">
            <BaseButton @click="handleSignup" :disabled="isLoading">{{ isLoading ? 'Loading...' : 'submit' }}</BaseButton>
            <div class="text-secondary">You already have an account <span><RouterLink class="text-textColor" to="/login">Log In</RouterLink></span></div>
        </div>

    </form>
</template>
<script>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../../stores';
import { register, login } from '@/utils/auth';

export default {
    data(){
        return {
            name:"",
            nameError:"",
            email:"",
            emailError:"",
            password: "",
            passwordError:"",
            isLoading: false,
        }
    },
    computed: {
        authStore(){
            return useAuthStore();
        }
    },
    watch:{
        password(newVal){
            this.passwordError = newVal.length < 6 ? "Password too short" : "";
        },
        email(newVal){
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            this.emailError = re.test(newVal) ? "" : "Email invalid";
        },
        'authStore.error'(newError){
            if(newError){
                this.passwordError = newError;
                this.authStore.clearError();
            }
        }
    },
    methods:{
        async handleSignup(e){
            e.preventDefault();
            this.nameError = "";
            this.emailError = "";
            this.passwordError = "";

            if(!this.name){
                this.nameError = 'Please fill in name';
            }
            if(!this.email){
                this.emailError = 'Please fill in email';
            }
            if(!this.password){
                this.passwordError =  'Please fill in password';
            }
            if(!this.name || !this.email || !this.password){
                return;
            }

            this.isLoading = true;

            let res;
            try {
                res = await register(this.name, this.email, this.password);
            } catch(error) {
                this.passwordError = "Sorry, an unexpected error happened. Try again later.";
                this.isLoading = false;
                return;
            }

            if(!res.success){
                if(res.errors.validationErrors){
                    this.nameError = res.errors.validationErrors['name'] || '';
                    this.emailError = res.errors.validationErrors['email'] || '';
                    this.passwordError = res.errors.validationErrors['password'] || '';
                } else {
                    this.emailError = res.errors.authError;
                }
                this.isLoading = false;
                return;
            }

            // Auto-login after successful registration
            try {
                const resLogin = await login(this.email, this.password);
                if (!resLogin.success) {
                    // Registration succeeded but auto-login failed — redirect to login page
                    this.isLoading = false;
                    this.$router.push('/login');
                    return;
                }
                this.authStore.setUser(resLogin.user, resLogin.token);
                this.isLoading = false;
                this.$router.push('/');
            } catch(error) {
                this.isLoading = false;
                this.$router.push('/login');
            }
        }
    }
}

</script>