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
            <b-col md="6" sm="12" v-if="routeExists">
                <b-card header="Trip Details" header-tag="header" :title="`${pickup} to ${destination}`">
                    <b-card-text>
                        Some quick example text to build on the card title and make up the bulk of the card's content.
                    </b-card-text>

                    <b-button variant="primary">Book Trip</b-button>
                </b-card>
            </b-col>
        </b-row>
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
            return this.locations.map((location) => {
                return {
                    value: location.shortcode, text: location.location
                }
            })
        },

        computedDestinationLocations() {
            return this.locations.map((location) => {
                return {
                    value: location.shortcode, text: location.location, disabled: this.pickup === location.shortcode
                }
            })
        },

        routeExists() {

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
        }
    },
}
</script>

<style scoped></style>