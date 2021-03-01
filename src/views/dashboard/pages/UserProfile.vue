<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-dialog
      v-model="dialogPaimentLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          {{ loadingText }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
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
          v-if="downloadComplet"
          cols="12"
        >
          <v-alert
            dense
            type="success"
            text
          >
            Fichier traiter: {{ data.length }}
          </v-alert>
        </v-col>
        <v-col
          cols="12"
          style="margin-top: -40px;"
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
                  :items-per-page="20"
                  disable-items-per-page
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
                        <td>{{ item.cabinet_comptable }}</td>
                        <td>
                          <v-simple-checkbox
                            v-model="item.pdfCreate"
                            disabled
                          />
                        </td>
                        <td>
                          <v-simple-checkbox
                            v-model="item.paimentEffectuer"
                            disabled
                          />
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </v-card>
            </template>
          </v-card>
        </v-col>
        <v-col
          v-if="hideTable == false"
          cols="12"
        >
          <v-btn
            color="success"
            rounded
            class="mr-0 text-right"
            @click="generateExcelFile"
          >
            Exporter fichier excel
          </v-btn>
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
                        <v-list-item-title
                          class="headline"
                        >
                          <p
                            v-if="nomSociete != null && clickSociete == false"
                            class="display-3"
                            @click="modifSociete"
                          >
                            {{ nomSociete }}
                          </p>
                          <p v-if="clickSociete || nomSociete == null">
                            <v-col
                              cols="12"
                              md="4"
                            >
                              <v-text-field
                                ref="nomSocieteToSet"
                                v-model="nomSocieteToSet"
                                class="purple-input"
                                label="Nom sociéte"
                                @blur="inputmodifSocietModS"
                              />
                            </v-col>
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
              <!-- <div v-if="taxeApprentissage"> -->
              <div v-if="downloadComplet">
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
                                  <div v-if="modifMasseSalarialeTA">
                                    <v-text-field
                                      ref="inputmodifMasseSalarialeTA"
                                      v-model="masseSlarialeTA"
                                      class="purple-input"
                                      label=""
                                      @blur="recalculerMasseSalariale"
                                    />
                                  </div>
                                  <div
                                    v-else
                                    @click="modifyMasseSalarialeTA"
                                  >
                                    {{ formatPrice(masseSlarialeTA) }}€
                                  </div>
                                </v-col>
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
                                Montant à verser à l'APEP SUP
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
                          <v-col
                            cols="12"
                            md="12"
                            class="text-center"
                          >
                            <v-row>
                              <v-col
                                cols="5"
                                md="5"
                              />
                              <v-col
                                cols="3"
                                md="3"
                              >
                                <v-dialog
                                  v-model="dialogPaye"
                                  width="500"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      color="blue"
                                      dark
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      Payer par carte
                                    </v-btn>
                                  </template>

                                  <v-card>
                                    <v-card-title>
                                      <span class="headline">Payer par carte</span>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-container>
                                        <v-col
                                          cols="12"
                                          sm="8"
                                          md="8"
                                        >
                                          <v-text-field
                                            v-model="emailPaiment"
                                            label="email*"
                                            :rules="emailRules"
                                            required
                                          />
                                        </v-col>
                                        <stripe-element-card
                                          ref="elementsRef"
                                          :pk="publishableKey"
                                          :amount="amount"
                                          :hide-postal-code="true"
                                          @token="tokenCreated"
                                          @loading="loading = $event"
                                        />
                                        <div class="text-center">
                                          <v-btn
                                            rounded
                                            color="primary"
                                            dark
                                            :disabled="paimentEffectuer"
                                            @click="submit"
                                          >
                                            <strong>
                                              Payer {{ formatPrice(scolaire) }}€
                                            </strong>
                                          </v-btn>
                                        </div>
                                        <v-alert
                                          v-if="paimentEffectuer"
                                          elevation="16"
                                          type="success"
                                        >
                                          <v-row align="center">
                                            <v-col class="grow">
                                              Paiment efféctuer
                                            </v-col>
                                            <v-col class="shrink">
                                              <v-btn
                                                @click="openInNewTab(lienFacture)"
                                              >
                                                Voire facture
                                              </v-btn>
                                            </v-col>
                                          </v-row>
                                        </v-alert>
                                        <br>
                                        <v-alert
                                          v-if="errorPaiment != ''"
                                          color="red"
                                          dense
                                          elevation="16"
                                          type="error"
                                        >
                                          une erreur est survenue pendant le paiement
                                        </v-alert>
                                      </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                      <v-spacer />
                                      <v-btn
                                        color="primary"
                                        text
                                        @click="dialogPaye = false"
                                      >
                                        Fermer
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-col>
                              <!-- <v-col
                                cols="4"
                                md="4"
                              >
                                <v-btn
                                  depressed
                                  color="blue"
                                >
                                  Payer par telereglement
                                </v-btn>
                              </v-col> -->
                            </v-row>
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
                                  <div v-if="modifMasseSalarialeTA">
                                    <v-text-field
                                      ref="inputmodifMasseSalarialeTAFC"
                                      v-model="masseSlarialeTA"
                                      class="purple-input"
                                      label=""
                                      @blur="recalculerMasseSalariale"
                                    />
                                  </div>
                                  <div
                                    v-else
                                    @click="modifyMasseSalarialeTAFC"
                                  >
                                    {{ formatPrice(masseSlarialeTA) }}€
                                  </div>
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
                                  <div v-if="modifmasseCDD">
                                    <v-text-field
                                      ref="inputmodifMSCDD"
                                      v-model="masseCDD"
                                      class="purple-input"
                                      label=""
                                      @blur="recalculerMasseSalarialeCDD"
                                    />
                                  </div>
                                  <div
                                    v-else
                                    @click="modifymasseCDD"
                                  >
                                    {{ formatPrice(masseCDD) }}€
                                  </div>
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
                                      style="margin-left: -18px;margin-top: 9px;"
                                    >
                                      <v-btn
                                        class="mx-2"
                                        fab
                                        dark
                                        color="indigo"
                                        x-small
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
                                        x-small
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
                              <v-divider class="mx-10" />
                              <!-- <v-card-title class="font-weight-light display-2">
                                Assujetie FPC
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
                              </v-radio-group> -->
                              <!-- <v-card-title class="font-weight-light display-1">
                                Montant déja vérser
                              </v-card-title> -->
                              <v-col cols="12">
                                <v-text-field
                                  v-model="dejaVerser"
                                  label="Acompte  déja vérser"
                                  class="purple-input"
                                  type="number"
                                  :min="0"
                                />
                              </v-col>
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
                                      <p>{{ contrib.nom_contribution }} &nbsp; <strong v-if="contrib.nom_contribution != 'Montant déjà verser'">{{ contrib.pourcentage }}%</strong> &nbsp; = &nbsp; <strong>{{ formatPrice(contrib.valeur) }}€</strong></p>
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
                        id="totalContribution"
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
                      <v-col cols="12">
                        <v-row
                          style="margin-top: -23px;"
                          align="center"
                          justify="space-around"
                        >
                          <v-dialog
                            v-if="dejaCalulerOPCO"
                            v-model="sendMailDialog"
                            persistent
                            max-width="600px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color="green"
                                v-bind="attrs"
                                v-on="on"
                              >
                                generer et envoyer pdf
                              </v-btn>
                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="headline">Envoyer pdf</span>
                              </v-card-title>
                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12">
                                      <v-text-field
                                        v-model="emailpdf"
                                        label="Email*"
                                        required
                                      />
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer />
                                <v-btn
                                  v-if="dejaCalulerOPCO"
                                  class="ma-2"
                                  :loading="loading4"
                                  :disabled="loading4"
                                  color="blue darken-1"
                                  @click="generatePDF(false)"
                                >
                                  voir pdf
                                  <template v-slot:loader>
                                    <span class="custom-loader">
                                      <v-icon light>mdi-cached</v-icon>
                                    </span>
                                  </template>
                                </v-btn>
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="sendMailPDF"
                                >
                                  envoyer
                                </v-btn>
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="sendMailDialog = false"
                                >
                                  Fermer
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
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
                        </v-row>
                      </v-col>

                      <!-- <v-btn
                        class="ma-2"
                        :loading="loading4"
                        :disabled="loading4"
                        color="warning"
                        @click="generatePDF"
                      >
                        voir pdf
                        <template v-slot:loader>
                          <span class="custom-loader">
                            <v-icon light>mdi-cached</v-icon>
                          </span>
                        </template>
                      </v-btn> -->
                    </v-tab-item>
                  </v-tabs-items>
                </template>
              </div>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
      <v-overlay
        :z-index="zIndex"
        :value="overlay"
      >
        <v-progress-circular
          v-if="infinitLoading"
          indeterminate
          color="white"
        />
        <v-progress-circular
          v-else
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
#create .v-speed-dial {
  position: absolute;
}

#create .v-btn--floating {
  position: relative;
}
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
  import { StripeElementCard } from '@vue-stripe/vue-stripe'
  import axios from 'axios'
  import UploadService from '../services/UploadFilesService'
  export default {
    name: 'UploadFile',
    components: {
      StripeElementCard,
    },
    data: () => ({
      alert: false,
      selectedRow: null,
      tab: null,
      // information sociéte
      clickSociete: false,
      nomSocieteToSet: '',
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
      opco: 0,
      scolaire: 0,
      masseSlarialeTA: 0,
      taxeApprentissage: 0,
      modifMasseSalarialeTA: false,
      focusMasseTA: false,
      modifmasseCDD: false,
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
      assujjetieTaxeFpc: 'non',
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
        {
          text: 'cabinet',
          value: 'cabinet_comptable',
        },
        {
          text: 'PDF généré',
          value: 'pdfCreate',
        },
        {
          text: 'paiement effectué',
          value: 'paimentEffectuer',
        },
      ],
      dejaVerser: 0,
      overlay: false,
      zIndex: 0,
      interval: {},
      valueCircular: 0,
      radios: 'oui',
      autreContribution: [{
        nom_contribution: '',
        pourcentage: 0,
        valeur: 0,
      }],
      detailCalcul: [],
      compteur_contribution: 1,
      loader: null,
      loading4: false,
      dejaCalulerOPCO: false,
      direction: 'top',
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: 'slide-y-reverse-transition',
      downloadComplet: false,
      infinitLoading: false,
      sendMailDialog: false,
      lienPDFtoSend: '',
      emailpdf: '',
      // configure stripe
      publishableKey: 'pk_test_H3uJJ5mJIOeSAnc3WE20467W00J8k3pPaf',
      token: null,
      loading: false,
      amount: 0,
      charge: null,
      dialogPaye: '',
      emailRules: [
        v => !!v || 'vuiller completer',
        v => /.+@.+/.test(v) || 'E-mail invalide',
      ],
      emailPaiment: '',
      dialogPaimentLoading: false,
      paimentEffectuer: false,
      errorPaiment: '',
      lienFacture: '',
      loadingText: '',
    }),
    computed: {
      activeFab () {
        switch (this.tabs) {
          case 'one': return { class: 'purple', icon: 'account_circle' }
          case 'two': return { class: 'red', icon: 'edit' }
          case 'three': return { class: 'green', icon: 'keyboard_arrow_up' }
          default: return {}
        }
      },
    },

    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 500)

        this.loader = null
      },
      top (val) {
        this.bottom = !val
      },
      right (val) {
        this.left = !val
      },
      bottom (val) {
        this.top = !val
      },
      left (val) {
        this.right = !val
      },
      // dialogPaimentLoading (val) {
      //   if (!val) return
      //   setTimeout(() => (this.dialogPaimentLoading = false), 4000)
      // },
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
          // console.log(this.selectedFiles[i].name)
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
            this.downloadComplet = true
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
          if (this.checkSocieteAlreadyExist(data[i].siren).length === 0) {
            this.getNomSocieteApi(data[i], i)
          }
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
        this.downloadComplet = true
      },
      checkSociete (value) {
        // console.log(value)
        // console.log('nom_entreprise sdfqsssssssssssss')
        // console.log(value.activite)
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
        this.assujjetieTaxeFpc = 'assujjetie_taxe_fpc' in value ? value.assujjetie_taxe_fpc : 'non'
        // this.masseUtiliser = 'masse_salariale_FPC' in value ? value.masse_salariale_FPC : value.masse_salariale_TA
        this.masseUtiliser = value.masse_salariale_TA
        this.masseCDD = 'masse_salariale_CDD' in value ? value.masse_salariale_CDD : 0
        this.masseFPC = 'masse_salariale_FPC' in value ? value.masse_salariale_FPC : 0
        // reinitialise contribution
        this.radios = 'oui'
        this.reinitialiseContribution(value.contribution_legale, value.contribution_cdd)
        this.dejaCalulerOPCO = false

        // reinitialise paiment
        this.token = null
        this.loading = false
        this.amount = 0
        this.charge = null
        this.dialogPaye = ''
        this.emailPaiment = ''
        this.dialogPaimentLoading = false
        this.paimentEffectuer = false
        this.errorPaiment = ''
        this.lienFacture = ''
        // erreur
        if (this.taxeApprentissage === undefined) {
          this.alert = !this.alert
        }
      },
      formatPrice (value) {
        if (value === undefined) {
          return 0
        } else {
          // const val = (value / 1).toFixed(2).replace('.', ',')
          return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        }
      },
      async rowSelect (id, items) {
        this.alert = false
        this.nomSocieteToSet = ''
        this.clickSociete = false
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
          // .catch(error => {
          //   console.log(error)
          // })
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
            // console.log(error)
            if (error) {}
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
        // console.log('mandalo reinitialise')
        this.contributionTotal = 0
        if (isCalcul) {
          this.detailCalcul = [
            { nom_contribution: 'Formation continue', pourcentage: this.effectif >= 11 ? 1 : 0.55, valeur: contributionLegale },
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
            { nom_contribution: 'Formation continue', pourcentage: this.effectif >= 11 ? 1 : 0.55, valeur: contributionLegale },
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
        // console.log(totalAutreContribution)
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
          tva = (this.detailCalcul[0].valeur + this.detailCalcul[1].valeur) * 0.6 * 0.2
          this.detailCalcul.push({
            nom_contribution: 'TVA',
            pourcentage: 20,
            valeur: this.formatPrice(tva.toFixed(2)),
          })
        } else {
          tva = 0
        }

        // console.log(this.opco)
        // console.log(acompte1.toFixed(2))
        // console.log(tva.toFixed(2))
        // console.log(this.contributionCdd)
        // console.log(this.contributionCdd)
        var sousTotal = this.opco + parseFloat(acompte1.toFixed(2)) + parseFloat(tva.toFixed(2)) + this.contributionCdd + this.contributionLegal
        // console.log(sousTotal)
        if (this.dejaVerser !== 0) {
          sousTotal = sousTotal - this.dejaVerser
          this.detailCalcul.push({ nom_contribution: 'Montant déjà verser', pourcentage: 0, valeur: this.formatPrice(this.dejaVerser) })
        }
        // console.log((sousTotal).toFixed(2))
        this.contributionTotal = (sousTotal).toFixed(2)
        this.dejaCalulerOPCO = true
        setTimeout(function () { window.location.hash = '#totalContribution' }, 200)
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
      generatePDF (depuiSendMail) {
        var data = this.counstructData()
        this.loadingText = 'en cours'
        this.dialogPaimentLoading = true
        axios({
          method: 'post',
          // url: 'http://127.0.0.1:8000/apep/generatePDF/',
          url: 'http://sdabou.pythonanywhere.com/apep/generatePDF/',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data,
        }).then(response => {
          // console.log(response.data)
          // axios.get(response.data, { responseType: 'application/pdf' })
          // set pdf generated
          // console.log(data)
          this.data.filter(d => {
            if (d.siren === data.siren) {
              d.lienPDF = response.data
              this.lienPDFtoSend = response.data
              if (depuiSendMail === false) {
                this.openInNewTab(response.data)
                this.dialogPaimentLoading = false
              } else {
                d.pdfCreate = true
              }
            }
          })
          this.infinitLoading = false
          this.overlay = false
        }).catch(error => { if (error) { this.overlay = false } })
      },

      checkSocieteAlreadyExist (siren) {
        // console.log(siren)
        var valiny = this.data.filter(d => { if (d.siren === siren) { return true } else { return false } })
        // console.log(valiny)
        return valiny
      },
      openInNewTab (url) {
        var win = window.open(url, '_blank')
        win.focus()
      },

      generateExcelFile () {
        this.infinitLoading = true
        this.overlay = true
        axios({
          method: 'post',
          // url: 'http://127.0.0.1:8000/apep/generateExcel/',
          url: 'http://sdabou.pythonanywhere.com/apep/generateExcel/',
          data: this.data,
        }).then(response => {
          this.infinitLoading = false
          this.overlay = false
          this.openInNewTab(response.data)
        })
      },

      async modifyMasseSalarialeTA () {
        this.modifMasseSalarialeTA = true
        await this.sleep(200)
        this.$refs.inputmodifMasseSalarialeTA.focus()
      },
      async modifyMasseSalarialeTAFC () {
        this.modifMasseSalarialeTA = true
        await this.sleep(200)
        this.$refs.inputmodifMasseSalarialeTAFC.focus()
      },
      async modifymasseCDD () {
        this.modifmasseCDD = true
        await this.sleep(200)
        this.$refs.inputmodifMSCDD.focus()
      },
      async modifSociete () {
        this.clickSociete = true
        await this.sleep(200)
        this.$refs.nomSocieteToSet.focus()
      },
      recalculerMasseSalariale (e) {
        this.modifMasseSalarialeTA = false
        this.taxeApprentissage = Math.round((this.masseSlarialeTA * 0.68) / 100)
        this.scolaire = Math.round((this.taxeApprentissage * 13) / 100)
        this.opco = Math.round((this.taxeApprentissage * 87) / 100)
        // si dans Formation continue
        var pourcentage = this.effectif >= 11 ? 1 : 0.55
        this.contributionLegal = parseFloat(((this.masseSlarialeTA * pourcentage) / 100).toFixed(2))
        this.detailCalcul[0].valeur = this.contributionLegal
      },
      recalculerMasseSalarialeCDD () {
        this.modifmasseCDD = false
        this.contributionCdd = parseFloat(((this.masseCDD * 1) / 100).toFixed(2))
        this.detailCalcul[1].valeur = this.contributionCdd
      },

      inputmodifSocietModS () {
        if ((this.nomSocieteToSet !== '' && this.nomSociete === null) || (this.nomSocieteToSet !== '' && this.nomSociete !== null)) {
          this.nomSociete = this.nomSocieteToSet
          this.clickSociete = false
        } else if (this.nomSocieteToSet === '' && this.nomSociete !== null) {
          this.clickSociete = false
        }
      },
      sendMailPDF () {
        if (this.emailpdf !== '') {
          this.loadingText = 'Envoi email en cours'
          this.dialogPaimentLoading = true
          this.generatePDF(true)
          axios({
            method: 'post',
            // url: 'http://127.0.0.1:8000/apep/sendEmail/',
            url: 'http://sdabou.pythonanywhere.com/apep/sendEmail/',
            data: {
              email: this.emailpdf,
              url: this.lienPDFtoSend,
              nomSociete: this.nomSociete,
              siren: this.siren,
              siret: this.siret,
            },
          }).then(response => {
            if ('status' in response.data && response.data.status === true) {
              this.dialogPaimentLoading = false
              this.sendMailDialog = false
              // this.infinitLoading = false
              // this.overlay = false
            }
          })
        }
      },
      submit () {
        if (this.emailPaiment !== '') {
          this.loadingText = 'Paiement en cours'
          this.dialogPaimentLoading = true
          this.$refs.elementsRef.submit()
        }
      },
      tokenCreated (token) {
        this.token = token
        // for additional charge objects go to https://stripe.com/docs/api/charges/object
        this.charge = {
          societeName: this.nomSociete,
          siren: this.siren,
          token: token.id,
          source: token.card,
          amount: this.scolaire,
          receipt_email: this.emailPaiment,
        }
        this.sendTokenToServer(this.charge)
      },
      sendTokenToServer (charge) {
        // console.log('lasa serveur')
        axios({
          method: 'post',
          // url: 'http://127.0.0.1:8000/apep/paiment/',
          url: 'http://sdabou.pythonanywhere.com/apep/paiment/',
          data: charge,
        }).then(response => {
          var data = response.data
          if ('status' in data && data.status === 'succeeded') {
            this.lienFacture = data.receipt_url
            this.errorPaiment = ''
            this.paimentEffectuer = true
            this.dialogPaimentLoading = false
            this.data.filter(d => {
              if (d.siren === charge.siren) {
                d.paimentEffectuer = true
              }
            })
          } else if ('errormessage' in data) {
            this.dialogPaimentLoading = false
            this.errorPaiment = data.errormessage
          }
        })
      },
    },
  }
</script>
