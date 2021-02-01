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
                        <br>
                        <v-list-item-subtitle>{{ activite }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-row>
                      <v-col
                        cols="12"
                        md="3"
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
                <div>
                  <v-alert
                    :value="alert"
                    dense
                    outlined
                    type="error"
                  >
                    Erreur sur le fichier avec le numéro siren <strong>{{ siren }}</strong>
                  </v-alert>
                </div>
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
                                OPCO &nbsp;{{ nomOPCO }}
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
                            md="5"
                          >
                            <v-card
                              elevation="8"
                              color="#26c6da"
                              dark
                            >
                              <v-card-title
                                class="font-weight-light display-2"
                              >
                                Masse salariale
                              </v-card-title>
                              <v-col
                                cols="12"
                                md="9"
                              >
                                <v-col
                                  class="display-3"
                                  cols="12"
                                >
                                  {{ formatPrice(masseUtiliser) }}€
                                </v-col>
                              </v-col>
                              <v-divider class="mx-4" />
                              <v-card-title
                                class="font-weight-light display-2"
                              >
                                Masse salariale CDD
                              </v-card-title>
                              <v-col
                                cols="12"
                                md="9"
                              >
                                <v-col
                                  class="display-3"
                                  cols="12"
                                >
                                  {{ formatPrice(masseCDD) }}€
                                </v-col>
                              </v-col>
                            </v-card>
                          </v-col>
                          <v-col
                            cols="12"
                            md="7"
                          >
                            <v-row>
                              <v-col
                                cols="12"
                                md="12"
                                style="margin-top: 30px;"
                              >
                                <v-banner
                                  elevation="5"
                                  single-line
                                  :z-index="zIndex"
                                >
                                  <p>Autre contribution</p>
                                  <v-row
                                    v-for="i in parseInt(compteur_contribution)"
                                    :key="i"
                                  >
                                    <v-col
                                      cols="12"
                                      sm="6"
                                      md="6"
                                    >
                                      <v-text-field
                                        v-model="autreContribution[i-1].nom_contribution"
                                        label="libellet"
                                        solo
                                      />
                                    </v-col>

                                    <v-col
                                      cols="12"
                                      sm="6"
                                      md="3"
                                    >
                                      <v-text-field
                                        v-model="autreContribution[i-1].pourcentage"
                                        placeholder="pourcentage"
                                        solo
                                        type="number"
                                        :min="0"
                                        :max="100"
                                      />
                                    </v-col>
                                    <v-col
                                      cols="12"
                                      sm="6"
                                      md="3"
                                      style="margin-left: -30px;"
                                    >
                                      <v-btn
                                        class="mx-2"
                                        fab
                                        dark
                                        color="indigo"
                                        @click="ajoutContribution"
                                      >
                                        <v-icon dark>
                                          mdi-plus
                                        </v-icon>
                                      </v-btn>
                                      <v-btn
                                        class="mx-2"
                                        fab
                                        dark
                                        color="red"
                                        @click="suprimerContribution(i)"
                                      >
                                        <v-icon dark>
                                          mdi-minus
                                        </v-icon>
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-banner>
                              </v-col>
                              <!-- <v-col
                                cols="12"
                                md="6"
                              >
                                <v-card
                                  elevation="10"
                                  color="#004275"
                                  style="{margin-top: -30px;}"
                                  dark
                                >
                                  <v-card-title class="font-weight-light display-2">
                                    Formation Continue
                                  </v-card-title>
                                  <v-col
                                    cols="12"
                                    md="9"
                                  >
                                    <v-col
                                      class="display-3"
                                      cols="12"
                                    >
                                      {{ contributionFomrContinue }}€
                                    </v-col>
                                  </v-col>
                                </v-card>
                              </v-col> -->
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        lg="12"
                        md="12"
                        style="margin-top: -37px;"
                      >
                        <v-row>
                          <v-col
                            lg="4"
                            md="4"
                          >
                            <v-card
                              elevation="10"
                              color="#342a48cf"
                              dark
                              width="300px"
                              style="{margin-top: -30px;}"
                            >
                              <v-card-title class="font-weight-light display-2">
                                TVA
                              </v-card-title>
                              <v-radio-group v-model="radios">
                                <v-radio value="oui">
                                  <template v-slot:label>
                                    <div>Oui</div>
                                  </template>
                                </v-radio>
                                <v-radio value="non">
                                  <template v-slot:label>
                                    <div>Non</div>
                                  </template>
                                </v-radio>
                              </v-radio-group>
                            </v-card>
                          </v-col>
                          <v-col
                            lg="8"
                            md="8"
                          >
                            <v-card
                              class="mx-auto"
                              tile
                            >
                              <v-list flat>
                                <v-subheader>Détail du calcule</v-subheader>
                                <v-list-item-group
                                  color="primary"
                                >
                                  <v-list-item
                                    v-for="(contrib, i) in detailCalcul"
                                    :key="i"
                                  >
                                    <v-list-item-content class="display-1">
                                      <p>{{ contrib.nom_contribution }} &nbsp; <strong>{{ contrib.pourcentage }}%</strong> &nbsp; = &nbsp; <strong>{{ formatPrice(contrib.valeur) }}€</strong></p>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list-item-group>
                              </v-list>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        v-if="contributionTotal != 0"
                        lg="12"
                        md="12"
                        style="margin-top: -37px;"
                      >
                        <v-card
                          elevation="10"
                          color="rgb(0 0 0 / 88%)"
                          dark
                        >
                          <v-card-title class="font-weight-light display-2">
                            Totale contribution OPCO  &nbsp; {{ nomOPCO }}
                          </v-card-title>
                          <v-col
                            cols="12"
                            md="9"
                          >
                            <v-col
                              class="display-3"
                              cols="12"
                            >
                              {{ formatPrice(contributionTotal) }}€
                            </v-col>
                          </v-col>
                        </v-card>
                      </v-col>
                      <v-btn
                        class="ma-2"
                        :loading="loading4"
                        :disabled="loading4"
                        color="info"
                        style="left: 75%;"
                        @click="calculeTotaleContrubution"
                      >
                        valider contribution
                        <template v-slot:loader>
                          <span class="custom-loader">
                            <v-icon light>mdi-cached</v-icon>
                          </span>
                        </template>
                      </v-btn>
                      <v-btn
                        class="ma-2"
                        :loading="loading4"
                        :disabled="loading4"
                        color="info"
                        @click="generatePDF"
                      >
                        generer pdf
                        <template v-slot:loader>
                          <span class="custom-loader">
                            <v-icon light>mdi-cached</v-icon>
                          </span>
                        </template>
                      </v-btn>
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
      <v-overlay
        :z-index="zIndex"
        :value="overlay"
      >
        <v-progress-circular
          :rotate="90"
          :size="100"
          :width="15"
          :value="valueCircular"
          color="white"
        >
          {{ valueCircular }}
        </v-progress-circular>
      </v-overlay>
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
.v-progress-circular {
  margin: 1rem;
}
.custom-loader {
    animation: loader 1s infinite;
    display: flex;
}
@-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
<script>
  import axios from 'axios'
  import UploadService from '../services/UploadFilesService'
  export default {
    name: 'UploadFile',
    data: () => ({
      alert: false,
      selectedRow: null,
      tab: null,
      // information sociéte
      nomSociete: '',
      siren: '',
      siret: '',
      nbrSalarie: 0,
      msBrute: '',
      address: '',
      ville: '',
      codePostal: '',
      effectif: '',
      email: '',
      iban: '',
      codeNAF: '',
      activite: '',
      pourcent13: '',
      pourcent87: '',
      idcc: '',
      addressOCPO: '',
      nomOPCO: '',
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
      // formartion continue
      contributionLegal: 0,
      contributionCdd: 0,
      contributionFomrContinue: 0,
      taMetropole: 0,
      opcoTotal: '',
      contributionTotal: 0,
      masseCDD: 0,
      masseFPC: 0,
      masseUtiliser: 0,
      assujjetieTaxe: 'oui',
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
      overlay: false,
      zIndex: 0,
      interval: {},
      valueCircular: 0,
      radios: 'oui',
      autreContribution: [],
      detailCalcul: [],
      compteur_contribution: 1,
      loader: null,
      loading4: false,
      dejaCalulerOPCO: false,
    }),
    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 500)

        this.loader = null
      },
    },

    methods: {
      selectFiles (files) {
        this.progressInfos = []
        this.selectedFiles = files
      },
      uploadFiles () {
        this.message = ''
        this.valueCircular = 0
        this.interval = {}
        for (let i = 0; i < this.selectedFiles.length; i++) {
          this.upload(i, this.selectedFiles[i])
        }
      },
      async upload (idx, file) {
        this.progressInfos[idx] = { percentage: 0, fileName: file.name }
        this.loadUpload = true
        UploadService.upload(file, (event) => {
          this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total)
        })
          .then((response) => {
            // console.log(response.data.length)
            this.responseLoop(response.data)
          })
          .then((files) => {
            this.fileInfos = files.data
          })
          .catch(() => {
            this.progressInfos[idx].percentage = 0
            this.message = 'Could not upload the file:' + file.name
          })
      },
      async responseLoop (data) {
        this.loadUpload = true
        this.overlay = !this.overlay
        var my = this
        for (var i = 0; i < data.length; i++) {
          my.valueCircular = Number((i * 100) / data.length).toFixed(1)
          this.interval = setInterval(this.valueCircular)
          await this.sleep(200)
          this.getNomSocieteApi(data[i], i)
        }
        if (data.length === 1) {
          await this.sleep(2000)
        }
        this.loadUpload = false
        this.overlay = false
        await this.sleep(200)
        this.valueCircular = 0
        this.interval = {}
        this.rowSelect(0, this.data)
      },
      checkSociete (value) {
        console.log(value)
        console.log('nom_entreprise sdfqsssssssssssss')
        console.log(value.activite)
        this.nomSociete = 'nom_entreprise' in value ? value.nom_entreprise : ''
        this.siret = value.siret
        this.siren = value.siren
        this.address = value.Addres_entreprise
        this.ville = value.ville_entreprise
        this.codeNAF = value.code_NAF
        this.codePostal = value.code_postal
        this.effectif = value.effectif_moyen_entreprise
        this.nomOPCO = value.nom_opco
        this.addressOCPO = value.address_opco
        // this.email = value.email_societe
        this.iban = value.iban
        this.opco = value.opco
        this.scolaire = value.solde_ecole
        this.masseSlarialeTA = value.masse_salariale_TA
        this.taxeApprentissage = value.Taxe_apprentissage
        this.activite = value.activite
        this.idcc = value.IDCC
        // formation continue
        this.contributionLegal = value.contribution_legale
        this.contributionCdd = value.contribution_cdd
        this.contributionFomrContinue = value.contributions_formation
        this.taMetropole = value.ta_metropole
        this.assujjetieTaxe = 'assujjetie_taxe' in value ? value.assujjetie_taxe : 'non'
        // this.masseUtiliser = 'masse_salariale_FPC' in value ? value.masse_salariale_FPC : value.masse_salariale_TA
        this.masseUtiliser = value.masse_salariale_TA
        this.masseCDD = 'masse_salariale_CDD' in value ? value.masse_salariale_CDD : 0
        this.masseFPC = 'masse_salariale_FPC' in value ? value.masse_salariale_FPC : 0
        // reinitialise contribution
        this.radios = 'oui'
        this.reinitialiseContribution(value.contribution_legale, value.contribution_cdd)
        this.dejaCalulerOPCO = false
        // erreur
        if (this.taxeApprentissage === undefined) {
          this.alert = !this.alert
        }
      },
      formatPrice (value) {
        // const val = (value / 1).toFixed(2).replace('.', ',')
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      },
      async rowSelect (id, items) {
        this.alert = false
        this.selectedRow = items[id].siren
        this.checkSociete(items[id])
        this.overlay = false
        this.valueCircular = 100
        window.location.hash = '#all-info'
        // this.getActivierSociete(items[id])
      },
      sleep (ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
      },
      getNomSocieteApi (data, i) {
        return axios({
          method: 'get',
          // url: 'https://entreprise.data.gouv.fr/api/rncs/v1/fiches_identite/' + data.siren,
          url: 'https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/?siren=' + data.siren,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            // data.nom_entreprise = response.data.dossier_entreprise_greffe_principal.etablissement_principal.nom_commercial === '' ? response.data.dossier_entreprise_greffe_principal.personne_morale.denomination : ''
            data.nom_entreprise = response.data.etablissements[0].unite_legale.denomination
            this.data = this.data.concat(Array(data))
            this.hideTable = false
            // this.loadUpload = false
            // this.checkSociete(this.data[0])
          })
          .catch(error => {
            console.log(error)
          })
      },
      getActivierSociete (data) {
        this.overlay = true
        axios({
          method: 'get',
          url: 'https://entreprise.data.gouv.fr/api/rncs/v1/fiches_identite/' + data.siren,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            data.activite_pricipale = response.data.dossier_entreprise_greffe_principal.etablissements[0].activite !== '' ? response.data.dossier_entreprise_greffe_principal.etablissements[0].activite : ''
            this.checkSociete(data)
            this.overlay = false
            this.valueCircular = 100
            window.location.hash = '#all-info'
          })
          .catch(error => {
            console.log(error)
            this.checkSociete(data)
            this.valueCircular = 100
            window.location.hash = '#all-info'
            this.overlay = false
          })
        // return data
      },
      counstructData () {
        var data = {
          // information societe
          nom: this.nomSociete,
          siren: this.siren,
          siret: this.siret,
          address: this.address,
          ville: this.ville,
          codePostal: this.codePostal,
          email: this.email,
          // information pdf taxe d'apprentissage
          masse_salariale: this.formatPrice(this.masseSlarialeTA),
          solde_ecole: this.formatPrice(this.scolaire),
          tA_68: this.formatPrice(this.taxeApprentissage),
          iban: this.iban,
          // info pdf OPCO
          codeNAF: this.codeNAF,
          activite: this.activite,
          nbrSalarie: this.effectif,
          tva: this.radios,
          convention: this.idcc,
          listeContribution: this.detailCalcul,
          masseCDD: this.formatPrice(this.masseCDD),
          totalContribution: this.formatPrice(this.contributionTotal),
          nomOPCO: this.nomOPCO,
          addressOPCO: this.addressOCPO,
          opco87: this.opco,
        }
        return data
      },

      ajoutContribution () {
        this.compteur_contribution = this.autreContribution.length + 1
        this.autreContribution.push({
          nom_contribution: '',
          pourcentage: 0,
          valeur: 0,
        })
      },

      suprimerContribution (key) {
        if (this.compteur_contribution > 1) {
          this.autreContribution.splice(key - 1, 1)
          this.compteur_contribution--
        }
      },
      reinitialiseContribution (contributionLegale, contributionCdd, isCalcul = false) {
        console.log('mandalo reinitialise')
        this.contributionTotal = 0
        if (isCalcul) {
          this.detailCalcul = [
            { nom_contribution: 'Contribution legale', pourcentage: this.effectif >= 11 ? 1 : 0.55, valeur: contributionLegale },
            { nom_contribution: 'Votre Contribution CPF-CDD', pourcentage: 1, valeur: contributionCdd },
          ]
        } else {
          this.compteur_contribution = 1
          this.autreContribution = [{
            nom_contribution: '',
            pourcentage: 0,
            valeur: 0,
          }]
          this.detailCalcul = [
            { nom_contribution: 'Contribution legale', pourcentage: this.effectif >= 11 ? 1 : 0.55, valeur: contributionLegale },
            { nom_contribution: 'Votre Contribution CPF-CDD', pourcentage: 1, valeur: contributionCdd },
          ]
        }
      },
      calculeTotaleContrubution () {
        if (this.dejaCalulerOPCO) {
          this.reinitialiseContribution(this.contributionLegal, this.contributionCdd, this.dejaCalulerOPCO)
        }
        this.loader = 'loading4'
        var autreContribution = this.autreContribution
        // calcule tous les contribution
        var totalAutreContribution = 0
        for (var i = 0; i < autreContribution.length; i++) {
          var contr = (this.masseSlarialeTA * parseFloat(autreContribution[i].pourcentage)) / 100
          this.autreContribution[i].valeur = contr
          totalAutreContribution = +contr
          // add in calcul detaille
          if (this.autreContribution[i].nom_contribution !== '') {
            this.detailCalcul.push({
              nom_contribution: this.autreContribution[i].nom_contribution,
              pourcentage: this.autreContribution[i].pourcentage,
              valeur: contr,
            })
          }
        }
        // ajout contribution cdd dans total contribution
        totalAutreContribution = totalAutreContribution + this.detailCalcul[0].valeur + this.detailCalcul[1].valeur
        console.log(totalAutreContribution)
        //
        var acompte1 = 0
        var acompte2 = 0
        if (this.effectif >= 11) {
          acompte1 = (totalAutreContribution * 60) / 100
          acompte2 = (totalAutreContribution * 38) / 100
          // totalAutreContribution = totalAutreContribution + acompte1 + acompte2
          // ajout affiche detail
          // if (this.dejaCalulerOPCO) {
          // this.changeValueAcompte(this.autreContribution, acompte1, acompte2)
          // this.changeValueAcompte(this.detailCalcul, acompte1, acompte2)
          // } else {
          this.detailCalcul.push({ nom_contribution: '1er ACOMPTE CUFPA', pourcentage: 60, valeur: this.formatPrice(acompte1.toFixed(2)) })
          this.detailCalcul.push({ nom_contribution: '2er ACOMPTE CUFPA', pourcentage: 38, valeur: this.formatPrice(acompte2.toFixed(2)) })
          // ajout calucl detail
          // this.autreContribution.push({ nom_contribution: '1er ACOMPTE CUFPA', pourcentage: 60, valeur: acompte1 })
          // this.autreContribution.push({ nom_contribution: '2er ACOMPTE CUFPA', pourcentage: 38, valeur: acompte2 })
          // }
        }
        var tva = 0
        if (this.radios === 'oui') {
          tva = this.detailCalcul[0].valeur * 0.6 * 0.2
          this.detailCalcul.push({
            nom_contribution: 'TVA',
            pourcentage: 20,
            valeur: this.formatPrice(tva.toFixed(2)),
          })
        } else {
          tva = 0
        }
        console.log(this.opco)
        console.log(tva.toFixed(2))
        console.log(acompte1)
        // var op068 = (this.masseUtiliser * 0.68) / 100
        // var ta87 = (op068 * 87) / 100
        var sousTotal = this.opco + parseFloat(acompte1.toFixed(2)) + parseFloat(tva.toFixed(2)) + this.contributionCdd
        console.log(sousTotal)
        this.contributionTotal = (sousTotal).toFixed(2)
        this.dejaCalulerOPCO = true
      },

      changeValueAcompte (objetctName, acompte1, acompte2) {
        for (var j = 0; j < objetctName.length; j++) {
          if (objetctName[j].nom_contribution === '1er ACOMPTE CUFPA') {
            objetctName[j].valeur = acompte1.toFixed(2)
          }
          if (objetctName[j].nom_contribution === '2er ACOMPTE CUFPA') {
            objetctName[j].valeur = acompte2.toFixed(2)
          }
        }
      },
      generatePDF () {
        var data = this.counstructData()
        axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/apep/generatePDF/',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data,
        }).then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error)
        })
      },
    },
  }
</script>
