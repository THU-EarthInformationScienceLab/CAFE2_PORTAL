<template>
  <el-dialog
    title="Create Task"
    :visible.sync="dialogVisible"
    width="750px"
    :before-close="handleClose"
  >
    <div>
      <el-form
        size="small"
        label-width="100px"
        ref="taskFrom"
        :model="taskForm"
        :rules="rules"
      >
        <el-form-item label="task name" prop="taskName">
          <el-input
            placeholder="please enter task name"
            v-model="taskForm.taskName"
          ></el-input>
        </el-form-item>
        <el-form-item label="start age" prop="temporalStart">
          <el-select v-model="taskForm.temporalStart">
            <el-option
              v-for="age in startAgeOptions"
              :value="age + '01'"
              :key="age"
              :label="age"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="end age" prop="temporalEnd">
          <el-select v-model="taskForm.temporalEnd">
            <el-option
              v-for="age in endAgeOptions"
              :value="age + '12'"
              :key="age"
              :label="age"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="function" prop="name">
          <el-select v-model="taskForm.name" style="width: 400px">
            <el-option
              v-for="(funcName, func) in functionOptions"
              :value="func"
              :key="func"
              :label="funcName"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="geo-extent-form-item"
          prop="extent"
          label="geo extent"
        >
          <div class="map-container">
            <el-alert
              class="absolute-alert"
              v-if="!extentRectangle"
              title="click on map to draw a boundingbox rectangle"
              type="warning"
              :closable="false"
            >
            </el-alert>
            <el-alert
              class="absolute-alert"
              v-if="extentRectangle"
              title="select and click rectangle vertex to change boundingbox size"
              type="warning"
              :closable="false"
            >
            </el-alert>
            <div class="map" ref="mapContainer"></div>
          </div>
          <div class="extent-wrapper">
            <el-input-number
              class="extent-input"
              controls-position="right"
              placeholder="min lon"
              :min="-180"
              :max="taskForm.extent[2]"
              :step="0.01"
              v-model="taskForm.extent[0]"
              @change="handleExtentUpdate"
            ></el-input-number>
            <el-input-number
              class="extent-input"
              controls-position="right"
              placeholder="min lat"
              :min="-90"
              :max="taskForm.extent[3]"
              :step="0.01"
              v-model="taskForm.extent[1]"
              @change="handleExtentUpdate"
            ></el-input-number>
            <el-divider direction="vertical"></el-divider>
            <el-input-number
              style="margin-left: 5px"
              class="extent-input"
              controls-position="right"
              placeholder="max lon"
              :min="taskForm.extent[0]"
              :max="180"
              :step="0.01"
              v-model="taskForm.extent[2]"
              @change="handleExtentUpdate"
            ></el-input-number>
            <el-input-number
              class="extent-input"
              controls-position="right"
              placeholder="max lat"
              :step="0.01"
              :min="taskForm.extent[1]"
              :max="90"
              v-model="taskForm.extent[3]"
              @change="handleExtentUpdate"
            ></el-input-number>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Create Task</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import MapboxDrawRectangle from '../lib/mapbox_draw_rectangle'
import RectangleDirectMode from '../lib/rectangle_direct_override'
import { cafeClient } from '../clients'
import { FUNCTION_DICT } from '../constants'

const getYearOptionsFromRange = (start, end) => {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i.toString())
  }
  return result
}
const DEFAULT_AGE_RANGE = [1950, 2014]
let mapboxgl
export default {
  name: 'CreateTaskModal',
  props: {
    visible: Boolean,
    models: Array,
  },
  data() {
    return {
      selected: [],
      loading: false,
      dialogVisible: false,
      taskForm: { extent: [] },
      functionOptions: FUNCTION_DICT,
      extentRectangle: null,
      rules: {
        taskName: [
          { required: true, message: 'please enter', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: 'can only be at 2 to 20 chars',
            trigger: 'blur',
          },
        ],
        temporalStart: [
          { required: true, message: 'please select', trigger: 'blur' },
        ],
        temporalEnd: [
          { required: true, message: 'please select', trigger: 'blur' },
        ],
        name: [{ required: true, message: 'please select', trigger: 'blur' }],
        extent: [{ required: true, message: 'please enter', trigger: 'blur' }],
      },
    }
  },
  beforeMount() {
    import('mapbox-gl').then(({ default: mbgl }) => {
      mbgl.accessToken =
        'pk.eyJ1IjoibGl0dGxldmVnZSIsImEiOiJjazk2dG9zcjMwYm9nM2Z0Y2U1N29wY21oIn0.nPWaQWMNogzmq6ENffgmwQ'
      mapboxgl = mbgl
    })
  },
  computed: {
    startAgeOptions() {
      const { endAge } = this.taskForm
      return getYearOptionsFromRange(
        DEFAULT_AGE_RANGE[0],
        endAge ? Number(endAge) : DEFAULT_AGE_RANGE[1],
      )
    },
    endAgeOptions() {
      const { startAge } = this.taskForm
      return getYearOptionsFromRange(
        startAge ? Number(startAge) : DEFAULT_AGE_RANGE[0],
        DEFAULT_AGE_RANGE[1],
      )
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.onShow()
      } else {
        this.onHide()
      }
      this.dialogVisible = value
    },
    dialogVisible(value) {
      this.$emit('update:visible', value)
    },
  },
  mounted() {},
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.$refs.taskFrom.resetFields()
    },
    handleSubmit() {
      this.$refs.taskFrom.validate(valid => {
        if (!valid) {
          return this.$message.error('form check error, please check again!')
        }
        const models = this.models
        const taskForm = this.taskForm
        this.loading = true
        cafeClient
          .createTask(this.convertFormContent(models, taskForm))
          .then(() => {
            this.$message.success('create task success!')
            this.dialogVisible = false
          })
          .catch(e => this.$message.error(`create task error: ${e.message}`))
          .finally(() => {
            this.loading = false
          })
      })
    },
    convertFormContent(
      models,
      { taskName, temporalStart, temporalEnd, name, extent },
    ) {
      return {
        models,
        nclScript: {
          taskName,
          temporalStart,
          temporalEnd,
          name,
          lonMin: extent[0],
          latMin: extent[1],
          lonMax: extent[2],
          latMax: extent[3],
        },
      }
    },
    onShow() {
      this.initMap()
    },
    handleExtentUpdate() {
      const value = this.taskForm.extent
      if (value && value.filter(i => typeof i === 'number').length === 4) {
        if (!this.extentRectangle) {
          this.createRectangleFromExtent(value)
        } else {
          this.updateRectangleFromExtent(value)
        }
      }
    },
    onHide() {},
    /**
     *
     * @param extent [min_lng, min_lat, max_lng, max_lat]
     *  3 (min_lng, max_lat) ------- 2 (max_lng, max_lat)
     *    |                              |
     *    |                              |
     *    |                              |
     *  0 (min_lng, min_lat) ------- 1 (max_lng, min_lat)
     */
    createRectangleFromExtent(extent) {
      const box = {
        type: 'Feature',
        properties: { isRectangle: true },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [extent[0], extent[1]],
              [extent[2], extent[1]],
              [extent[2], extent[3]],
              [extent[0], extent[3]],
              [extent[0], extent[1]],
            ],
          ],
        },
      }
      this.draw.set({
        type: 'FeatureCollection',
        features: [box],
      })

      this.map.fitBounds(
        [
          [extent[0], extent[1]],
          [extent[2], extent[3]],
        ],
        { padding: 30 },
      )
    },
    updateRectangleFromExtent(extent) {
      const f = this.draw.get(this.extentRectangle.id)
      f.geometry.coordinates = [
        [
          [extent[0], extent[1]],
          [extent[2], extent[1]],
          [extent[2], extent[3]],
          [extent[0], extent[3]],
          [extent[0], extent[1]],
        ],
      ]
      console.log(f)
      this.draw.set({
        type: 'FeatureCollection',
        features: [f],
      })
      this.map.fitBounds(
        [
          [extent[0], extent[1]],
          [extent[2], extent[3]],
        ],
        { padding: 30 },
      )
    },
    getExtentFromFeature(feature) {
      const bounds = new mapboxgl.LngLatBounds()
      feature.geometry.coordinates[0].forEach(item => {
        bounds.extend(item)
      })
      const min = bounds.getSouthWest()
      const max = bounds.getNorthEast()
      console.log(feature, bounds, min, max)
      return [min.lng, min.lat, max.lng, max.lat]
    },
    initMap() {
      this.$nextTick(() => {
        console.log(this.$refs.mapContainer)
        this.map = new mapboxgl.Map({
          container: this.$refs.mapContainer,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [116.4, 39.9],
          zoom: 2,
        })
        const modes = MapboxDraw.modes
        modes.draw_rectangle = MapboxDrawRectangle
        modes.direct_select = RectangleDirectMode
        const draw = new MapboxDraw({
          modes,
          displayControlsDefault: false,
          controls: {
            trash: false,
          },
        })
        this.draw = draw
        this.map.addControl(draw)
        draw.changeMode('draw_rectangle')
        this.map
          .on('draw.create', ({ features }) => {
            const f = features[0]
            this.extentRectangle = f
            this.taskForm.extent = this.getExtentFromFeature(f)
            this.taskForm = { ...this.taskForm }
          })
          .on('draw.update', ({ features }) => {
            const f = features[0]
            this.taskForm.extent = this.getExtentFromFeature(f)
            this.taskForm = { ...this.taskForm }
          })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
}
.map {
  height: 400px;
}
.absolute-alert {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 10;
  width: 480px;
  opacity: 0.85;
  line-height: 18px;
}
.extent-input {
  margin-right: 5px;
}
.extent-wrapper {
  margin-top: 5px;
}
</style>
