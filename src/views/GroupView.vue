<script lang="ts">
import { mapStores } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import type { Group } from '@/interfaces/Group'
import groupServices from '@/api/groupServices'

interface GroupState {
  groups: Group[]
  openCreateGroup: boolean
  groupToCreate: Group
  openEditGroup: boolean
  GroupToEdit: Group
  openConfirmDeleteGroup: boolean
  groupIdToDelete: Group['id']
}

const emptyGroup: Group = {
  lotId: 0,
  name: ''
}

export default {
  computed: {
    ...mapStores(useAuthStore)
  },
  data(): GroupState {
    return {
      groups: [],
      openCreateGroup: false,
      groupToCreate: { ...emptyGroup, lotId: Number(this.$route.params.lotId as string) },
      openEditGroup: false,
      GroupToEdit: { ...emptyGroup, lotId: Number(this.$route.params.lotId as string) },
      openConfirmDeleteGroup: false,
      groupIdToDelete: undefined
    }
  },
  methods: {
    async onCreateGroup() {
      const lotId = Number(this.$route.params.lotId as string)
      const created = await groupServices.createGroup({
        ...this.$data.groupToCreate,
        lotId: lotId
      })
      if (created) {
        this.$data.groupToCreate = { ...emptyGroup }
        this.$data.groups = await groupServices.getGroupLots(lotId.toString())
      } else {
        alert('Error creating lot')
      }
      this.$data.openCreateGroup = false
    },

    onOpenRemoveGroup(group: Group) {
      this.$data.groupIdToDelete = group.id
      this.$data.openConfirmDeleteGroup = true
    },
    async onRemoveGroup(groupId: number) {
      this.openConfirmDeleteGroup = false
      const deleted = await groupServices.removeGroup(groupId)
      if (deleted) {
        // remove farm from list
        this.$data.groups = this.$data.groups.filter((group) => group.id !== groupId)
      } else {
        alert('Error deleting group')
      }
    },
    onClickEdit(group: Group) {
      this.$data.GroupToEdit = { ...group }
      this.$data.openEditGroup = true
    },
    async onEditGroup() {
      const updated = await groupServices.editGroup(this.$data.GroupToEdit)
      if (updated) {
        // update in memory farm
        this.$data.groups = this.$data.groups.map((group) => {
          if (group.id === this.$data.GroupToEdit.id) {
            group = { ...this.$data.GroupToEdit }
          }
          return group
        })
        // if user changed its email, let's log out

        this.$data.GroupToEdit = emptyGroup
      } else {
        alert('Error updating group')
      }
      this.$data.openEditGroup = false
    }
  },

  async mounted() {
    this.$data.groups = await groupServices.getGroupLots(this.$route.params.lotId as string)
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
          @click="openCreateGroup = true"
          icon="mdi-plus-circle-outline"
          color="green-lighten-1"
        ></v-btn>

        <v-dialog v-model="openCreateGroup" width="auto" transition="dialog-bottom-transition">
          <v-card max-width="800" prepend-icon="mdi-plus" :title="`Create new Group`">
            <v-card-text>
              <v-text-field
                v-model="groupToCreate.name"
                label="Name"
                type="text"
                required
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-btn class="ms-auto" text="Close" @click="openCreateGroup = false"></v-btn>

              <v-btn class="ms-auto" text="Save" @click="onCreateGroup()"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>

    <v-table>
      <thead>
        <tr>
          <th class="text-left">Id</th>
          <th class="text-left">Lot</th>
          <th class="text-left">Name</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in groups" :key="group.id">
          <td>{{ group.id }}</td>
          <td>{{ group.lot?.name }}</td>
          <td>{{ group.name }}</td>

          <td class="ga-3 d-flex">
            <!-- Edit -->
            <v-btn icon="mdi-file-edit-outline" @click="onClickEdit(group)"></v-btn>

            <v-dialog v-model="openEditGroup" width="auto" transition="dialog-bottom-transition">
              <v-card
                max-width="800"
                prepend-icon="mdi-file-edit-outline"
                :title="`Editing ${GroupToEdit?.name}`"
              >
                <v-card-text>
                  <v-text-field
                    v-model="GroupToEdit.name"
                    label="Name"
                    type="text"
                    required
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn class="ms-auto" text="Close" @click="openEditGroup = false"></v-btn>

                  <v-btn class="ms-auto" text="Save" @click="onEditGroup()"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Delete -->

            <v-btn
              @click="openConfirmDeleteGroup = true"
              icon="mdi-trash-can-outline"
              color="red-lighten-1"
            ></v-btn>

            <v-dialog
              v-model="openConfirmDeleteGroup"
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
                    @click="openConfirmDeleteGroup = false"
                  ></v-btn>

                  <v-btn
                    class="ms-auto"
                    text="Delete"
                    @click="onRemoveGroup(group.id || 0)"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </td>
        </tr>
      </tbody>
    </v-table>
  </main>
</template>
