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
        <v-col
          cols="12"
        >
          <v-card
            class="v-card-profile"
            :loading="loadUpload"
            loading-text="Traitement en cours... "
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
        </v-col>
        <v-col
          cols="12"
        >
          <v-card
            v-if="hideTable == false"
            class="v-card-profile"
          >
            <template>
              <v-card>
                <v-card-title>
                  <v-spacer />
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  />
                </v-card-title>
                <v-data-table
                  :headers="headers"
                  :items="data"
                  :search="search"
                  :items-per-page="9"
                  :class="{'selectedRow': selectedRow}"
                  @click:row="checkSociete"
                >
                  <template v-slot:body="{ items }">
                    <tbody>
                      <tr
                        v-for="(item, key) in items"
                        :key="item.siren"
                        :class="item.siren === selectedRow ? 'selectedRow' : ''"
                        @click="rowSelect(key,items)"
                      >
                        <td>{{ item.nom_entreprise }}</td>
                        <td>{{ item.siren }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </v-card>
            </template>
          </v-card>
        </v-col>
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <v-form>
          <v-container
            id="all-info"
            class="py-0"
          >
            <v-row>
              <v-col
                cols="12"
                md="12"
                class="info-societe"
              >
                <v-card
                  elevation="10"
                  outlined
                  color="#4b5f72"
                  dark
                >
                  <div v-if="siren == ''">
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title class="headline">
                          Information Sociéte
                        </v-list-item-title>
                        <v-list-item-subtitle>Siren/siret</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                  <div v-else>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title class="headline">
                          <p class="display-3">
                            {{ nomSociete }}
                          </p>
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ siren }} {{ siret }}</v-list-item-subtitle>
                        <v-list-item-subtitle>{{ address }}</v-list-item-subtitle>
                        <v-list-item-subtitle>{{ codePostal }} {{ ville }}</v-list-item-subtitle>
                        <v-list-item-subtitle>{{ codeNAF }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-row>
                      <v-col
                        cols="12"
                        md="4"
                        class="info-mail"
                      >
                        <v-text-field
                          v-model="email"
                          class="purple-input"
                          label="email"
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        md="4"
                      >
                        <v-text-field
                          v-model="iban"
                          class="purple-input"
                          label="IBAN"
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        md="2"
                      >
                        <v-text-field
                          v-model="effectif"
                          label="Effectif de l'entreprise"
                          class="purple-input"
                          type="number"
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
              <div v-if="taxeApprentissage">
                <template>
                  <v-tabs
                    v-model="tab"
                    background-color="transparent"
                    grow
                  >
                    <v-tab>Taxe d'apprentissage</v-tab>
                    <v-tab>Formation continue</v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tab">
                    <v-tab-item>
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
                              <v-card-title class="font-weight-light display-2">
                                Masse salariale 2020
                              </v-card-title>
                              <v-col
                                cols="12"
                                md="9"
                              >
                                <v-col
                                  class="display-3"
                                  cols="12"
                                >
                                  {{ formatPrice(masseSlarialeTA) }}€
                                </v-col>
                                <!-- <v-text-field
                          v-model="masseSlarialeTA"
                          label="First Name"
                          class="purple-input"
                        /> -->
                              </v-col>
                              <v-divider class="mx-4" />
                              <v-card-title class="font-weight-light display-2">
                                Taxe d'apprentissage
                              </v-card-title>
                              <v-col
                                cols="12"
                                md="9"
                              >
                                <v-col
                                  class="display-3"
                                  cols="12"
                                >
                                  {{ formatPrice(taxeApprentissage) }}€
                                </v-col>
                                <!-- <v-text-field
                          v-model="masseSlarialeTA"
                          label="First Name"
                          class="purple-input"
                        /> -->
                              </v-col>
                            </v-card>
                          </v-col>
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-card
                              elevation="10"
                              color="#004275"
                              dark
                            >
                              <v-card-title class="font-weight-light display-2">
                                Etablissement scolaire
                              </v-card-title>
                              <p class="sous-titre">
                                Montant à verser
                              </p>
                              <v-card-text>
                                <v-row
                                  align="center"
                                  class="info-versement"
                                >
                                  <v-col
                                    class="display-3"
                                    cols="6"
                                  >
                                    13%
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="display-3"
                                  >
                                    {{ formatPrice(scolaire) }}€
                                  </v-col>
                                  <v-timeline
                                    align-top
                                    dense
                                  >
                                    <v-timeline-item
                                      v-for="date in dateScolaire"
                                      :key="date.time"
                                      color="white"
                                      small
                                    >
                                      <div>
                                        <div class="font-weight-normal">
                                          <strong>{{ date.avant }}</strong>
                                        </div>
                                        <div>{{ date.date }}</div>
                                      </div>
                                    </v-timeline-item>
                                  </v-timeline>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-card
                              elevation="10"
                              color="#342a48cf"
                              dark
                            >
                              <v-card-title class="font-weight-light display-2">
                                OPCO
                              </v-card-title>
                              <p class="sous-titre">
                                Montant à verser
                              </p>
                              <v-card-text>
                                <v-row
                                  align="center"
                                  class="info-versement"
                                >
                                  <v-col
                                    class="display-3"
                                    cols="6"
                                  >
                                    87%
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="display-3"
                                  >
                                    {{ formatPrice(opco) }}€
                                  </v-col>
                                  <v-timeline
                                    align-top
                                    dense
                                  >
                                    <v-timeline-item
                                      v-for="date in dateOPCO"
                                      :key="date.time"
                                      color="white"
                                      small
                                    >
                                      <div>
                                        <div class="font-weight-normal">
                                          <strong>{{ date.avant }}</strong>
                                        </div>
                                        <div>{{ date.date }}</div>
                                      </div>
                                    </v-timeline-item>
                                  </v-timeline>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-tab-item>
                    <v-tab-item>
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
                              <v-card-title class="font-weight-light display-2">
                                Masse salariale 2020
                              </v-card-title>
                              <v-col
                                cols="12"
                                md="9"
                              >
                                <v-col
                                  class="display-3"
                                  cols="12"
                                >
                                  {{ formatPrice(masseSlarialeTA) }}€
                                </v-col>
                              <!-- <v-text-field
                          v-model="masseSlarialeTA"
                          label="First Name"
                          class="purple-input"
                        /> -->
                              </v-col>
                              <v-divider class="mx-4" />
                              <v-card-title class="font-weight-light display-2">
                                Taxe d'apprentissage
                              </v-card-title>
                              <v-col
                                cols="12"
                                md="9"
                              >
                                <v-col
                                  class="display-3"
                                  cols="12"
                                >
                                  {{ formatPrice(taxeApprentissage) }}€
                                </v-col>
                              <!-- <v-text-field
                          v-model="masseSlarialeTA"
                          label="First Name"
                          class="purple-input"
                        /> -->
                              </v-col>
                            </v-card>
                          </v-col>
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-card
                              elevation="10"
                              color="#004275"
                              dark
                            >
                              <v-card-title class="font-weight-light display-2">
                                Etablissement scolaire
                              </v-card-title>
                              <p class="sous-titre">
                                Montant à verser
                              </p>
                              <v-card-text>
                                <v-row
                                  align="center"
                                  class="info-versement"
                                >
                                  <v-col
                                    class="display-3"
                                    cols="6"
                                  >
                                    13%
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="display-3"
                                  >
                                    {{ formatPrice(scolaire) }}€
                                  </v-col>
                                  <v-timeline
                                    align-top
                                    dense
                                  >
                                    <v-timeline-item
                                      v-for="date in dateScolaire"
                                      :key="date.time"
                                      color="white"
                                      small
                                    >
                                      <div>
                                        <div class="font-weight-normal">
                                          <strong>{{ date.avant }}</strong>
                                        </div>
                                        <div>{{ date.date }}</div>
                                      </div>
                                    </v-timeline-item>
                                  </v-timeline>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-card
                              elevation="10"
                              color="#342a48cf"
                              dark
                            >
                              <v-card-title class="font-weight-light display-2">
                                OPCO
                              </v-card-title>
                              <p class="sous-titre">
                                Montant à verser
                              </p>
                              <v-card-text>
                                <v-row
                                  align="center"
                                  class="info-versement"
                                >
                                  <v-col
                                    class="display-3"
                                    cols="6"
                                  >
                                    87%
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="display-3"
                                  >
                                    {{ formatPrice(opco) }}€
                                  </v-col>
                                  <v-timeline
                                    align-top
                                    dense
                                  >
                                    <v-timeline-item
                                      v-for="date in dateOPCO"
                                      :key="date.time"
                                      color="white"
                                      small
                                    >
                                      <div>
                                        <div class="font-weight-normal">
                                          <strong>{{ date.avant }}</strong>
                                        </div>
                                        <div>{{ date.date }}</div>
                                      </div>
                                    </v-timeline-item>
                                  </v-timeline>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-tab-item>
                  </v-tabs-items>
                </template>
              </div>
              <!-- <v-col
                cols="12"
                class="text-right"
              >
                <v-btn
                  color="success"
                  class="mr-0"
                >
                  Update Profile
                </v-btn>
              </v-col> -->
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<style>
.info-societe{
  margin-top: 15px
}
.info-mail{
  margin-left: 8px
}
.sous-titre{
  margin-top: 1px;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 20px;
}
.info-versement{
  color:white;
}
.selectedRow {
    background-color:#4b5f72;
}
</style>
<script>
  import UploadService from '../services/UploadFilesService'
  export default {
    name: 'UploadFile',
    data: () => ({
      selectedRow: null,
      tab: null,
      // information sociéte
      nomSociete: '',
      siren: '',
      siret: '',
      nbrSalarie: '',
      msBrute: '',
      address: '',
      ville: '',
      codePostal: '',
      effectif: '',
      email: '',
      iban: '',
      codeNAF: '',
      pourcent13: '',
      pourcent87: '',
      //
      // Taxe d'apprentissage
      dateOPCO: [
        {
          avant: 'Avant le 1er',
          date: 'Mars 2021',
        },
      ],
      dateScolaire: [
        {
          avant: 'Avant le 31',
          date: 'Mai 2021',
        },
      ],
      opco: '',
      scolaire: '',
      masseSlarialeTA: '',
      taxeApprentissage: '',
      //
      selectedFiles: undefined,
      progressInfos: [],
      message: '',
      data: [],
      fileInfos: [],
      search: '',
      hideTable: true,
      loadUpload: false,
      headers: [
        {
          text: 'nom sociéteé',
          align: 'start',
          value: 'nom_entreprise',
        },
        {
          text: 'siret',
          value: 'siren',
        },
      ],
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
        this.loadUpload = true
        UploadService.upload(file, (event) => {
          this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total)
        })
          .then((response) => {
            console.log(response.data.length)
            this.data = response.data
            this.hideTable = false
            this.loadUpload = false
            if (response.data.length === 1) {
              this.checkSociete(this.data[0])
            }
          })
          .then((files) => {
            this.fileInfos = files.data
          })
          .catch(() => {
            this.progressInfos[idx].percentage = 0
            this.message = 'Could not upload the file:' + file.name
          })
      },
      checkSociete (value) {
        console.log(value)
        console.log('nom_entreprise' in value)
        console.log(value.nom_entreprise)
        this.nomSociete = 'nom_entreprise' in value ? value.nom_entreprise : ''
        this.siret = value.siret
        this.siren = value.siren
        this.address = value.Addres_entreprise
        this.ville = value.ville_entreprise
        this.codeNAF = value.code_NAF
        this.codePostal = value.code_postal
        this.effectif = value.effectif_moyen_entreprise
        this.email = value.email_societe
        this.iban = value.iban
        this.opco = value.opco
        this.scolaire = value.solde_ecole
        this.masseSlarialeTA = value.masse_salariale_TA
        this.taxeApprentissage = value.Taxe_apprentissage
      },
      formatPrice (value) {
        // const val = (value / 1).toFixed(2).replace('.', ',')
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },
      rowSelect (id, items) {
        console.log(id)
        this.selectedRow = items[id].siren
        this.checkSociete(items[id])
        window.location.hash = '#all-info'
      },
    },
  }
</script>
