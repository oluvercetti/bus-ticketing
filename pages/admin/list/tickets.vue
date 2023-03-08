<template>
    <div class="mt-3">
        <b-table :items="routes" :fields="fields" :busy="isLoading" class="mt-4" striped hover>
            <template #cell(actions)="row">
                <div class="d-flex justify-content-center">
                    <b-button @click="editRoute(row.item)" variant="primary">Edit</b-button>
                    <b-button @click="deleteRoute(row.item)" variant="danger">Delete</b-button>
                </div>
            </template>
            <template #table-busy>
                <div class="text-center text-info my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>
        </b-table>

        <b-modal v-model="addModalVisible" title="Add Route">
            <b-form @submit.prevent="addRoute">
                <b-form-group label="Name" label-for="name">
                    <b-form-input id="name" v-model="newRoute.name" required></b-form-input>
                </b-form-group>
                <b-form-group label="Distance" label-for="distance">
                    <b-form-input id="distance" type="number" v-model="newRoute.distance" required></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary">Add</b-button>
            </b-form>
        </b-modal>

        <b-modal v-model="editModalVisible" title="Edit Route">
            <b-form @submit.prevent="updateRoute">
                <b-form-group label="Name" label-for="edit-name">
                    <b-form-input id="edit-name" v-model="editRoute.name" required></b-form-input>
                </b-form-group>
                <b-form-group label="Distance" label-for="edit-distance">
                    <b-form-input id="edit-distance" type="number" v-model="editRoute.distance" required></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary">Save</b-button>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {

    data() {
        return {
            routes: [],
            fields: [
                { key: 'custemail', label: 'Customer Email', sortable: true },
                { key: 'pickup', label: 'Pickup', sortable: true },
                { key: 'destination', label: 'Destination', sortable: true },
                { key: 'distance', label: 'Distance', sortable: true },
                { key: 'time', label: 'Trip Time', sortable: true },
                { key: 'seats', label: 'Seats', sortable: true },
                { key: 'date', label: 'Date Booked', sortable: true },
                { key: 'amount', label: 'Total Amount Due (Naira)', sortable: true },
                { key: 'review', label: 'Review'},
                'Actions',
            ],
            newRoute: {
                pickup: '',
                destination: null,
                distance: null,
                time: null,
                price: null,
            },
            addModalVisible: false,
            editModalVisible: false,
            isLoading: false,
        }
    },
    methods: {
        addRoute() {
            this.routes.push({
                id: this.routes.length + 1,
                name: this.newRoute.name,
                distance: this.newRoute.distance,
            })
            this.newRoute.name = ''
            this.newRoute.distance = null
            this.addModalVisible = false
        },
        editRoute(route) {

        }
    }
}
</script>

<style lang="scss" scoped>

</style>