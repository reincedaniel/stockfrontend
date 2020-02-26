<template>
  <q-page class="flex bg-white">
    <div class="full-width">
      <q-tabs
        v-model="tab"
        dense
        align="justify"
        active-color="primary"
        indicator-color="primary"
        narrow-indicator
        class="text-grey"
      >
        <q-tab icon="item" name="itens" label="Categoria" />
        <q-tab icon="fast_food" disable name="estoque" label="" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="itens">
          <div class="q-pa-md">
            <div class="row q-gutter-sm">
              <q-input color="primary" autofocus dense debounce="300" v-model="filter" placeholder="Pesquisar">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn size="xs" color="grey-7" @click="filter = ''" icon="format_clear" />
                            <q-btn size="md" v-if="!Object.keys(selectedCategory).length" round color="info" @click="refresh()" icon="refresh" />
              <q-btn size="xs" v-if="!Object.keys(selectedCategory).length" color="blue-7" to='/proser' icon="web" />
              <q-btn size="md" v-if="!Object.keys(selectedCategory).length" round color="primary" @click="mediumCategory = true" icon="add_box" />
              <q-btn
                v-if="Object.keys(selectedCategory).length && ad==1"
                @click="editCategory()"
                size="md"
                round
                color="warning"
                icon="create"
              />
              <q-btn
                v-if="Object.keys(selectedCategory).length && ad==1"
                @click="deleteCategory()"
                size="md"
                round
                color="negative"
                icon="delete_forever"
              />

            </div>
          </div>
          <q-dialog v-model="mediumCategory" persistent>
            <q-card style="width: 700px; max-width: 80vw;">
              <q-card-section>
                <!-- CATEGORIAS -->
                <div class="text-h6">Categorias</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">
                  <q-input
                  autofocus
                    color="primary"
                    v-model="category.name"
                    label="Descrição"
                    dense
                    :rules="[val => !!val || 'Obrigatório']"
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn color="warning" label="Cancelar" @click="onResetCategory()" v-close-popup />
                <q-btn
                  v-if="editButtonCategory ==false"
                  @click="addCategory()"
                  color="primary"
                  label="Cadastrar"
                />
                <q-btn
                  v-if="editButtonCategory ==true"
                  @click="updateCategory()"
                  color="secondary"
                  label="Actualizar"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="q-pa-md">
            <!-- TABLE CATEGORY -->
            <q-table
              class="no-border-radius my-sticky-column-table"
              :data="dataCategory"
              color="info"
              :columns="columns"
              :filter="filter"
              selection="single"
              :selected.sync="selectedCategory"
            ></q-table>
          </div>
        </q-tab-panel>

        <q-tab-panel v-model="tab" name="estoque">
          <p>Estoque</p>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      tab: "itens",
      model: null,
      ad:localStorage.getItem('level'), 
      options: [],
      options1: [],
      editButtonCategory: false,
      catergoryOption: "",
      listCategories: [],
      mediumCategory: false,
      categoryId: null,
      category: {
        name: null
      },
      filter: "",
      selectedCategory: [],
      columns: [
        {
          name: "name",
          required: true,
          label: "Categoria",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        }
      ],
      data: [],
      dataCategory: []
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    // ********************* Refresh alll store
    refresh() {
      this.$store.commit("category/resetListCategories");
      this.listOfCategories();
    },

    // *************** ADD CATEGORIES
    addCategory() {
      this.$store
        .dispatch("category/addCategories", this.category)
        .then(res => {
          let msm = "",
            clr = "red-4";
          if (res.data.code < 0) {
            this.$store.commit("category/setErrors", res.data);
          } else {
            switch (res.data.code) {
              case 0:
                msm = "Não foi possivel adicionar Categoria!";
                break;

              case 1:
                {
                  clr = "green-4";
                  msm = "Cadastrado Com Sucesso!";
                  this.$store.commit("category/resetListCategories");
                  this.listOfCategories();
                  this.filter = this.category.name
                  this.onResetCategory();
                }
                break;

              case 11:
                msm = "A Categoria já existe!";
                break;

              default:
                msn = "Contacte o Suporte da UCall: +244 936785605!";
                break;
            }
            this.$q.notify({
              color: clr,
              position: "top-right",
              textColor: "white",
              icon: "fas fa-check-circle",
              message: msm
            });
          }
        })
        .catch(err => {
          this.$store.commit("category/setErrors", err);
        });
    },

    //****************DELETE CATEGORIES */
    deleteCategory() {
      this.$q
        .dialog({
          color: "red",
          title: "Apagar",
          message: "Deseja Apagar esta categoria?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          // xxxxx
          this.$store
            .dispatch("category/deleteCategories", this.selectedCategory[0].id)
            .then(res => {
              let msm = "",
                clr = "red-4";
              if (res.data.code < 0) {
                this.$store.commit("category/setErrors", res.data);
              } else {
                switch (res.data.code) {
                  case 0:
                    msm = "Não foi possivel Deletar esta Categoria!";
                    break;

                  case 1:
                    {
                      clr = "green-4";
                      msm = "Categoria Deletada Com Sucesso!";
                      this.$store.commit("category/resetListCategories");
                      this.listOfCategories();
                      this.onResetCategory();
                      this.filter = ''
                    }
                    break;

                  default:
                    msn = "Contacte o Suporte da UCall: +244 936785605!";
                    break;
                }
                this.$q.notify({
                  color: clr,
                  position: "top-right",
                  textColor: "white",
                  icon: "fas fa-check-circle",
                  message: msm
                });
              }
            })
            .catch(err => {
              this.$store.commit("category/setErrors", err);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        });
    },

    //*****************UPDATE C */
    updateCategory() {
      this.$store
        .dispatch("category/updateCategories", {
          id: this.categoryId,
          data: this.category
        })
        .then(res => {
          let msm = "",
            clr = "red-4";
          if (res.data.code < 0) {
            this.$store.commit("category/setErrors", res.data);
          } else {
            switch (res.data.code) {
              case 0:
                msm = "Não foi possivel actualizar a Categoria!";
                break;

              case 1:
                {
                  clr = "green-4";
                  msm = "Actualizado Com Sucesso!";
                  this.$store.commit("category/resetListCategories");
                  this.listOfCategories();
                  this.filter = this.category.name
                  this.onResetCategory();
                  this.editButtonCategory = false;
                  
                }
                break;

              default:
                msn = "Contacte o Suporte da UCall: +244 936785605!";
                break;
            }
            this.$q.notify({
              color: clr,
              position: "top-right",
              textColor: "white",
              icon: "fas fa-check-circle",
              message: msm
            });
          }
        })
        .catch(err => {
          this.$store.commit("category/setErrors", err);
        });
    },

    //*************RESET FORM CATEGORY */
    onResetCategory() {
      this.editButtonCategory = false;
      this.categoryId = null;
      this.category.name = null;
      this.mediumCategory = false;
    },

    // **********************EDIT CATEGORY (SEND VALUES TO FROM CATEGORY)
    editCategory() {
      this.editButtonCategory = true;
      this.mediumCategory = true;
      this.categoryId = this.selectedCategory[0].id;
      this.category.name = this.selectedCategory[0].name;
    },

    // **************************POPULATE TABLE CATEGORY
    listOfCategories() {
      this.$store
        .dispatch("category/listCategories")
        .then(res => {
          res.data.categories.forEach(data => {
            this.$store.commit("category/setListCategories", data);
            this.listCategories = this.$store.getters[
              "category/getListCategories"
            ];
          });

          this.dataCategory = [];
          for (let i in this.listCategories) {
            if (this.listCategories.hasOwnProperty(i)) {
              this.dataCategory.push({
                id: this.listCategories[i].id,
                name: this.listCategories[i].name
              });
            }
          }
        })
        .catch(err => {
          this.$store.commit("category/setErrors", err);
        });
    }
  }
};
</script>

<style lang="sass">
.my-sticky-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
 

  thead tr:first-child th:first-child
    /* bg color is important for th;#9eefff just specify one */
    background-color: #fff

  td:first-child
    background-color: #31CCEC

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

