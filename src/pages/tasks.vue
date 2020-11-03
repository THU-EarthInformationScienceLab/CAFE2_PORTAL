<template>
  <div class="tasks">
    <el-card class="tasks-content">
      <el-tabs
        v-model="selectStatus"
        class="tabs"
        @tab-click="handleSelectStatus"
      >
        <el-tab-pane
          class="tab-pane"
          label="All Tasks"
          name="all"
        ></el-tab-pane>
        <!--        <el-tab-pane-->
        <!--          class="tab-pane"-->
        <!--          label="Uncompleted"-->
        <!--          name="uncompleted"-->
        <!--        ></el-tab-pane>-->
        <!--        <el-tab-pane-->
        <!--          class="tab-pane"-->
        <!--          label="Completed"-->
        <!--          name="completed"-->
        <!--        ></el-tab-pane>-->
        <!--        <el-tab-pane-->
        <!--          class="tab-pane"-->
        <!--          label="Failed"-->
        <!--          name="failed"-->
        <!--        ></el-tab-pane>-->
      </el-tabs>

      <el-table :data="data" border>
        <el-table-column
          align="center"
          prop="taskIdSimple"
          label="ID"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="taskName"
          label="Task Name"
        ></el-table-column>
        <el-table-column align="center" prop="models" label="Models">
          <template slot-scope="{ row }">
            <el-link type="primary"
              >{{ row.models ? row.models.length : 0 }} models</el-link
            >
          </template>
        </el-table-column>
        <el-table-column align="center" prop="params" label="task params">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="Task Params"
              width="200"
              trigger="click"
            >
              <TaskParamVisual :content="scope.row.params" />
              <el-link type="primary" size="small" slot="reference"
                >check params</el-link
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="Create Time"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="updateTime"
          label="Update Time"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="Status"
          width="100px"
        >
          <template slot-scope="{ row }">
            <el-tag
              :type="
                { running: '', failed: 'danger', finished: 'success' }[
                  row.status
                ]
              "
              >{{ row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="Actions" width="150px">
          <template slot-scope="scope">
            <el-link type="primary" @click="goDetail(scope.row)"
              >Detail</el-link
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          :page-size="limit"
          :total="total"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { cafeClient } from '../clients'
import moment from 'dayjs'
import TaskParamVisual from '../components/TaskParamVisual'

export default {
  name: 'Tasks',
  components: { TaskParamVisual },
  data() {
    return {
      data: [],
      selectStatus: 'all',
      limit: 10,
      total: 0,
      page: 1,
    }
  },
  mounted() {
    this.getTasks()
  },
  methods: {
    getTasks() {
      this.loading = true
      return cafeClient
        .getTaskList({
          limit: this.limit,
          offset: (this.page - 1) * this.limit,
        })
        .then(({ list, total }) => {
          this.data = this.convertData(list)
          this.total = total
        })
        .catch(e => {
          this.$message.error(`get tasks error: ${e.message}`)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handlePageChange(page) {
      this.page = page
      this.getTasks()
    },
    convertData(list) {
      return list.map(item => {
        item.createTime = moment(item.createTime * 1000).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        item.updateTime = moment(item.updateTime * 1000).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        item.taskIdSimple = item.taskId.split('-')[0]
        return { ...item }
      })
    },
    goDetail(task) {
      this.$router.push(`/tasks/${task.taskId}`)
    },
    handleSelectStatus(tabItem) {
      console.log(tabItem)
    },
  },
}
</script>

<style scoped lang="scss">
.tasks {
  width: 100%;
  padding: 20px 0;
}
.tasks-content {
  max-width: 1500px;
  margin: 0 auto;
  min-height: 400px;
}
.pagination-wrapper {
  margin: 20px 0;
}
.tabs {
  margin: 20px 0 30px 0;
}
</style>
