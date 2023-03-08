<template>
        <b-container fluid>
            <b-row align-h="center">
                <h2><b-icon icon="key" aria-hidden="true"></b-icon> Admin Login</h2>
            </b-row>
            <b-row align-h="center">
                <b-form @submit.prevent="login" class="w-25">
                    <b-form-group label="Email address:" label-for="email">
                        <b-form-input v-model="form.email" type="email" id="email" required placeholder="Enter email" />
                    </b-form-group>

                    <b-form-group label="Password:" label-for="password">
                        <b-form-input v-model="form.password" type="password" id="password" required
                            placeholder="Enter password" />
                    </b-form-group>
                    <b-button type="submit" v-if="isLoading" variant="primary" class="d-flex align-items-center" size="lg" disabled>
                        <span class="mr-2">Loading...</span>
                        <b-spinner style="width: 1.5rem; height: 1.5rem;"></b-spinner>
                    </b-button>
                    <b-button v-else type="submit" variant="primary" size="lg" :disabled="loginDisabled">Login</b-button>
                </b-form>
            </b-row>
        </b-container>
</template>

<script>

export default {
    asyncData({$cookies}) {
         $cookies.removeAll()
    },

    head() {
        return {
            title: "Login -  NMBTS",
        };
    },

    data() {
        return {
            form: {
                email: "",
                password: ""
            },
            isLoading: false,
        };
    },

    computed: {
        loginDisabled() {
            return this.form.email === "" || this.form.password === "" 
        }
    },
    methods: {
        login() {
            const f = this.form;
            const payload = {
                email: f.email,
                password: f.password
            }

            return this.$store.dispatch("loginAdminUser", payload).then(() => {
                this.$store.commit("setIsAuthenticated", true);
                this.$router.push("/admin");
            }).catch((err) => {
                this.$bvToast.toast(err.response.data.message, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            });
        }
    }
};
</script>
