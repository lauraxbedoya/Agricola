<script lang="ts">
import { mapStores } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/interfaces/User'
import usersServices from '@/api/usersServices'
import { storage, storageKeys } from '@/config/localStorage'

interface AdminUsersState {
  users: User[]
  openConfirmDeleteUser: boolean
  openEditUser: boolean
  userToEdit: User
}

const emptyUser: User = {
  name: '',
  email: ''
}

export default {
  computed: {
    ...mapStores(useAuthStore)
  },
  data(): AdminUsersState {
    return {
      users: [],
      openConfirmDeleteUser: false,
      openEditUser: false,
      userToEdit: emptyUser
    }
  },
  methods: {
    async onRemoveUser(userId: number) {
      this.openConfirmDeleteUser = false
      const deleted = await usersServices.removeFarm(userId)
      if (deleted) {
        // remove user from list
        this.$data.users = this.$data.users.filter((user) => user.id !== userId)
      } else {
        alert('Error deleting user')
      }
    },

    onClickEdit(user: User) {
      this.$data.userToEdit = { ...user }
      this.$data.openEditUser = true
    },

    async onEditUser() {
      const updated = await usersServices.editFarm(this.$data.userToEdit)

      if (updated) {
        // update in memory user
        this.$data.users = this.$data.users.map((user) => {
          if (user.id === this.$data.userToEdit.id) {
            user = { ...this.$data.userToEdit }
          }

          return user
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

        this.$data.userToEdit = emptyUser
      } else {
        alert('Error updating user')
      }

      this.$data.openEditUser = false
    }
  },

  async mounted() {
    this.$data.users = await usersServices.getAllUsers()
  }
}
</script>

<template>
  <main>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Id</th>
          <th class="text-left">Name</th>
          <th class="text-left">Email</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>

          <td class="ga-3 d-flex">
            <!-- Edit -->
            <v-btn icon="mdi-file-edit-outline" @click="onClickEdit(user)"></v-btn>

            <v-dialog v-model="openEditUser" width="auto" transition="dialog-bottom-transition">
              <v-card
                max-width="800"
                prepend-icon="mdi-file-edit-outline"
                :title="`Editing ${userToEdit?.name}`"
              >
                <v-card-text>
                  <v-text-field
                    v-model="userToEdit.name"
                    label="Name"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="userToEdit.email"
                    label="Email"
                    type="email"
                    required
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn class="ms-auto" text="Close" @click="openEditUser = false"></v-btn>

                  <v-btn class="ms-auto" text="Save" @click="onEditUser()"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Delete -->

            <v-btn
              @click="openConfirmDeleteUser = true"
              icon="mdi-trash-can-outline"
              color="red-lighten-1"
            ></v-btn>

            <v-dialog
              v-model="openConfirmDeleteUser"
              width="auto"
              transition="dialog-bottom-transition"
            >
              <v-card
                max-width="400"
                prepend-icon="mdi-trash-can-outline"
                text="This user will be deleted."
                title="Warning"
              >
                <v-card-actions>
                  <v-btn
                    class="ms-auto"
                    text="Close"
                    @click="openConfirmDeleteUser = false"
                  ></v-btn>

                  <v-btn class="ms-auto" text="Delete" @click="onRemoveUser(user.id || 0)"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </td>
        </tr>
      </tbody>
    </v-table>
  </main>
</template>
