<template>
    <div class="mt-3">
        <b-button variant="primary" @click="showAddRouteModal = !showAddRouteModal">Add Route</b-button>
        <b-table :items="routeList" :fields="fields" :busy="isLoading" ref="location" class="mt-4" striped hover>
            <template #cell(actions)="row">
                <div class="d-flex justify-content-around">
                    <b-button @click="handleSelectedRoute(row.item)" variant="primary">Edit</b-button>
                    <b-button @click="deleteLocation(row.item)" variant="danger">Delete</b-button>
                </div>
            </template>
            <template #table-busy>
                <div class="text-center text-info my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>
        </b-table>

        <b-modal v-model="showAddRouteModal" hide-footer title="Add Route">
            <b-form @submit.prevent="handleCreateRoute()">
                <b-form-group label="Name" label-for="name">
                    <b-form-input id="name" v-model="newLocation.location" required></b-form-input>
                </b-form-group>
                <b-form-group label="Shortcode" label-for="shortcode">
                    <b-form-input id="shortcode" v-model="newLocation.shortcode" minlength="3" required></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary">Add Location</b-button>
                <b-button type="button">Cancel</b-button>
            </b-form>
        </b-modal>

        <b-modal v-model="showUpdateRouteModal" hide-footer title="Edit Route">
            <b-form @submit.prevent="updateLocation(selectedLocation)">
                <b-form-group label="Name" label-for="edit-name">
                    <b-form-input id="edit-name" v-model="selectedLocation.location" required></b-form-input>
                </b-form-group>
                <b-form-group label="Shortcode" label-for="edit-shortcode">
                    <b-form-input id="edit-shortcode" v-model="selectedLocation.shortcode" minlength="3"
                        required></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary">Save Location</b-button>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {

    data() {
        return {
            routeList: [],
            fields: [
                { key: 'pickup', label: 'Pickup', sortable: true },
                { key: 'destination', label: 'Destination', sortable: true },
                { key: 'distance', label: 'Distance', sortable: true },
                { key: 'time', label: 'Trip Duration (mins)', sortable: true },
                { key: 'price', label: 'Price (Naira)', sortable: true },
                { key: 'active', label: 'Status', sortable: true },
                'Actions',
            ],
            newRoute: {
                pickup: null,
                destination: null,
                distance: null,
                time: null,
                price: null,
            },
            selectedLocation: {},
            showAddRouteModal: false,
            showUpdateRouteModal: false,
            isLoading: false,
        }
    },

    fetch() {
        this.handleFetchRouteList();
    },

    fetchOnServer: false,

    methods: {
        handleFetchRouteList() {
            this.isLoading = true;
            return this.$store.dispatch("fetchRouteList").then((response) => {
                this.isLoading = false;
                this.routeList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            });
        },

        handleCreateRoute() {
            const payload = {
                location: this.newLocation.location,
                shortcode: this.newLocation.shortcode?.toUpperCase()
            }
            return this.$store.dispatch("createRoute", payload).then(() => {
                this.$bvToast.toast("Route added successfully", {
                    title: 'Success',
                    variant: 'success',
                    delay: 300
                })
                this.showAddRouteModal = false
                this.handleFetchRouteList();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            });
        },

        handleSelectedRoute(data) {
            this.selectedLocation.location = data.location;
            this.selectedLocation.shortcode = data.shortcode;
            this.selectedLocation.id = data.id;
            this.showUpdateRouteModal = true;
        },

        updateLocation(data) {
            const id = data.id;
            const payload = {
                location: data.location,
                shortcode: data.shortcode?.toUpperCase()
            }
            return this.$store.dispatch("updateLocation", { id, payload }).then((response) => {
                this.$bvToast.toast("Location updated successfully", {
                    title: 'Success',
                    variant: 'success',
                    delay: 300
                })
                this.showUpdateRouteModal = false
                this.handleFetchRouteList();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            });
        },

        deleteLocation(data) {
            this.$bvModal.msgBoxConfirm(`Please confirm that you want to delete ${data.location}.`, {
                title: 'Delete Location',
                size: 'md',
                buttonSize: 'md',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            }).then((value) => {
                if (value) {
                    this.$store.dispatch("deleteLocation", data.id).then(() => {
                        this.$bvToast.toast("Location deleted successfully", {
                            title: 'Success',
                            variant: 'success',
                            delay: 300
                        })
                        this.handleFetchRouteList();
                    });
                }
            }).catch(err => {
                this.$bvToast.toast(err?.response?.data, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            })
        },

        resetLocationValues() {
            this.newLocation.location = ""
            this.newLocation.shortcode = ""
        }
    }
}
</script>

<style lang="scss" scoped></style>