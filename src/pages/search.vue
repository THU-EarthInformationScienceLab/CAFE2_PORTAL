<template>
  <div class="search">
    <div class="content">
      <SearchPanel @select="handleFilterChange"></SearchPanel>
      <div class="table-wrapper">
        <el-table class="table" :data="data" border v-loading="loading">
          <el-table-column
            align="center"
            label="institute"
            prop="institute"
            width="80px"
          ></el-table-column>
          <el-table-column
            align="center"
            label="model"
            prop="model"
          ></el-table-column>
          <el-table-column
            align="center"
            label="experiment"
            prop="experiment"
          ></el-table-column>
          <el-table-column
            align="center"
            label="version"
            prop="versionNumber"
          ></el-table-column>
          <el-table-column
            align="center"
            label="variable name"
            prop="variableName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="ensemble member"
            prop="ensembleMember"
          ></el-table-column>
          <el-table-column
            align="center"
            label="temporal start"
            prop="temporalStart"
            width="120px"
          ></el-table-column>
          <el-table-column
            align="center"
            label="temporal end"
            prop="temporalEnd"
            width="120px"
          ></el-table-column>
          <el-table-column
            label="action"
            width="120px"
            align="center"
            fixed="right"
          >
            <template slot-scope="{ row }">
              <el-button
                class="table-action-btn"
                :type="row.selected ? 'danger' : 'primary'"
                size="small"
                @click="toggleSelect(row)"
                >{{ row.selected ? 'unselect' : 'select' }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            :page-size="limit"
            :total="total"
            @current-change="handlePageChange"
          />
        </div>
      </div>
      <div class="float-bottom-actions" v-sticky sticky-side="bottom">
        <div class="action">
          <div class="action-left">
            <label>selected:</label> <span>{{ selectedItems.length }}</span>
          </div>
          <div class="action-right">
            <el-button
              type="danger"
              icon="el-icon-close"
              @click="unselectAll"
              v-if="selectedItems.length > 0"
              >unselect all</el-button
            >
            <el-button icon="el-icon-check" @click="selectAll"
              >select all</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button
              :disabled="selectedItems.length === 0"
              type="primary"
              icon="el-icon-edit-outline"
              @click="createTask"
              >Create Task</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <CreateTaskModal
      :visible.sync="showTaskCreateModal"
      :models="selectedItems"
    ></CreateTaskModal>
  </div>
</template>

<script>
import SearchPanel from '../components/SearchPanel'
import { cafeClient } from '../clients'
import CreateTaskModal from './create_task'
export default {
  name: 'Search',
  components: { CreateTaskModal, SearchPanel },
  data() {
    return {
      filter: {},
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      loading: false,
      showTaskCreateModal: false,
      shouldStick: true,
    }
  },
  computed: {
    selectedItems() {
      return this.data.filter(i => i.selected)
    },
  },
  mounted() {},
  methods: {
    handleFilterChange({ value }) {
      this.filter = value
      this.page = 1
      this.total = 0
      this.queryModelList()
    },
    queryModelList() {
      this.loading = true
      cafeClient
        .queryModels({
          offset: (this.page - 1) * this.limit,
          limit: this.limit,
          ...this.filter,
        })
        .then(data => {
          console.log(data)
          const { modelList } = data
          const { list, rowCount } = modelList
          this.data = list
          this.total = rowCount

          // fix sticky bugs
          this.$nextTick(() => {
            window.scrollTo(window.scrollX, window.scrollY - 1)
            window.scrollTo(window.scrollX, window.scrollY + 1)
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    handlePageChange(currentPage) {
      this.page = currentPage
      this.queryModelList()
    },
    toggleSelect(row) {
      row.selected = !row.selected
      this.data = [...this.data]
    },
    selectAll() {
      this.data = this.data.map(item => {
        item.selected = true
        return item
      })
    },
    unselectAll() {
      this.data = this.data.map(item => {
        item.selected = false
        return item
      })
    },
    createTask() {
      this.showTaskCreateModal = true
    },
  },
}
</script>

<style scoped lang="scss">
.search {
  width: 100%;
}
.table-wrapper {
  padding: 20px 40px;
  .table-action-btn {
    width: 80px;
  }
}
.content {
  max-width: 1500px;
  border: 1px solid #cecece;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  background: #fff;
  margin: 0 auto;
}
.float-bottom-actions {
  height: 60px;
  background: #fff;
  border-top: 1px solid #c0c0c0;
  margin-top: 20px;
  box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.1);

  .action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 20px;
  }
  .action-left {
    font-size: 18px;
    label {
      color: #6a6d6f;
      margin-right: 10px;
    }
    span {
      color: #ffb323;
      font-weight: bolder;
    }
  }
}
.pagination-wrapper {
  margin: 20px 0;
}
</style>
