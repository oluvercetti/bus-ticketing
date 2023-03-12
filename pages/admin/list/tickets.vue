<template>
    <div class="mt-3">
        <h3>{{ totalRows }} {{ totalRows > 1 ? "records" : "record" }}</h3>
        <b-table
            ref="ticket"
            :items="ticketList"
            :fields="fields"
            :busy="isLoading"
            class="mt-4"
            striped
            hover
            outlined
            :per-page="perPage"
            :current-page="currentPage"
        >
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
                <b-form-rating id="rating-inline" v-model="review.value" variant="warning" inline readonly />
            </template>
            <template #cell(status)="active">
                <p>{{ active.value ? "Paid" : "Pending" }}</p>
            </template>
            <template #cell(actions)="row">
                <div class="d-flex justify-content-around">
                    <b-button variant="info" @click="handleSelectedTicket(row.item)">
                        Update Status
                    </b-button>
                </div>
            </template>
            <template #table-busy>
                <div class="text-center text-info my-2">
                    <b-spinner class="align-middle" />
                    <strong>Loading...</strong>
                </div>
            </template>
        </b-table>
        <b-pagination
            v-if="totalRows > perPage"
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            first-text="First"
            prev-text="Prev"
            next-text="Next"
            last-text="Last"
            size="lg"
            align="center"
        />

        <b-modal v-model="showUpdateTicketModal" hide-footer title="Update Ticket">
            <b-form @submit.prevent="handleUpdateTicket(selectedTicket)">
                <b-form-group label="Pickup" label-for="pickup">
                    <p>{{ selectedTicket.pickup }}</p>
                </b-form-group>
                <b-form-group label="Destination" label-for="destination">
                    <p>{{ selectedTicket.destination }}</p>
                </b-form-group>
                <b-form-group label="Customer Email" label-for="email">
                    <h3>{{ selectedTicket.custEmail }}</h3>
                </b-form-group>
                <b-form-group label="Number of seats" label-for="email">
                    <h3>{{ selectedTicket.seats }}</h3>
                </b-form-group>
                <b-form-group label="Total Amount" label-for="email">
                    <h3>{{ selectedTicket.total_amount | format_amount }}</h3>
                </b-form-group>
                <b-form-group label="Status" label-for="status">
                    <b-form-select id="status" v-model="selectedTicket.active">
                        <b-form-select-option value="true">
                            Confirm
                        </b-form-select-option>
                        <b-form-select-option value="false">
                            Pending
                        </b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary" disabled>
                    <span class="mr-2">Saving...</span>
                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                </b-button>
                <b-button v-else type="submit" variant="primary" class="mr-3">
                    Update Ticket
                </b-button>
                <b-button type="button" @click="showUpdateTicketModal = !showUpdateTicketModal">
                    Cancel
                </b-button>
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
                { key: "ticket_id", label: "Ticket ID", sortable: true },
                { key: "cust_email", label: "Customer Email", sortable: true },
                { key: "pickup", label: "Pickup", sortable: true },
                { key: "destination", label: "Destination", sortable: true },
                { key: "seats", label: "Seats", sortable: true },
                { key: "date", label: "Date Booked", sortable: true },
                { key: "total_amount", label: "Total Amount", sortable: true },
                { key: "stars", label: "Review" },
                { key: "status", label: "Status" },
                "Actions",
            ],
            newTicket: {
                pickup: "",
                destination: null,
                distance: null,
                time: null,
                price: null,
                custEmail: null,
            },
            selectedTicket: {
                ticketId: null,
                custEmail: null,
                status: null,
            },
            addModalVisible: false,
            showUpdateTicketModal: false,
            isLoading: false,
            perPage: 8,
            currentPage: 1,
            sortBy: null,
            sortDesc: false,
        };
    },

    fetch() {
        this.handelFetchTicketList();
    },

    fetchOnServer: false,

    computed: {
        totalRows() {
            return this.ticketList?.length;
        },
    },

    methods: {

        handelFetchTicketList() {
            this.isLoading = true;
            return this.$store.dispatch("fetchTicketList").then((response) => {
                this.isLoading = false;
                this.ticketList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        handleSelectedTicket(data) {
            this.selectedTicket.pickup = data.pickup;
            this.selectedTicket.destination = data.destination;
            this.selectedTicket.custEmail = data.cust_email;
            this.selectedTicket.seats = data.seats;
            this.selectedTicket.total_amount = data.total_amount;
            this.selectedTicket.active = data.status;
            this.selectedTicket.id = data.ticket_id;
            this.showUpdateTicketModal = true;
        },

        handleUpdateTicket(data) {
            const id = data.id;
            const payload = {
                status: this.selectedTicket.active,
            };
            this.isLoading = true;
            return this.$store.dispatch("updateTicket", { id, payload }).then((response) => {
                this.$bvToast.toast("Updated Successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showUpdateTicketModal = false;
                this.isLoading = false;
                this.handelFetchTicketList();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>