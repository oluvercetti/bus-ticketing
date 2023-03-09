<template>
    <div class="mt-3">
        <b-button variant="primary" @click="showAddLocationModal = !showAddLocationModal">Add Location</b-button>
        <b-table :items="computedLocationList" :fields="fields" :busy="isLoading" ref="location" class="mt-4" striped hover outlined>
            <template #cell(actions)="row">
                <div class="d-flex justify-content-around">
                    <b-button @click="handleSelectedLocation(row.item)" variant="primary">Edit</b-button>
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

        <b-modal v-model="showAddLocationModal" hide-footer title="Add Location">
            <b-form @submit.prevent="handleCreateNewLocation()">
                <b-form-group label="Name" label-for="name">
                    <b-form-input id="name" v-model="newLocation.location" required></b-form-input>
                </b-form-group>
                <b-form-group label="Shortcode" label-for="shortcode">
                    <b-form-input id="shortcode" v-model="newLocation.shortcode" minlength="3" required></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary" class="mr-3">Add Location</b-button>
                <b-button type="button" @click="showAddLocationModal = !showAddLocationModal">Cancel</b-button>
            </b-form>
        </b-modal>

        <b-modal v-model="showUpdateLocationModal" hide-footer title="Edit Location">
            <b-form @submit.prevent="updateLocation(selectedLocation)">
                <b-form-group label="Name" label-for="edit-name">
                    <b-form-input id="edit-name" v-model="selectedLocation.location" required></b-form-input>
                </b-form-group>
                <b-form-group label="Shortcode" label-for="edit-shortcode">
                    <b-form-input id="edit-shortcode" v-model="selectedLocation.shortcode" minlength="3" required></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary" class="mr-3">Save Location</b-button>
                <b-button type="button" @click="showUpdateLocationModal = !showUpdateLocationModal">Cancel</b-button>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {

    data() {
        return {
            locationList: [],
            fields: [
                { key: 'location', label: 'Location Name', sortable: true },
                { key: 'shortcode', label: 'Shortcode', sortable: true },
                { key: 'createdAt', label: 'Created', sortable: true },
                { key: 'updatedAt', label: 'Updated', sortable: true },
                'Actions',
            ],
            newLocation: {
                location: "",
                shortcode: "",
            },
            selectedLocation: {
                id: "",
                location: "",
                shortcode: "",
            },
            showAddLocationModal: false,
            showUpdateLocationModal: false,
            isLoading: false,
        }
    },

    fetch() {
        this.handleGetLocationList();
    },

    fetchOnServer: false,
    computed: {
        computedLocationList() {
            return this.locationList.map(data => {
                return {
                    id: data._id,
                    location: data.location,
                    shortcode: data.shortcode,
                    createdAt: this.$moment(data.createdAt).format('DD-MM-YYYY, HH:mm:ss'),
                    updatedAt: this.$moment(data.updatedAt).format('DD-MM-YYYY, HH:mm:ss'),
                }
            }) 
        }
    },
    methods: {
        handleGetLocationList() {
            this.isLoading = true;
            return this.$store.dispatch("getLocationList").then((response) => {
                this.isLoading = false;
                this.locationList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            });
        },

        handleCreateNewLocation() {
            const payload = {
                location: this.newLocation.location,
                shortcode: this.newLocation.shortcode?.toUpperCase()
            }
            return this.$store.dispatch("createNewLocation", payload).then(() => {
                this.$bvToast.toast("Location added successfully", {
                    title: 'Success',
                    variant: 'success',
                    delay: 300
                })
                this.showAddLocationModal = false
                this.handleGetLocationList();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            });
        },

        handleSelectedLocation(data) {
            this.selectedLocation.location = data.location;
            this.selectedLocation.shortcode = data.shortcode;
            this.selectedLocation.id = data.id;
            this.showUpdateLocationModal = true;
        },

        updateLocation(data){
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
                this.showUpdateLocationModal = false
                this.handleGetLocationList();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data.message, {
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
                if(value) {
                    this.$store.dispatch("deleteLocation", data.id).then(() => {
                    this.$bvToast.toast("Location deleted successfully", {
                    title: 'Success',
                    variant: 'success',
                    delay: 300
                })
                    this.handleGetLocationList();
                });
                }
            }).catch(err => {
                this.$bvToast.toast(err?.response?.data?.message, {
                    title: 'Error',
                    variant: 'danger',
                    delay: 300
                })
            })
        },

        resetLocationValues () {
            this.newLocation.location = ""
            this.newLocation.shortcode = ""
        }
    }
}
</script>

<style lang="scss" scoped></style>