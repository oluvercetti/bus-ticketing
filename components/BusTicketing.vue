<template>
    <div>
        <b-row class="align-items-center mx-3 my-3" align-h="between">
            <b-col md="6" sm="12">
                <b-form @submit.prevent="handleFetchSingleRoute()" @input="resetValues" autocomplete=false>
                    <b-form-group label="Pickup:" label-for="pickup">
                        <b-form-select v-model="pickup" :options="computedPickupLocations" id="pickup">
                            <template #first>
                                <b-form-select-option value="" disabled>-- Please select a pickup location
                                    --</b-form-select-option>
                            </template>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group label="Destination:" label-for="destination">
                        <b-form-select v-model="destination" :options="computedDestinationLocations" id="destination"
                            :disabled="!pickup">
                            <template #first>
                                <b-form-select-option value="" disabled>-- Please select your destination
                                    --</b-form-select-option>
                            </template>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group label="Seats:" label-for="seats">
                        <b-form-select v-model="ticketCount" :options="seatCount">
                        </b-form-select>
                    </b-form-group>
                    <div v-if="isLoading">
                        <b-button variant="primary" class="d-flex align-items-center" size="lg" disabled>
                            <span class="mr-2">Loading...</span>
                            <b-spinner style="width: 1.5rem; height: 1.5rem;"></b-spinner>
                        </b-button>
                    </div>
                    <div v-else>
                        <b-button type="submit" variant="primary" size="lg" :disabled="searchDisabled">Search</b-button>
                    </div>
                </b-form>
            </b-col>
            <b-col md="6" sm="12" v-if="routeDetails">
                <b-card bg-variant="dark">
                    <b-card-title>Trip Details</b-card-title>
                    <b-card-text>{{ pickup }} to {{ destination }}</b-card-text>
                    <b-card-text>Distance: {{ routeDetails.distance | format_number }} miles</b-card-text>
                    <b-card-text>Trip Time: {{ routeDetails.time | format_number }} minutes</b-card-text>
                    <b-card-text>Price: {{ routeDetails.price | format_amount }}</b-card-text>
                    <b-card-text>Seats: {{ ticketCount }}</b-card-text>
                    <b-card-text>Total Amount: <h3><b>{{ totalAmount | format_amount }}</b></h3></b-card-text>
                    <div class="text-center mt-4">
                        <b-button variant="primary" size="lg" @click="showBookTicketModal = !showBookTicketModal">Book
                            Ticket</b-button>
                    </div>
                </b-card>
            </b-col>
        </b-row>
        <b-modal v-model="showBookTicketModal" hide-footer title="Add Route">
            <b-form @submit.prevent="handleCreateTicket()">
                <b-form-group label="Pickup" label-for="pickup">
                    <b-form-select v-model="pickup" :options="computedPickupLocations" id="pickup" required disabled />
                </b-form-group>
                <b-form-group label="Destination" label-for="destination">
                    <b-form-select v-model="destination" :options="computedDestinationLocations" id="destination" required
                        disabled />
                </b-form-group>
                <b-form-group label="Customer Email" label-for="custemail">
                    <b-form-input id="custemail" type="email" v-model="ticketInfo.custEmail" required
                        placeholder="Kindly provide your email address"></b-form-input>
                </b-form-group>
                <b-form-group>
                    <b-card-text>Total Amount: <h3><b>{{ totalAmount | format_amount }}</b></h3></b-card-text>
                </b-form-group>
                <b-form-group>
                    <b-form-rating id="rating-inline" variant="warning" inline v-model="ticketInfo.review"></b-form-rating>
                </b-form-group>
                <b-form-group>
                    <b-button type="submit" variant="primary" class="mr-3">Book Ticket</b-button>
                    <b-button type="button" @click="showBookTicketModal = !showBookTicketModal">Cancel</b-button>
                </b-form-group>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {

    props: {
        locations: {
            type: Array,
            default: () => []
        },
    },

    data() {
        return {
            pickup: "",
            destination: "",
            ticketCount: 1,
            routeDetails: null,
            ticketInfo: {
                custEmail: null,
                totalAmount: null,
                review: 0,
            },
            showBookTicketModal: false,
            isLoading: false,
            maxRating: 5,
            tempRating: 0,
        }
    },

    computed: {
        searchDisabled() {
            return this.pickup === "" || this.destination === ""
        },

        seatCount() {
            return Array.from({ length: 13 }, (_, index) => index + 1)
        },

        computedPickupLocations() {
            return this.locations.map((data) => {
                return {
                    value: data.location, text: data.location
                }
            })
        },

        computedDestinationLocations() {
            return this.locations.map((data) => {
                return {
                    value: data.location, text: data.location, disabled: this.pickup === data.location
                }
            })
        },

        totalAmount() {
            return this.routeDetails?.price * this.ticketCount
        }

    },

    methods: {

        handleFetchSingleRoute() {
            const payload = {
                pickup: this.pickup,
                destination: this.destination
            }
            this.isLoading = true;
            return this.$store.dispatch("fetchSingleRoute", payload).then((response) => {
                this.routeDetails = response.data;
                this.isLoading = false;
            }).catch((error) => {
                if (error?.response?.status === 404) {
                    this.$bvToast.toast("There are no available trips on this route, Try again later.", {
                        title: 'Error',
                        variant: 'danger',
                        delay: 300
                    })
                } else {
                    this.$bvToast.toast(error?.response?.data?.message, {
                        title: 'Error',
                        variant: 'danger',
                        delay: 300
                    })
                }


                this.isLoading = false;
            });
        },

        handleCreateTicket() {
            const payload = {
                cust_email: this.ticketInfo.custEmail,
                pickup: this.pickup,
                destination: this.destination,
                total_amount: this.totalAmount,
                seats: this.ticketCount,
                stars: this.ticketInfo.review
            }

            this.$store.dispatch("createTicket", payload).then((response) => {
                this.$bvToast.toast("Ticket created successfully", {
                    title: 'Success',
                    variant: 'success',
                    delay: 300
                })
                this.showBookTicketModal = false
                this.resetValues();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            });
        },

        resetValues() {
            this.routeDetails = null
        },

        hoverRating(rating) {
            this.tempRating = rating;
        },

        setRating(rating) {
            this.ticketInfo.review = rating;
        },

        resetTempRating() {
            this.tempRating = this.ticketInfo.review;
        }
    },
}
</script>

<style scoped>

</style>