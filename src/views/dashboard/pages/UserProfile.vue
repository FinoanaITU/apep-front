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
                              <v-card-title
                                v-if="parseInt(effectif) >= 11"
                                class="font-weight-light display-2"
                              >
                                contribution legal 1%
                              </v-card-title>
                              <v-card-title
                                v-else
                                class="font-weight-light display-2"
                              >
                                contribution legal 0,55%
                              </v-card-title>
                              <v-col
                                cols="12"
                                md="9"
                              >
                                <v-col
                                  class="display-3"
                                  cols="12"
                                >
                                  {{ contributionLegal }}€
                                </v-col>
                              </v-col>
                              <v-divider class="mx-4" />
                              <v-card-title class="font-weight-light display-2">
                                Contribution CPF-CDD
                              </v-card-title>
                              <v-col
                                cols="12"
                                md="9"
                              >
                                <v-col
                                  class="display-3"
                                  cols="12"
                                >
                                  {{ contributionCdd }}€
                                </v-col>
                              </v-col>
                            </v-card>
                          </v-col>
                          <v-col
                            cols="12"
                            md="8"
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
                                        @click="suprimerContribution"
                                      >
                                        <v-icon dark>
                                          mdi-minus
                                        </v-icon>
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-banner>
                              </v-col>
                              <v-col
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
                              </v-col>
                              <v-col
                                cols="12"
                                md="6"
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
                                  <v-col
                                    cols="12"
                                    md="9"
                                  >
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
                                  </v-col>
                                </v-card>
                              </v-col>
                            </v-row>
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
                            Totale contribution OPCO
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
                        @click="calculeTotaleContrubution"
                      >
                        valider contribution
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
      radios: 'non',
      autreContribution: [{
        nom_contribution: '',
        pourcentage: 0,
        valeur: 0,
      }],
      compteur_contribution: 1,
      loader: null,
      loading4: false,
    }),
    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)

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
        console.log(value.activite_pricipale)
        this.nomSociete = 'nom_entreprise' in value ? value.nom_entreprise : ''
        this.siret = value.siret
        this.siren = value.siren
        this.address = value.Addres_entreprise
        this.ville = value.ville_entreprise
        this.codeNAF = value.code_NAF
        this.codePostal = value.code_postal
        this.effectif = value.effectif_moyen_entreprise
        // this.email = value.email_societe
        this.iban = value.iban
        this.opco = value.opco
        this.scolaire = value.solde_ecole
        this.masseSlarialeTA = value.masse_salariale_TA
        this.taxeApprentissage = value.Taxe_apprentissage
        this.activite = value.activite_pricipale
        this.idcc = value.IDCC
        // formation continue
        this.contributionLegal = value.contribution_legale
        this.contributionCdd = value.contribution_cdd
        this.contributionFomrContinue = value.contributions_formation
        this.taMetropole = value.ta_metropole

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
        this.getActivierSociete(items[id])
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
          masse_salariale: this.masseSlarialeTA,
          solde_ecole: this.scolaire,
          tA_68: this.taxeApprentissage,
          iban: this.iban,
          // info pdf OPCO
          codeNAF: this.codeNAF,
          activite: this.activite,
          nbrSalarie: this.effectif,
          tva: this.tva,
          convention: this.idcc,

        }
        return data
      },

      ajoutContribution () {
        this.compteur_contribution++
        this.autreContribution.push({
          nom_contribution: '',
          pourcentage: 0,
          valeur: 0,
        })
      },

      suprimerContribution () {
        if (this.compteur_contribution > 1) {
          this.autreContribution.splice(this.compteur_contribution - 1, 1)
          this.compteur_contribution--
        }
      },

      calculeTotaleContrubution () {
        this.loader = 'loading4'
        // var contribution = this.effectif >= 11 ?  : this.contributionLegal + this.contributionCdd
        var autreContribution = this.autreContribution
        var totalAutreContribution = 0
        for (var i = 0; i < autreContribution.length; i++) {
          var contr = (this.masseSlarialeTA * parseFloat(autreContribution[i].pourcentage)) / 100
          this.autreContribution[i].value = contr
          totalAutreContribution = +contr
          console.log('ato')
          console.log(contr)
          console.log('-----------')
        }
        console.log('contributionLegal =' + this.contributionLegal)
        console.log('contributionCdd =' + this.contributionCdd)
        console.log('contributionFomrContinue =' + this.contributionFomrContinue)
        console.log('taMetropole =' + this.taMetropole)
        var contrfc = this.effectif >= 11 ? this.taMetropole : 0
        var sousTotal = this.contributionLegal + this.contributionCdd + this.contributionFomrContinue + contrfc + totalAutreContribution
        var tva = this.radios === 'oui' ? (sousTotal * 20) / 100 : 0
        this.contributionTotal = sousTotal + tva
        console.log('TVA =' + tva)
        console.log('totalAutreContribution =' + totalAutreContribution)
      },
    },
  }
</script>
