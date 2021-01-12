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
              label="Fichier DSN(zip ou .edi)"
              counter
              multiple
              show-size
              truncate-length="20"
              type="file"
              accept="*"
              @change="selectFiles"
            />
            <div v-if="progressInfos">
              <div
                v-for="(progressInfo, index) in progressInfos"
                :key="index"
                class="mb-2"
              >
                <v-progress-linear
                  v-model="progressInfo.percentage"
                  color="light-blue"
                  height="25"
                  reactive
                >
                  <strong>{{ progressInfo.percentage }} %</strong>
                </v-progress-linear>
              </div>
            </div>
          </v-card-text>
          <v-col
            cols="12"
            class="text-right"
          >
            <v-btn
              color="success"
              rounded
              class="mr-0 text-right"
              @click="uploadFiles"
            >
              Télécharger
            </v-btn>
          </v-col>
        </v-card>
        <v-alert
          v-if="message"
          border="left"
          color="teal"
          outlined
          class="multi-line"
        >
          {{ message }}
        </v-alert>
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <v-form>
          <v-container class="py-0">
            <v-row>
              <v-col
                cols="12"
                md="12"
              >
                <v-card
                  elevation="10"
                  outlined
                  color="#324961!important"
                  dark
                >
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title class="headline">
                        Information Sociéte
                      </v-list-item-title>
                      <v-list-item-subtitle>Siren/siret</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
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
                  </v-row>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                md="12"
              >
                <v-row>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-card
                      elevation="8"
                      color="#26c6da"
                      dark
                    >
                      <v-card-title class="font-weight-light">
                        Masse salariale
                      </v-card-title>
                      <v-col
                        cols="12"
                        md="9"
                      >
                        <v-text-field
                          label="First Name"
                          class="purple-input"
                        />
                      </v-col>
                    </v-card>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-card
                      elevation="10"
                      color="#26c6da"
                      dark
                    >
                      <v-card-title class="font-weight-light">
                        Masse salariale FPC
                      </v-card-title>
                      <v-card-subtitle />
                      <v-col
                        cols="12"
                        md="9"
                      >
                        <v-text-field
                          label="First Name"
                          class="purple-input"
                        />
                      </v-col>
                    </v-card>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-card
                      elevation="10"
                      color="#26c6da"
                      dark
                    >
                      <v-card-title class="font-weight-light">
                        Masse salariale CDD
                      </v-card-title>
                      <v-card-subtitle />
                      <v-col
                        cols="12"
                        md="9"
                      >
                        <v-text-field
                          label="First Name"
                          class="purple-input"
                        />
                      </v-col>
                    </v-card>
                  </v-col>
                </v-row>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import UploadService from '../services/UploadFilesService'
  export default {
    name: 'UploadFile',
    data: () => ({
      selectedFiles: undefined,
      progressInfos: [],
      message: '',
      data: [],
      fileInfos: [],
    }),

    methods: {
      selectFiles (files) {
        this.progressInfos = []
        this.selectedFiles = files
      },
      uploadFiles () {
        this.message = ''

        for (let i = 0; i < this.selectedFiles.length; i++) {
          this.upload(i, this.selectedFiles[i])
        }
      },
      upload (idx, file) {
        this.progressInfos[idx] = { percentage: 0, fileName: file.name }

        UploadService.upload(file, (event) => {
          this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total)
        })
          .then((response) => {
            this.data = response.data
          })
          .then((files) => {
            this.fileInfos = files.data
          })
          .catch(() => {
            this.progressInfos[idx].percentage = 0
            this.message = 'Could not upload the file:' + file.name
          })
      },
    },
  }
</script>
