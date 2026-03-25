<template>
    <form class="text-textColor h-fit flex flex-col gap-6 p-4 border-4 border-textColor min-w-80 rounded-lg">
        <div>
            <h5 class="text-center">Log In</h5>
            <hr class="">
        </div>
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
            :error="authError"
            required
        />

        <div class="flex flex-col gap-2 justify-center">
            <BaseButton @click="handleLogin" :disalbed="isLoading">{{isLoading ? 'Loading...' : 'Submit'}}</BaseButton>
            <div class="text-secondary">You don't have an account <span class="text-textColor font-bold"><RouterLink to="/signup">Sign Up</RouterLink></span></div>
        </div>

    </form>
</template>
<script>
import BaseButton from '@/components/common/AppButton.vue';
import BaseInput from '@/components/common/AppInput.vue';
import { useAuthStore } from '@/stores';
import { login } from '@/utils/auth';


export default {
    data(){
        return {
            email:"",
            emailError:"",
            password: "",
            authError:"",
            isLoading: false,
        }
    },
    components:{
        BaseButton,
        BaseInput
    },
    computed: {
        authStore(){
            return useAuthStore();
        },
    },
    methods:{
        async handleLogin(){
            let res;
            this.authError = '';
            this.emailError = '';

            if(!this.email || !this.password){
                this.authError = 'Please fill in all fields'
                return ;
            }

            this.isLoading = true;
            try{
                res = await login(this.email, this.password);
            }
            catch(error){
                this.authError = "Sorry an unexpecated error happened, try again later"
                this.isLoading = false;
                return;
            }
            if(!res?.success){
                if(res.errors.validationErrors){
                    this.emailError = res.errors.validationErrors['email'];
                    this.authError = res.errors.validationErrors['password'];
                }
                else{
                    this.authError = res.errors.authError;
                }
                this.isLoading = false;
                return ;
            }

            this.authStore.setUser(res.user, res.token);
            this.isLoading = false;
            this.$router.push('/');
        }
    }
}

</script>
