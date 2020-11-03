<template>
  <div class="wrapper">
    <h2>
      <el-button
        size="small"
        class="back-btn"
        icon="el-icon-arrow-left"
        @click="goBack"
      ></el-button>
      {{ taskInfo.taskName }}
    </h2>
    <el-card class="content">
      <el-row :gutter="20">
        <el-col :span="18">
          <h3>Task Info</h3>
          <div class="content-list">
            <div class="item">
              <label>status</label>
              <div class="item-content">
                <el-popover
                  v-if="taskInfo.status === 'failed'"
                  trigger="hover"
                  :content="taskInfo.failureCause"
                  placement="right"
                >
                  <el-tag slot="reference" :type="statusTagType">{{
                    taskInfo.status
                  }}</el-tag>
                </el-popover>
                <el-tag v-else :type="statusTagType">{{
                  taskInfo.status
                }}</el-tag>
              </div>
            </div>
            <div class="item">
              <label>create time</label>
              <div class="item-content">
                {{ taskInfo.createTime }}
              </div>
            </div>
            <div class="item">
              <label>update time</label>
              <div class="item-content">
                {{ taskInfo.updateTime }}
              </div>
            </div>
            <div class="item">
              <label>task params</label>
              <div class="item-content">
                <TaskParamVisual :content="taskInfo.params" class="params" />
              </div>
            </div>
            <div class="item">
              <label>progress</label>
              <div class="item-content">
                <el-progress :percentage="taskInfo.progress" class="progress" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <h3>
            Result Files
          </h3>
          <div
            class="file"
            v-for="item in taskInfo.resultFile"
            :key="item.type"
          >
            <div class="file-content">
              <el-icon name="document"></el-icon>
              <div class="file-name">{{ item.type.toUpperCase() }} file</div>
            </div>
            <el-button
              icon="el-icon-download"
              size="small"
              type="primary"
              @click="download(item.url)"
            ></el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { cafeClient } from '../clients'
import moment from 'dayjs'
import TaskParamVisual from '../components/TaskParamVisual'

export default {
  name: 'TaskDetail',
  components: { TaskParamVisual },
  computed: {
    statusTagType() {
      return { running: '', failed: 'danger', finished: 'success' }[
        this.taskInfo.status
      ]
    },
  },
  data() {
    return { taskInfo: { status: 'running' } }
  },
  mounted() {
    this.getTaskDetail()
  },
  methods: {
    convertTaskInfo(taskInfo) {
      taskInfo.createTime = moment(taskInfo.createTime * 1000).format(
        'YYYY-MM-DD HH:mm:ss',
      )
      taskInfo.updateTime = moment(taskInfo.updateTime * 1000).format(
        'YYYY-MM-DD HH:mm:ss',
      )
      return taskInfo
    },
    getTaskDetail() {
      const { taskId } = this.$route.params
      cafeClient
        .getTaskDetail(taskId)
        .then(data => (this.taskInfo = this.convertTaskInfo(data)))
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    goBack() {
      this.$router.back()
    },
    download(link) {
      window.open(link, '_blank')
    },
  },
}
</script>

<style scoped lang="scss">
.wrapper {
  max-width: 1500px;
  min-width: 1000px;
  margin: 0 auto;
  > h2 {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
}
.content {
  min-width: 1000px;
  min-height: 400px;
}

.content-list {
  border-right: 1px solid #dedede;
  .item {
    display: flex;
    margin-bottom: 10px;
    > label {
      height: 32px;
      line-height: 32px;
      min-width: 120px;
      margin-right: 10px;
      font-weight: bold;
      color: #2f4152;
    }
    .item-content {
      min-height: 32px;
      line-height: 32px;
    }
  }
  .params {
    margin-top: 10px;
    margin-left: 5px;
  }
  .progress {
    width: 220px;
    margin-top: 10px;
  }
}
.back-btn {
  margin-right: 20px;
}
.file {
  height: 40px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 10px 20px;
  border: 1px solid #f5f5f5;
  color: #409dff;
  .file-content {
    display: flex;
    align-items: center;
    > i {
      margin-right: 15px;
    }
  }
}
</style>
