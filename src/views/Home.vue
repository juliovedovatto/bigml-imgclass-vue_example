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
    "loadingDescription": "Uploading images to BigML",
    "noImagesWithLabel": "No images predicted with the ",
    "noCorrectImages": "No images correctly predicted.",
    "noIncorrectImages": "No images incorrectly predicted.",
    "label": "label",
    "correct": "Correct",
    "incorrect": "Incorrect"
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
              ) 
                .d-flex(class="justify-center align-center" style="width: 100%")
                  .d-flex(class="align-center" style="flex: 1") 
                    v-icon(style="margin-right: 4px;") mdi-square-edit-outline
                    | {{ $t('buttons.label') }}
                  v-progress-circular(
                    indeterminate
                    color="#8C98BF"
                    size="24"
                    width="2"
                    v-if="showLoading && currentImageBundle.status !== 'UPLOADING_TO_BIGML'"
                  )
              v-btn.sidebarButton(
                :class="isStepSelected('train')"
                @click="setCurrentTab('train')"
                :disabled="currentProject.status !== 'READY' || editMode"
                color="#8C98BF"
                text
              )
                .d-flex(class="justify-center align-center" style="width: 100%")
                  .d-flex(class="align-center" style="flex: 1") 
                    v-icon(style="margin-right: 4px;") mdi-checkbox-marked-outline
                    | {{ $t('buttons.train') }}
                  v-progress-circular(
                    indeterminate
                    color="#8C98BF"
                    size="24"
                    width="2"
                    v-if="currentImageBundle.status === 'UPLOADING_TO_BIGML' && (currentProject.status != null && currentProject.status !== 'READY')"
                  )
              v-btn.sidebarButton(
                :class="isStepSelected('play')"
                @click="setCurrentTab('play')"
                :disabled="currentProject.status !== 'READY' || editMode"
                color="#8C98BF"
                text
              )
                .d-flex(class="justify-center align-center" style="width: 100%")
                  .d-flex(class="align-center" style="flex: 1") 
                    v-icon(style="margin-right: 4px;") mdi-creation
                    | {{ $t('buttons.play') }}
                  //- v-progress-circular(
                  //-   indeterminate
                  //-   color="#8C98BF"
                  //-   v-if="currentImageBundle.status === 'UPLOADING_TO_BIGML' && (currentProject.status != null && currentProject.status !== 'READY')"
                  //- )
            .sidebarSectionHeader(v-if="hasImages" style="max-height: 200px; min-height: 200px;")
              v-btn.sidebarButton(
                :outlined="!editMode && shouldOutlineButton('all')"
                @click="setCurrentFilter('all')"
                color="primary"
                class="white--text"
                :disabled="editMode"
              ) 
                div(style="width: 100%; padding: 4px;")
                  .d-flex(class="align-center" style="width: 100%")
                    div(style="flex: 1") {{ $t('buttons.allImages') }}
                    div {{ getAllLabelNumber() }}
                  v-progress-linear(
                    v-if="currentProject.status === 'READY'"
                    rounded
                    style="margin-top: 4px;"
                    :value="getAllLabelAccuracy()"
                    :color="shouldOutlineButton('all') ? 'primary' : 'white'"
                    height="6"
                  )
              v-btn.sidebarButton(
                v-for="label in labels"
                :outlined="!editMode && shouldOutlineButton(label)"
                style="text-transform: capitalize;"
                @click="setCurrentFilter(label)"
                color="primary"
                class="white--text"
                :disabled="editMode"
              )
                div(style="width: 100%; padding: 4px;")
                    .d-flex(class="align-center" style="width: 100%")
                      div(style="flex: 1") {{ label }}
                      div {{ getLabelNumber(label) }}
                    v-progress-linear(
                      v-if="currentProject.status === 'READY'"
                      rounded
                      style="margin-top: 4px;"
                      :value="getLabelAccuracy(label)"
                      :color="!editMode && shouldOutlineButton(label) ? 'primary' : 'white'"
                      height="6"
                    )
            .sidebarSectionHeader
              div(style="font-size: 20px; color: #7B8290;" v-html="getSidebarText()")
          v-card.contentCard(outlined)
            .uploadTabContainer(v-show="shouldShowTab('label')")
              div(v-if="hasImages && !editMode")
                div.d-flex.flex-column(v-for="img in filteredImages" )
                  h2(style="text-transform: capitalize") {{ img.label }}
                  div.d-flex
                    .imageContainer(v-for="img, index in img.data")
                      v-img.image(
                        lazy-src
                        :src="img.file"
                        max-width="250"
                        min-height="200"
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
                v-if="showLoading && currentImageBundle.status !== 'UPLOADING_TO_BIGML'"
                class="d-flex justify-center align-center flex-column"
              )
                .loadingDescription {{ $t('loadingDescription') }}
                v-progress-circular(
                  indeterminate
                  color="primary"
                  size="100" width="10"
                )
            .accuracyTabContainer(v-show="shouldShowTab('train')")
              div(v-if="hasImages" style="height: 100%")
                div.d-flex.flex-column()
                  h2 {{ $t('correct') }}
                  div.d-flex(v-if="correctImages.length > 0")
                    .imageContainer(v-for="img, index in correctImages")
                      v-img.image(
                        lazy-src
                        :src="img.file"
                        max-width="250"
                        min-height="200"
                        max-height="250"
                      )
                        .accuracy( :style="`background: linear-gradient(90deg, rgba(168, 201, 16, 1) ${Math.floor(img.label_probability * 100)}%, rgba(168, 201, 16, .6) ${Math.floor(img.label_probability * 100)}%);`" ) {{ img.predicted_label }}
                  .d-flex(v-else class="justify-center align-center" style="height: 100%")
                    v-alert(color="primary" outlined v-if="currentFilter !== 'all'") {{ $t('noImagesWithLabel')}}
                      span(style="font-weight: bold; text-decoration: underline;") {{ currentFilter }}
                      |  {{ $t('label') }}
                    v-alert(color="primary" outlined v-else) {{ $t('noCorrectImages') }}
                div.d-flex.flex-column()
                  h2 {{ $t('incorrect') }}
                  div.d-flex(style="height: 100%" v-if="incorrectImages.length > 0")
                    .imageContainer(v-for="img, index in incorrectImages")
                      v-img.image(
                        lazy-src
                        :src="img.file"
                        max-width="250"
                        min-height="200"
                        max-height="250"
                      )
                        .accuracy( :style="`background: linear-gradient(90deg, rgba(239, 83, 80, 1) ${Math.floor(img.label_probability * 100)}%, rgba(239, 83, 80, .6) ${Math.floor(img.label_probability * 100)}%);`") {{ img.predicted_label }}
                  .d-flex(v-else class="justify-center align-center" style="height: 100%")
                    v-alert(color="primary" outlined v-if="currentFilter !== 'all'") {{ $t('noImagesWithLabel')}}
                      span(style="font-weight: bold; text-decoration: underline;") {{ currentFilter }}
                      |  {{ $t('label') }}
                    v-alert(color="primary" outlined v-else) {{ $t('noIncorrectImages') }}
            .accuracyTabContainer(v-show="shouldShowTab('play')")
              div(style="width: 100%; height: 100%;" v-show="!showPredictLoading && Object.keys(currentPredictedImage).length === 0")
                div(style="width: 100%; height: 100%;")
                  .d-flex(class="justify-center align-center" style="margin-top: 60px; margin-bottom: 20px;")
                    h2 Select an image to predict
                  vue-dropzone.drop(
                    :options="dropzoneOptions"
                    @vdropzone-file-added="uploadImageToPredict"
                    @vdropzone-drop="showPredictLoading = true"
                    id="predictDropzone"
                    ref="myPredictVueDropzone"
                  )
              div(
                style="height: 100%"
                v-if="currentPredictedImage.status !== 'UPLOADING_TO_BIGML' && showPredictLoading"
                class="d-flex justify-center align-center flex-column"
              )
                div(style="margin-bottom: 20px;") {{ $t('loadingDescription') }}
                v-progress-circular(
                  indeterminate
                  color="primary"
                  size="100" width="10"
                )
              .d-flex(
                style="width: 100%"
                class="justify-center align-center"
                v-show="currentPredictedImage.status  === 'READY'"
              )
                v-img(
                  lazy-src
                  :src="currentPredictedImage.file"
                  max-width="500"
                  min-height="200"
                  max-height="500"
                )
              .d-flex(
                class="justify-center align center"
                style="height: 100%; width: 100%; overflow-y: scroll"
                v-show="Object.values(currentPredictedImageList).length > 0"
              )
                v-img(
                  v-for="img in Object.values(currentPredictedImageList)"
                  lazy-src
                  :src="img.file"
                  max-width="250"
                  min-height="200"
                  max-height="250"
                  @click="currentPredictedImageIdFromList = img.id"
                )
                //-   v-img.image(
                //-     lazy-src
                //-     :src="playedImages[0]"
                //-     contains
                //-     max-width="250"
                //-     max-height="250"
                //-   )
                //- div
                //-   v-sheet(max-width="700")
                //-     v-slide-group(
                //-       multiple
                //-       show-arrows="desktop"
                //-     )
                //-       v-slide-item(
                //-         v-for="img in playedImages"
                //-         v-slot="{ active, toggle }"
                //-       )
                //-         v-img.ma-4(
                //-           lazy-src
                //-           :src="img"
                //-           contains
                //-           max-width="250"
                //-           max-height="250"
                //-         )
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
      currentPredictedImageIdFromList: '',
      editMode: false,
      currentTab: 'label',
      currentFilter: 'all',
      editingProject: 'Untitled',
      showLoading: false,
      showPredictLoading: false
    }
  },
  computed: {
    ...mapGetters('project', [
      'projectList',
      'currentProject',
      'currentImages',
      'currentImageBundle',
      'currentPredictedImage',
      'currentPredictedImageList'
    ]),
    shouldShowDropzone() {
      if (this.showLoading) return false
      if (this.editMode || Object.values(this.projectList).length === 0) return true
      if (!this.editMode) return false
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
      const imagesByLabels = Object.values(this.currentImages).filter(image => image.label === image.predicted_label)
      if (this.currentFilter === 'all') {
        return imagesByLabels
      }
      return imagesByLabels.filter(img => img.predicted_label === this.currentFilter)
    },
    incorrectImages() {
      const imagesByLabels = Object.values(this.currentImages).filter(image => image.label !== image.predicted_label)
      if (this.currentFilter === 'all') {
        return imagesByLabels
      }
      return imagesByLabels.filter(img => img.predicted_label === this.currentFilter)
    }
  },
  watch: {
    currentProjectId(id) {
      this.$store.dispatch('project/setCurrentProject', { id })
    },
    currentPredictedImageIdFromList(id) {
      this.$store.dispatch('project/setCurrentPredictedImageFromList', { id })
    },
    currentPredictedImage(newVal) {
      console.log('Watch', { newVal })
      if (newVal.status === 'ERROR') {
        this.$refs.myPredictVueDropzone.removeAllFiles()
        this.$store.dispatch('project/clearCurrentPredictedImage')
        this.showPredictLoading = false
      }
    }
  },
  created() {
    this.listProjects()
  },
  methods: {
    getSidebarText() {
      const { currentTab } = this
      if ((currentTab === 'label' && Object.values(this.currentImages).length === 0) || this.editMode) {
        return '<span style="color: #82A11D;">5</span> images per label needed to start training.'
      }
      if (this.currentProject.status === 'READY' && Object.values(this.currentImages).length) {
        const { currentImages } = this
        const totalImages = Object.values(currentImages).length
        const totalCorrectImages = Object.values(currentImages).filter(image => image.label === image.predicted_label)
          .length
        const totalIncorrectImages = Object.values(currentImages).filter(image => image.label !== image.predicted_label)
          .length

        if (totalCorrectImages === totalImages) {
          return `
            <div>
              <span style="color: #82A11D;">100%</span> of images are predicted correctly
            </div>
          `
        }

        if (totalImages === totalIncorrectImages) {
          return `
            <div>
              <span style="color: #FB3F17;">100%</span> of images are predicted incorrectly
            </div>
          `
        }

        const totalCorrectImagesAsPercentage = Math.floor((totalCorrectImages * 100) / totalImages)
        const totalIncorrectImagesAsPercentage = Math.floor((totalIncorrectImages * 100) / totalImages)

        return `
        <div>
          <span style="color: #82A11D;">${totalCorrectImagesAsPercentage}%</span> of images are predicted correctly
        </div>
        <div>
          <span style="color: #FB3F17">${totalIncorrectImagesAsPercentage}%</span> of images are predicted incorrectly
        </div>
        `
      }
    },
    getAllLabelNumber() {
      const { currentImages, currentTab } = this
      const totalImages = Object.values(currentImages).length
      if (currentTab === 'label') {
        return Object.values(currentImages).length
      }
      if (currentTab === 'train' || currentTab === 'play') {
        const totalCorrectImages = Object.values(currentImages).filter(image => image.label === image.predicted_label)
          .length
        console.log('label', { totalCorrectImages, totalImages })
        return `${Math.floor((totalCorrectImages * 100) / totalImages)}%`
      }
    },
    getLabelNumber(label) {
      const totalImagesWithLabel = Object.values(this.currentImages).filter(img => img.label === label).length
      const totalCorrectImages = Object.values(this.currentImages).filter(
        img => img.label === label && img.predicted_label === label
      ).length
      if (this.currentTab === 'label') {
        return totalImagesWithLabel
      }
      if (this.currentTab === 'train' || this.currentTab === 'play') {
        return `${Math.floor((totalCorrectImages * 100) / totalImagesWithLabel)}%`
      }
    },
    getAllLabelAccuracy() {
      const { currentImages, currentTab } = this
      const totalImages = Object.values(currentImages).length
      if (currentTab === 'label') {
        return 100
      }
      if (currentTab === 'train' || currentTab === 'play') {
        const totalCorrectImages = Object.values(currentImages).filter(image => image.label === image.predicted_label)
          .length
        console.log('label', { totalCorrectImages, totalImages })
        return Math.floor((totalCorrectImages * 100) / totalImages)
      }
    },
    getLabelAccuracy(label) {
      const { currentTab, currentImages } = this
      const totalImagesWithLabel = Object.values(currentImages).filter(img => img.label === label).length
      const totalImages = Object.values(currentImages).length
      if (currentTab === 'label') {
        return (totalImagesWithLabel * 100) / totalImages
      }
      if (currentTab === 'train' || currentTab === 'progress') {
        const totalCorrectImages = Object.values(currentImages).filter(
          img => img.label === label && img.predicted_label === label
        ).length
        return Math.floor((totalCorrectImages * 100) / totalImagesWithLabel)
      }
    },
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
    async uploadImageToPredict(file) {
      this.$store.dispatch('project/clearPredictedImages')
      const projectId = this.currentProject.id
      console.log('Predict the image', { file, projectId })
      const { id } = await this.$store.dispatch('project/predictImage', { file, id: projectId })
      console.log('Start polling the predicted image to show when ready', { id, projectId })
      await this.$store.dispatch('project/pollPredictedImage', { id, projectId })
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
        overflow-y: scroll;

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

      .accuracyTabContainer {
        height: 100%;
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
