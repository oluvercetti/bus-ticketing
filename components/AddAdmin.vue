<template>
    <div>
        <b-container fluid v-if="registrationSuccessful">
            <b-row align-h="center">
                <div class="alert alert-primary" role="alert">
                    Registration was successful.
                </div>
            </b-row>
            <b-row align-h="center">
                <nuxt-link to="/login" class="btn btn-primary btn-lg">Click to Login</nuxt-link>
            </b-row>
        </b-container>
        <b-container fluid v-else>
            <b-row align-h="center">
                <b-form @submit.prevent="register" class="w-25">
                    <b-form-group label="Firstname:" label-for="firstname">
                        <b-form-input v-model="form.firstname" type="text" id="firstname" required
                            placeholder="Enter firstname" />
                    </b-form-group>
                    <b-form-group label="Lastname:" label-for="lastname">
                        <b-form-input v-model="form.lastname" type="text" id="lastname" required
                            placeholder="Enter lastname" />
                    </b-form-group>
                    <b-form-group label="Email address:" label-for="email">
                        <b-form-input v-model="form.email" type="email" id="email" required placeholder="Enter email" />
                    </b-form-group>
                    <b-form-group label="Password:" label-for="password">
                        <b-form-input v-model="form.password" type="password" id="password" required
                            placeholder="Enter password" />
                    </b-form-group>
                    <b-form-group label="Confirm Password:" label-for="confirmpassword">
                        <b-form-input v-model="form.confirm_password" :invalid-feedback="passwordMismatch"
                            type="password" id="confirmpassword" required placeholder="Enter password again" />
                    </b-form-group>
                    <b-button type="submit" :disabled="disabled" variant="primary">Sign up</b-button>
                </b-form>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    layout: "admin",
    data() {
        return {
            form: {
                email: "",
                firstname: "",
                lastname: "",
                password: "",
                confirm_password: "",
            },
            disabled: false,
            registrationSuccessful: false,
        };
    },
    methods: {
        register() {
            if (this.passwordMismatch) {
                return
            }
            this.disabled = true;
            const f = this.form;
            const payload = {
                name: `${f.firstname} ${f.lastname}`,
                email: f.email,
                password: f.password,
            }

            return this.$store.dispatch("createUser", payload).then(() => {
                this.disabled = false;
                this.registrationSuccessful = true;
                this.$bvToast.toast('Account created successfully', {
                    title: 'Success',
                    variant: 'success',
                    delay: 300
                })
            }).catch((err) => {
                this.disabled = false;
                this.$bvToast.toast(err.response.data.message, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            });
        }
    },

    computed: {
        passwordMismatch() {
            if (this.form.password !== this.form.confirm_password && this.form.confirm_password !== "") {
                return "The passwords do not match. Please try again"
            }
            return false;
        }
    },
};
</script>
