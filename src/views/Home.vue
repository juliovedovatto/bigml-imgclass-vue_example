<i18n>
{
  "en": {
    "fields": {
      "projectName": {
        "label": "Project Name"
      }
    },
    "buttons": {
      "newProject": "Create new project",
      "cancel": "Cancel",
      "label": "Label",
      "train": "Train",
      "play": "play",
      "allImages": "All images"
    },
    "uploadDescription": "To start training you model, import and label some images.",
    "loadingDescription": "Uploading images to BigML"
  }
}
</i18n>
<template lang="pug">
  v-container
    v-row.container
      v-col
        v-card.outerCard(
          height="680px"
          raised
          class="d-flex"
        )
          v-card.sidebarCard(flat)
            v-text-field(
              v-if="shouldShowProjectTextInput"
              v-model="editingProject"
              outlined
              :label="$t('fields.projectName.label')"
            )
            v-select(
              v-else
              v-model="currentProjectId"
              :items="Object.values(projectList)"
              outlined
              item-value="id"
              item-text="name"
            )
            v-btn.sidebarButton(
              v-if="shouldShowCreateNewProjectButton"
              :disabled="currentProject.status !== 'READY'"
              @click="createNewProject"
              class="white--text primary"
            ) {{ $t('buttons.newProject') }}
            v-btn.sidebarButton(
              v-if="onEditMode"
              @click="disableEditMode"
              :disabled="showLoading"
              class="white--text error"
            ) {{ $t('buttons.cancel') }}
            .sidebarSectionHeader
              v-btn.sidebarButton(
                :class="isStepSelected('label')"
                @click="setCurrentTab('label')"
                style="text-align: left;"
                color="#8C98BF"
                text
              ) {{ $t('buttons.label') }}
              v-btn.sidebarButton(
                :class="isStepSelected('train')"
                @click="setCurrentTab('train')"
                :disabled="currentProject.status !== 'READY' || editMode"
                :loading="currentImageBundle.status === 'READY' && (currentProject.status != null && currentProject.status !== 'READY')"
                color="#8C98BF"
                text
              ) {{ $t('buttons.train') }}
              v-btn.sidebarButton(
                :class="isStepSelected('play')"
                @click="setCurrentTab('play')"
                :disabled="currentProject.status !== 'READY' || editMode"
                color="#8C98BF"
                text
              ) {{ $t('buttons.play') }}
            .sidebarSectionHeader(v-if="hasImages")
              v-btn.sidebarButton(
                :outlined="currentTab !== 'play' && shouldOutlineButton('all')"
                @click="setCurrentFilter('all')"
                color="primary"
                class="white--text"
                :disabled="currentTab === 'play' || editMode"
              ) 
                div(style="width: 100%; padding: 4px;")
                  div {{ $t('buttons.allImages') }}
                  v-progress-linear(
                    v-if="currentProject.status === 'READY'"
                    rounded style="margin-top: 4px;"
                    :value="Math.floor(currentProject.bigml_execution_status.evaluation_details.performance.accuracy * 100)"
                    :color="currentTab !== 'play' && shouldOutlineButton('all') ? 'primary' : 'white'"
                    height="6"
                  )
              v-btn.sidebarButton(
                v-for="label in labels"
                :outlined="(currentTab !== 'play' && !editMode) && shouldOutlineButton(label)"
                @click="setCurrentFilter(label)"
                color="primary"
                class="white--text"
                :disabled="currentTab === 'play' || editMode"
              )
                div(style="width: 100%; padding: 4px;")
                    div {{ label }}
                    v-progress-linear(
                      v-if="currentProject.status === 'READY'"
                      rounded
                      style="margin-top: 4px;"
                      :value="Math.floor(currentProject.bigml_execution_status.evaluation_details.performance_per_class[label].accuracy * 100)"
                      :color="(currentTab !== 'play' && !editMode) && shouldOutlineButton(label) ? 'primary' : 'white'"
                      height="6"
                    )
          v-card.contentCard(outlined)
            .uploadTabContainer(v-show="shouldShowTab('label')")
              div(v-if="hasImages && !editMode")
                div.d-flex.flex-column(v-for="img in filteredImages" )
                  h2 {{ img.label }}
                  div.d-flex
                    .imageContainer(v-for="img, index in img.data")
                      v-img.image(
                        lazy-src
                        :src="img.file"
                        max-width="250"
                        max-height="250"
                      )
                        .accuracy(style="background-color: rgba(0,0,0,.5)") {{ img.label }}
              .descriptionContainer(v-if="shouldShowDropzone")
                .description {{ $t('uploadDescription') }}
              vue-dropzone.drop(
                v-show="shouldShowDropzone"
                :options="dropzoneOptions"
                @vdropzone-file-added="createProjectAndUploadFiles"
                @vdropzone-drop="showLoading = true"
                id="dropzone"
                ref="myVueDropzone"
              )
              .loadingSection(
                v-if="showLoading && currentImageBundle.status !== 'READY'"
                class="d-flex justify-center align-center flex-column"
              )
                .loadingDescription {{ $t('loadingDescription') }}
                v-progress-circular(
                  indeterminate
                  color="primary"
                  size="100" width="10"
                )
            .accuracyTabContainer(v-show="shouldShowTab('train')")
              div(v-if="hasImages")
                div.d-flex.flex-column(v-if="correctImages.length > 0")
                  h2 Correct
                  div.d-flex
                    .imageContainer(v-for="img, index in correctImages")
                      v-img.image(
                        lazy-src
                        :src="img.file"
                        max-width="250"
                        max-height="250"
                      )
                        .accuracy( :style="`background: linear-gradient(90deg, rgba(168, 201, 16, 1) ${Math.floor(img.label_probability * 100)}%, rgba(168, 201, 16, .6) ${Math.floor(img.label_probability * 100)}%);`" ) {{ img.predicted_label }}
                div.d-flex.flex-column(v-if="incorrectImages.length > 0")
                  h2 Incorrect
                  div.d-flex
                    .imageContainer(v-for="img, index in incorrectImages")
                      v-img.image(
                        lazy-src
                        :src="img.file"
                        max-width="250"
                        max-height="250"
                      )
                        .accuracy( :style="`background: linear-gradient(90deg, rgba(239, 83, 80, 1) ${Math.floor(img.label_probability * 100)}%, rgba(239, 83, 80, .6) ${Math.floor(img.label_probability * 100)}%);`") {{ img.predicted_label }}
            .accuracyTabContainer(v-show="shouldShowTab('play')")
              div(style="width: 100%; height: 100%;")
                div(style="width: 100%; height: 100%;")
                  v-img.image(
                    lazy-src
                    :src="playedImages[0]"
                    contains
                    max-width="250"
                    max-height="250"
                  )
                div
                  v-sheet(max-width="700")
                    v-slide-group(
                      multiple
                      show-arrows="desktop"
                    )
                      v-slide-item(
                        v-for="img in playedImages"
                        v-slot="{ active, toggle }"
                      )
                        v-img.ma-4(
                          lazy-src
                          :src="img"
                          contains
                          max-width="250"
                          max-height="250"
                        )
</template>

<script>
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

import { mapGetters } from 'vuex'
import vue2Dropzone from 'vue2-dropzone'

export default {
  name: 'Home',
  components: {
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
      dropzoneOptions: {
        language: { dictDefaultMessage: 'Its me Mario' },
        url: 'https://httpbin.org/post',
        autoProcessQueue: false,
        maxFiles: 1
      },
      currentProjectId: '',
      editMode: false,
      currentTab: 'label',
      currentFilter: 'all',
      editingProject: 'Untitled',
      currentProgress: null,
      showLoading: false,
      projects: [
        // {
        //   text: '',
        //   id: '',
        // }
      ],
      images: [],
      playedImages: [
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
        'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg'
      ]
    }
  },
  computed: {
    ...mapGetters('project', ['projectList', 'currentProject', 'currentImages', 'currentImageBundle']),
    shouldShowDropzone() {
      if (this.showLoading) return false
      if (this.editMode || Object.values(this.projectList).length === 0) return true
      return true
    },
    onEditMode() {
      return this.editMode === true
    },
    hasImages() {
      return Object.values(this.currentImages).length > 0
    },
    shouldShowProjectTextInput() {
      return this.onEditMode || Object.values(this.projectList).length === 0
    },
    shouldShowCreateNewProjectButton() {
      return Object.values(this.projectList).length > 0 && this.editMode === false
    },
    shouldShowUploadTabDescription() {
      return Object.values(this.projectList).length === 0 && !this.showLoading
    },
    labels() {
      return [...new Set(Object.values(this.currentImages).map(({ label }) => label))]
    },
    filteredImages() {
      const imagesByLabels = []
      this.labels.map(label =>
        imagesByLabels.push({ label, data: Object.values(this.currentImages).filter(image => image.label === label) })
      )
      if (this.currentFilter === 'all') {
        return imagesByLabels
      }
      return imagesByLabels.filter(img => img.label === this.currentFilter)
    },
    correctImages() {
      return Object.values(this.currentImages).filter(image => image.label === image.predicted_label)
    },
    incorrectImages() {
      return Object.values(this.currentImages).filter(image => image.label !== image.predicted_label)
    }
  },
  watch: {
    currentProjectId(id) {
      this.$store.dispatch('project/setCurrentProject', { id })
    }
  },
  created() {
    this.listProjects()
  },
  methods: {
    disableEditMode() {
      const [[, { id }]] = Object.entries(this.projectList)
      this.$store.dispatch('project/setCurrentProject', { id })
      this.editingProject = 'Untitled'
      this.editMode = false
    },
    isStepSelected(step) {
      return this.currentTab === step ? 'stepSelected' : ''
    },
    setCurrentTab(tab) {
      this.currentTab = tab
    },
    setCurrentFilter(filter) {
      this.currentFilter = filter
    },
    shouldOutlineButton(filter) {
      return this.currentFilter !== filter
    },
    shouldShowTab(tab) {
      return this.currentTab === tab
    },
    formatCurrentProgress(progress) {
      return `${Math.floor(progress)}%`
    },
    async listProjects() {
      await this.$store.dispatch('project/listProjects')
      if (Object.values(this.projectList).length > 0) {
        const [[, { id }]] = Object.entries(this.projectList)
        this.currentProjectId = id
      }
    },
    async createProjectAndUploadFiles(file) {
      this.$store.dispatch('project/clear')
      console.log('Create the project', { file, projectName: this.editingProject })
      const { id: projectId } = await this.$store.dispatch('project/create', { name: this.editingProject })
      this.currentProjectId = projectId
      this.editMode = false
      console.log('Create the Image Bundle', { file, projectId })
      const { id: bundleId } = await this.$store.dispatch('project/createImageBundle', {
        id: projectId,
        file
      })
      console.log('Start pooling the bundle so we know when its ready to show the images', { bundleId })
      this.$store.dispatch('project/pollImageBundle', { bundleId, projectId })
    },
    injectImages() {
      this.images.push(
        {
          label: 'Biden',
          data: [
            'data:image/jpeg;base64,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',
            'data:image/jpeg;base64,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',
            'data:image/jpeg;base64,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',
            'data:image/jpeg;base64,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',
            'data:image/jpeg;base64,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',
            'data:image/jpeg;base64,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'
          ]
        },
        {
          label: 'Trump',
          data: [
            'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
            'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
            'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
            'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
            'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg',
            'https://conteudo.imguol.com.br/c/noticias/41/2020/11/03/31out2020---presidente-norte-americano-donald-trump-participa-de-comicio-pela-sua-campanha-de-reeleicao-em-montoursville-pensilvania-1604442752412_v2_450x337.jpg'
          ]
        }
      )
    },
    createNewProject() {
      this.$refs.myVueDropzone.removeAllFiles()
      this.editMode = true
      this.currentTab = 'label'
      this.showLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;

  .outerCard {
    padding: 16px;
    background-color: #f7f7f7;

    .sidebarCard {
      padding: 8px;
      margin-right: 20px;
      min-width: 250px;
      max-width: 250px;
      background-color: #f7f7f7;

      .sidebarButton {
        width: 100%;
        margin-bottom: 8px;
        text-align: left;
        justify-content: left !important;
      }

      .stepSelected {
        box-shadow: -5px 0px 0px 0px #8c98bf, 5px 0px 0px 0px #8c98bf;
        background-color: rgba(140, 152, 191, 0.2);
        font-weight: bold;
      }

      .sidebarSectionHeader {
        font-weight: bold;
        margin-top: 18px;

        .sidebarTitle {
          margin-bottom: 18px;
        }
      }
    }

    .contentCard {
      padding: 8px;
      width: 100%;
      overflow-y: scroll;

      .uploadTabContainer {
        height: 100%;

        .image {
          border-radius: 10px;
          margin-right: 12px;
          margin-bottom: 12px;
        }

        .descriptionContainer {
          font-size: 18px;
          text-align: center;

          .description {
            padding-top: 68px;
            padding-bottom: 20px;
          }
        }

        .drop {
          margin: 0px 20px;
        }

        .loadingSection {
          height: 100%;

          .loadingDescription {
            margin-bottom: 20px;
          }
        }
      }
    }
  }

  .imageContainer {
    position: relative;

    .image {
      border-radius: 10px;
      margin-right: 12px;
      margin-bottom: 12px;
    }

    .accuracy {
      position: absolute;
      bottom: 10px;
      color: white;
      right: 20px;
      padding: 4px;
      border-radius: 10px;
      min-width: 50px;
      text-align: center;
      -webkit-text-stroke: 0.4px $brand-light-grey;
    }
  }
}
</style>
