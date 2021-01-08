<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="4"
      >
        <v-card
          class="v-card-profile"
        >
          <v-card-text class="text-center">
            <p class="font-weight-light grey--text" />
            <v-file-input
              ref="DSN_file"
              label="Fichier DSN(zip ou .edi)"
              counter
              multiple
              show-size
              truncate-length="20"
              @change="handleFileUploads()"
            />
          </v-card-text>
          <v-col
            cols="12"
            class="text-right"
          >
            <v-btn
              color="success"
              rounded
              class="mr-0 text-right"
            >
              Télécharger
            </v-btn>
          </v-col>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Edit Profile
            </div>

            <div class="subtitle-1 font-weight-light">
              Complete your profile
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="Company (disabled)"
                    disabled
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    class="purple-input"
                    label="User Name"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="Email Address"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    label="First Name"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    label="Last Name"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Adress"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="City"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="Country"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    class="purple-input"
                    label="Postal Code"
                    type="number"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    class="purple-input"
                    label="About Me"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="success"
                    class="mr-0"
                  >
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { getAPI } from './axios-api'
  export default {
    data: () => ({
      files: '',
    }),

    methods: {
      handleFileUpload () {
        this.files = this.$refs.DSN_file.files
      },

      sendDsnFile () {
        const data = new FormData()
        for (var i = 0; i < this.files.length; i++) {
          const file = this.files[i]
          data.append('files[' + i + ']', file)
        }
        getAPI.post('/multiple-files',
                    data,
                    {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    },
        ).then(function () {
          console.log('SUCCESS!!')
        })
          .catch(function () {
            console.log('FAILURE!!')
          })
      },
    },
  }
</script>
