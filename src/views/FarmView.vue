<script lang="ts">
import { mapStores } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { storage, storageKeys } from '@/config/localStorage'
import type { Farm } from '@/interfaces/Farm'
import farmsServices from '@/api/farmsServices'
import type { User } from '@/interfaces/User'

interface FarmState {
  farms: Farm[]
  openCreateFarm: boolean
  farmToCreate: Farm
  openEditFarm: boolean
  farmToEdit: Farm
  userToEdit: User
  openConfirmDeleteFarm: boolean
  farmIdToDelete: Farm['id']
}

const emptyFarm: Farm = {
  name: '',
  location: '',
  hectares: 0,
  description: ''
}

const emptyUser: User = {
  name: '',
  email: ''
}

export default {
  computed: {
    ...mapStores(useAuthStore)
  },
  data(): FarmState {
    return {
      farms: [],
      openCreateFarm: false,
      farmToCreate: { ...emptyFarm },
      openEditFarm: false,
      farmToEdit: { ...emptyFarm },
      openConfirmDeleteFarm: false,
      farmIdToDelete: undefined,
      userToEdit: { ...emptyUser }
    }
  },
  methods: {
    // create farm
    async onCreateFarm() {
      const created = await farmsServices.createFarm(this.$data.farmToCreate)
      if (created) {
        this.$data.farms = await farmsServices.getAllFarms()
        this.$data.farmToCreate = { ...emptyFarm }
      } else {
        alert('Error creating farm')
      }
      this.$data.openCreateFarm = false
    },

    // edit farm
    onClickEdit(farm: Farm) {
      this.$data.farmToEdit = { ...farm }
      this.$data.openEditFarm = true
    },
    async onEditFarm() {
      const updated = await farmsServices.editFarm(this.$data.farmToEdit)
      if (updated) {
        // update in memory farm
        this.$data.farms = this.$data.farms.map((farm) => {
          if (farm.id === this.$data.farmToEdit.id) {
            farm = { ...this.$data.farmToEdit }
          }
          return farm
        })
        // if user changed its email, let's log out
        if (
          this.authStore.user?.id === this.$data.userToEdit.id &&
          this.authStore.user?.email !== this.$data.userToEdit.email
        ) {
          storage.remove(storageKeys.JWT_TOKEN)
          this.authStore.resetStore()
          this.$router.push('/login')
        }
        this.$data.farmToEdit = emptyFarm
      } else {
        alert('Error updating farm')
      }
      this.$data.openEditFarm = false
    },

    // remove farm
    onOpenRemoveFarm(farm: Farm) {
      this.$data.farmIdToDelete = farm.id
      this.$data.openConfirmDeleteFarm = true
    },
    async onRemoveFarm() {
      this.openConfirmDeleteFarm = false
      const deleted = await farmsServices.removeFarm(this.$data.farmIdToDelete || 0)

      if (deleted) {
        // remove farm from list
        this.$data.farms = this.$data.farms.filter((farm) => farm.id !== this.$data.farmIdToDelete)
      } else {
        alert('Error deleting farm')
      }
    },

    // go to the lots of the selected farm
    goToLots(farm: Farm) {
      this.$router.push(`/lots/${farm.id}`)
    }
  },

  async mounted() {
    this.$data.farms = await farmsServices.getAllFarms()
  }
}
</script>

<template>
  <main>
    <div class="d-flex justify-center align-center py-5 flex-column">
      <h3 class="my-4">FARMS</h3>
      <div>
        <!-- Create Farm -->
        <v-btn
          @click="openCreateFarm = true"
          icon="mdi-plus-circle-outline"
          color="green-lighten-1"
        ></v-btn>

        <v-dialog v-model="openCreateFarm" width="auto" transition="dialog-bottom-transition">
          <v-card max-width="800" prepend-icon="mdi-plus" :title="`Create new Farm `">
            <v-card-text>
              <v-text-field
                v-model="farmToCreate.name"
                label="Name"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="farmToCreate.location"
                label="Location"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="farmToCreate.hectares"
                label="Hectares"
                type="number"
                required
              ></v-text-field>
              <v-text-field
                v-model="farmToCreate.description"
                label="Description"
                type="text"
                required
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-btn class="ms-auto" text="Close" @click="openCreateFarm = false"></v-btn>

              <v-btn class="ms-auto" text="Save" @click="onCreateFarm()"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>

    <v-table>
      <thead>
        <tr>
          <th class="text-left">Id</th>
          <th class="text-left">Name</th>
          <th class="text-left">Location</th>
          <th class="text-left">Hectares</th>
          <th class="text-left">Description</th>
          <th class="text-left">Lots</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="farm in farms" :key="farm.id">
          <td>{{ farm.id }}</td>
          <td>{{ farm.name }}</td>
          <td>{{ farm.location }}</td>
          <td>{{ farm.hectares }}</td>
          <td>{{ farm.description }}</td>
          <td>
            <v-btn icon="mdi-eye-outline" @click="goToLots(farm)"></v-btn>
          </td>

          <td class="ga-3 d-flex">
            <!-- Edit -->
            <v-btn icon="mdi-file-edit-outline" @click="onClickEdit(farm)"></v-btn>

            <v-dialog v-model="openEditFarm" width="auto" transition="dialog-bottom-transition">
              <v-card
                max-width="800"
                prepend-icon="mdi-file-edit-outline"
                :title="`Editing ${farmToEdit?.name}`"
              >
                <v-card-text>
                  <v-text-field
                    v-model="farmToEdit.name"
                    label="Name"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="farmToEdit.location"
                    label="Location"
                    type="location"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="farmToEdit.hectares"
                    label="Hectares"
                    type="hectares"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="farmToEdit.description"
                    label="Description"
                    type="description"
                    required
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn class="ms-auto" text="Close" @click="openEditFarm = false"></v-btn>

                  <v-btn class="ms-auto" text="Save" @click="onEditFarm()"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Delete -->

            <v-btn
              @click="onOpenRemoveFarm(farm)"
              icon="mdi-trash-can-outline"
              color="red-lighten-1"
            ></v-btn>

            <v-dialog
              v-model="openConfirmDeleteFarm"
              width="auto"
              transition="dialog-bottom-transition"
            >
              <v-card
                max-width="400"
                prepend-icon="mdi-trash-can-outline"
                text="This farm will be deleted."
                title="Warning"
              >
                <v-card-actions>
                  <v-btn
                    class="ms-auto"
                    text="Close"
                    @click="openConfirmDeleteFarm = false"
                  ></v-btn>

                  <v-btn class="ms-auto" text="Delete" @click="onRemoveFarm()"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </td>
        </tr>
      </tbody>
    </v-table>
  </main>
</template>
