<template>
    <div class="mt-3">
        <b-table :items="ticketList" :fields="fields" :busy="isLoading" ref="ticket" class="mt-4" striped hover outlined>
            
            <template #cell(cust_email)="custemail">
               <p><strong>{{ custemail.value }}</strong></p>
            </template>
            <template #cell(distance)="distance">
                <!-- `distance.value` is the value after formatted by the Formatter -->
               <p>{{ distance.value | format_number }}</p>
            </template>
            <template #cell(total_amount)="price">
               <p>{{ price.value | format_amount }}</p>
            </template>
            <template #cell(stars)="review">
                <b-form-rating id="rating-inline" variant="warning" inline v-model="review.value" readonly></b-form-rating>
            </template>
            <template #cell(status)="active">
               <p>{{ active.value ? "Paid" : "Pending"}}</p>
            </template>
            <template #cell(actions)="row">
                <div class="d-flex justify-content-around">
                    <b-button @click="handleSelectedTicket(row.item)" variant="info">Update Status</b-button>
                </div>
            </template>
            <template #table-busy>
                <div class="text-center text-info my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>
        </b-table>

        <b-modal v-model="showUpdateTicketModal" hide-footer title="Edit Route">
            <b-form @submit.prevent="updateLocation(selectedTicket)">
                <b-form-group label="Pickup" label-for="pickup">
                    <p>{{ selectedTicket.pickup }}</p>
                </b-form-group>
                <b-form-group label="Destination" label-for="destination">
                        <p>{{ selectedTicket.destination }}</p>
                </b-form-group>
                <b-form-group label="Customer Email" label-for="email">
                        <p>{{ selectedTicket.custEmail }}</p>
                </b-form-group>
                <b-form-group label="Customer Email" label-for="email">
                        <p>{{ selectedTicket.seats }}</p>
                </b-form-group>
                <b-form-group label="Customer Email" label-for="email">
                        <p>{{ selectedTicket.total_amount | format_amount }}</p>
                </b-form-group>
                <b-form-group label="Status" label-for="status">
                    <b-form-select v-model="selectedTicket.active" id="status">
                        <b-form-select-option value="true">Confirm</b-form-select-option>
                        <b-form-select-option value="false">Pending</b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-button type="submit" variant="primary" class="mr-3">Save Route</b-button>
                <b-button type="button" @click="showUpdateTicketModal = !showUpdateTicketModal">Cancel</b-button>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {

    data() {
        return {
            ticketList: [],
            fields: [
                { key: 'ticket_id', label: 'Ticket ID', sortable: true },
                { key: 'cust_email', label: 'Customer Email', sortable: true },
                { key: 'pickup', label: 'Pickup', sortable: true },
                { key: 'destination', label: 'Destination', sortable: true },
                { key: 'seats', label: 'Seats', sortable: true },
                { key: 'date', label: 'Date Booked', sortable: true },
                { key: 'total_amount', label: 'Total Amount', sortable: true },
                { key: 'stars', label: 'Review'},
                { key: 'status', label: 'Status'},
                'Actions',
            ],
            newTicket: {
                pickup: '',
                destination: null,
                distance: null,
                time: null,
                price: null,
                custEmail: null,
            },
            selectedTicket: {
                ticketId: null,
                custEmail: null,
                status: null
            },
            addModalVisible: false,
            showUpdateTicketModal: false,
            isLoading: false,
        }
    },

    fetch () {
        this.handelFetchTicketList();
    },

    fetchOnServer: false,

    methods: {
        
        handelFetchTicketList(){
            this.isLoading = true;
            return this.$store.dispatch("fetchTicketList").then((response) => {
                this.isLoading = false;
                this.ticketList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            });
        },

        handleSelectedTicket(data) {
            this.selectedTicket.pickup = data.pickup;
            this.selectedTicket.destination = data.destination;
            this.selectedTicket.custEmail = data.cust_email;
            this.selectedTicket.seats = data.seats;
            this.selectedTicket.total_amount = data.total_amount;
            this.selectedTicket.active = data.active;
            this.selectedTicket.id = data._id;
            this.showUpdateTicketModal = true;
        },

        handleConfirmTicket() {

        },
    }
}
</script>

<style lang="scss" scoped>

</style>