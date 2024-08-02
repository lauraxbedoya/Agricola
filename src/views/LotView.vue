<script lang="ts">
import { mapStores } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import type { Lot } from '@/interfaces/Lot'
import lotsServices from '@/api/lotsServices'

interface LotState {
  lots: Lot[]
  openCreateLot: boolean
  lotToCreate: Lot
  openEditLot: boolean
  lotToEdit: Lot
  openConfirmDeleteLot: boolean
  lotIdToDelete: Lot['id']
}

const emptyLot: Lot = {
  farmId: 0,
  name: '',
  trees: 0,
  stage: ''
}

export default {
  computed: {
    ...mapStores(useAuthStore)
  },
  data(): LotState {
    return {
      lots: [],
      openCreateLot: false,
      lotToCreate: { ...emptyLot, farmId: Number(this.$route.params.farmId as string) },
      openEditLot: false,
      lotToEdit: { ...emptyLot, farmId: Number(this.$route.params.farmId as string) },
      openConfirmDeleteLot: false,
      lotIdToDelete: undefined
    }
  },
  methods: {
    async onCreateLot() {
      // obtain the ID of the selected farm through Params to show its lots
      const farmId = Number(this.$route.params.farmId as string)
      const created = await lotsServices.createLot({
        ...this.$data.lotToCreate,
        farmId
      })

      if (created) {
        this.$data.lotToCreate = { ...emptyLot }
        this.$data.lots = await lotsServices.getLotsFarm(farmId.toString())
      } else {
        alert('Error creating lot')
      }
      this.$data.openCreateLot = false
    },

    onClickEdit(lot: Lot) {
      this.$data.lotToEdit = { ...lot }
      this.$data.openEditLot = true
    },
    async onEditLot() {
      const updated = await lotsServices.editLot(this.$data.lotToEdit)
      if (updated) {
        // update in memory lot
        this.$data.lots = this.$data.lots.map((lot) => {
          if (lot.id === this.$data.lotToEdit.id) {
            lot = { ...this.$data.lotToEdit }
          }
          return lot
        })
        // if user changed its email, let's log out

        this.$data.lotToEdit = emptyLot
      } else {
        alert('Error updating lot')
      }
      this.$data.openEditLot = false
    },

    onOpenRemoveLot(lot: Lot) {
      this.$data.lotIdToDelete = lot.id
      this.$data.openConfirmDeleteLot = true
    },
    async onRemoveLot(lotId: number) {
      this.openConfirmDeleteLot = false
      const deleted = await lotsServices.removeLot(lotId)

      if (deleted) {
        // remove lot from list
        this.$data.lots = this.$data.lots.filter((lot) => lot.id !== lotId)
      } else {
        alert('Error deleting lot')
      }
    },

    goToGroups(lot: Lot) {
      this.$router.push(`/groups/${lot.id}`)
    }
  },

  async mounted() {
    this.$data.lots = await lotsServices.getLotsFarm(this.$route.params.farmId as string)
  }
}
</script>

<template>
  <main>
    <div class="d-flex justify-center align-center py-5 flex-column">
      <h3 class="my-4">LOTS</h3>
      <div>
        <!-- Create Lots -->
        <v-btn
          @click="openCreateLot = true"
          icon="mdi-plus-circle-outline"
          color="green-lighten-1"
        ></v-btn>

        <v-dialog v-model="openCreateLot" width="auto" transition="dialog-bottom-transition">
          <v-card max-width="800" prepend-icon="mdi-plus" :title="`Create new Lot `">
            <v-card-text>
              <v-text-field
                v-model="lotToCreate.name"
                label="Name"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="lotToCreate.trees"
                label="Trees"
                type="number"
                required
              ></v-text-field>
              <v-text-field
                v-model="lotToCreate.stage"
                label="Stage"
                type="text"
                required
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-btn class="ms-auto" text="Close" @click="openCreateLot = false"></v-btn>

              <v-btn class="ms-auto" text="Save" @click="onCreateLot()"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>

    <v-table>
      <thead>
        <tr>
          <th class="text-left">Id</th>
          <th class="text-left">Farm</th>
          <th class="text-left">Name</th>
          <th class="text-left">Trees</th>
          <th class="text-left">Stage</th>
          <th class="text-left">Groups</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lot in lots" :key="lot.id">
          <td>{{ lot.id }}</td>
          <td>{{ lot.farm?.name }}</td>
          <td>{{ lot.name }}</td>
          <td>{{ lot.trees }}</td>
          <td>{{ lot.stage }}</td>
          <td>
            <v-btn icon="mdi-eye-outline" @click="goToGroups(lot)"></v-btn>
          </td>

          <td class="ga-3 d-flex">
            <!-- Edit -->
            <v-btn icon="mdi-file-edit-outline" @click="onClickEdit(lot)"></v-btn>

            <v-dialog v-model="openEditLot" width="auto" transition="dialog-bottom-transition">
              <v-card
                max-width="800"
                prepend-icon="mdi-file-edit-outline"
                :title="`Editing ${lotToEdit?.name}`"
              >
                <v-card-text>
                  <v-text-field
                    v-model="lotToEdit.name"
                    label="Name"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="lotToEdit.trees"
                    label="Trees"
                    type="number"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="lotToEdit.stage"
                    label="Stage"
                    type="text"
                    required
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn class="ms-auto" text="Close" @click="openEditLot = false"></v-btn>

                  <v-btn class="ms-auto" text="Save" @click="onEditLot()"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Delete -->

            <v-btn
              @click="openConfirmDeleteLot = true"
              icon="mdi-trash-can-outline"
              color="red-lighten-1"
            ></v-btn>

            <v-dialog
              v-model="openConfirmDeleteLot"
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
                  <v-btn class="ms-auto" text="Close" @click="openConfirmDeleteLot = false"></v-btn>

                  <v-btn class="ms-auto" text="Delete" @click="onRemoveLot(lot.id || 0)"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </td>
        </tr>
      </tbody>
    </v-table>
  </main>
</template>
