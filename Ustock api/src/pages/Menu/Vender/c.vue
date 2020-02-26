<!--                     <q-dialog
                      v-model="medium" persistent
                    >
                      <q-card style="width: 700px; max-width: 80vw;">
                        <q-card-section>
                          <div class="text-h6">Produto</div>
                        </q-card-section>

                        <q-card-section class="q-pt-none">
                          <q-banner class="bg-grey-3">
                            <template v-slot:avatar>
                              <q-icon name="extension" color="primary" />
                            </template>
                            Olá <strong>{{userNow}}</strong> , antes de tudo analise os gráficos. . . em seguida podes realizar as tuas operações!
                            <template v-slot:action>
                              <q-btn to="/buy" color="primary" label="Vender" />
                            </template>
                          </q-banner>
                          <div class="row q-mb-sm q-gutter-xl">

                            <q-input color="primary" v-model="product.key" label="Código" dense  :rules="[val => !!val || 'Obrigatório']" autofocus />

                            <q-input color="primary" v-model="product.name" label="Descrição" dense  :rules="[val => !!val || 'Obrigatório']" />

                            <q-input color="primary" v-model="product.unity" label="Unidade" dense  :rules="[val => !!val || 'Obrigatório']" />
                              
                            <q-input color="primary" v-model="product.quantity" label="Quantidade" type="number" dense :rules="[val => !!val || 'Obrigatório']" />
                            
                            <q-input color="primary" v-model="product.purchase" label="Preço Compra(Kz)" type="number" dense :rules="[val => !!val || 'Obrigatório']" />

                            <q-input color="primary" v-model="product.sale_price" label="Preço Venda(Kz)" type="number" dense  :rules="[val => !!val || 'Obrigatório']" />
                            
                            <q-input color="primary" :rules="[val => !!val || 'Obrigatório']" v-model="product.expiration_date" label="Data de Expiração">
                              <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy>
                                    <q-date v-model="product.expiration_date" />
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>

                            <q-select
                              color="primary"
                              v-model="catergoryOption"
                              :rules="[val => !!val || 'Obrigatório']"
                              use-input
                              input-debounce="0"
                              label="Categoria"
                              :options="options1"
                              @filter="filterFn"
                              style="width: 250px"
                              behavior="menu"
                            >
                              <template v-slot:no-option>
                                <q-item>
                                  <q-item-section class="text-grey">
                                    Não Encontrado!
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>
                          </div>
                        </q-card-section>

                        <q-card-actions align="right" class="text-primary">
                          <q-btn color="warning" label="Cancelar" v-close-popup />
                          <q-btn v-if="editButton ==false" @click="addProduct()" color="primary" label="Cadastrar" />
                          <q-btn v-if="editButton ==true" @click="updateProduct()" color="secondary" label="Actualizar" />
                        </q-card-actions>
                      </q-card>
                    </q-dialog> 
              <div class="q-pa-md">

                  <q-table
                    class="no-border-radius my-sticky-column-table"

                    :data="data"
                    color="info"
                    :columns="columns"
                    :filter="filter"
                    
                    selection="multiple"
                    :selected.sync="selected"
                  >
                    <template v-slot:top>
                     
                    </template>
                  </q-table>
              </div>
              -->