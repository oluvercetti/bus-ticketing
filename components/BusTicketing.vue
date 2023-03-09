<template>
    <div>
        <b-row class="align-items-center mx-5" align-h="between">
            <b-col md="6" sm="12">
                <b-form @submit.prevent="getPrice" autocomplete=false>
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
                    <b-button v-if="isLoading" variant="primary" class="d-flex align-items-center" size="lg" disabled>
                        <span class="mr-2">Loading...</span>
                        <b-spinner style="width: 1.5rem; height: 1.5rem;"></b-spinner>
                    </b-button>
                    <b-button v-else type="button" variant="primary" size="lg" :disabled="searchDisabled">Search</b-button>
                </b-form>
            </b-col>
            <b-col md="6" sm="12" v-if="routeDetails">
                <b-card header="Trip Details" header-tag="header" :title="`${pickup} to ${destination}`">
                    <b-card-text>
                        Distance: {{ routeDetails.distance }} miles
                    </b-card-text>
                    <b-card-text>
                        Price per seat: {{ routeDetails.price | format_amount }} miles
                    </b-card-text>

                    <b-button variant="primary">Book Trip</b-button>
                </b-card>
            </b-col>
        </b-row>
        <b-modal v-model="showBookTicketModal" hide-footer title="Add Route">
            <b-form @submit.prevent="handleCreateRoute()">
                <b-form-group label="Pickup" label-for="pickup">
                    <b-form-select v-model="pickup" :options="computedPickupLocations" id="pickup" required disabled />
                </b-form-group>
                <b-form-group label="Destination" label-for="destination">
                    <b-form-select v-model="newRoute.destination" :options="computedDestinationLocations" id="destination" required disabled/>
                </b-form-group>
                <b-form-group label="Distance" label-for="distance">
                    <b-form-input id="distance" type="number" min="0" v-model="ticketInfo.distance" required
                        placeholder="Kindly input distance in miles"></b-form-input>
                </b-form-group>
                <b-form-group label="Time" label-for="time">
                    <b-form-input id="time" type="number" v-model="ticketInfo.time" required
                        placeholder="Please enter time in minutes"></b-form-input>
                </b-form-group>
                <b-form-group label="Price" label-for="price">
                    <b-form-input id="price" type="number" min="0" v-model="ticketInfo.price" required></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary" class="mr-3">Add Route</b-button>
                <b-button type="button" @click="showBookTicketModal = !showBookTicketModal">Cancel</b-button>
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
            routeDetails: {},
            ticketInfo: {
                custemail: null,
                seats: null,
                amount: null,
                total_amount: null,
                review: null,
            },
            showBookTicketModal: false,
            isLoading: false,
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

    },

    methods: {
        getPrice() {
            const payload = {
                pickup: this.pickup,
                destination: this.destination
            }
        },

        bookTicket() {
            const payload = {
                route
            }
        },
    
        handleFetchSingleRoute () {
            const payload = {
                pickup: this.pickup,
                destination: this.destination
            }

            return this.$store.dispatch("fetchSingleRoute", payload).then((response) => {
                this.routeDetails = response.data;
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            });
        }
    },
}
</script>

<style scoped></style>