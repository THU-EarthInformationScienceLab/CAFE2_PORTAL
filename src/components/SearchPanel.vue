<template>
  <div class="search-panel-wrapper">
    <div class="search-panel" v-loading="loading">
      <div
        class="search-panel-item"
        v-for="(items, key) in searchKeys"
        :key="key"
      >
        <div class="label">
          <label>{{ labelMapping[key] ? labelMapping[key] : key }}</label>
        </div>
        <div :class="{ tags: true, 'tags-oneline': !panelExpand }">
          <div class="tag" v-for="(tag, index) in items" :key="tag">
            <el-link
              :type="isTagSelected(tag, key) ? 'primary' : 'default'"
              @click="selectTag(tag, index, key)"
              >{{ tag }}</el-link
            >
          </div>
        </div>
      </div>
    </div>
    <div class="search-panel-handler" @click="togglePanelExpand">
      <el-icon :name="panelExpand ? 'arrow-up' : 'arrow-down'"></el-icon>
    </div>
  </div>
</template>

<script>
import { cafeClient } from '../clients'

export default {
  name: 'SearchPanel',
  data() {
    return {
      searchKeys: [],
      panelExpand: true,
      selected: {},
      loading: false,
      labelMapping: {
        modelingRealm: 'modeling realm',
        ensembleMember: 'ensemble member',
        variableName: 'variable',
      },
    }
  },
  mounted() {
    this.queryFilterOptions().then(() => {
      this.$emit('select', { value: this.selected })
    })
  },
  methods: {
    queryFilterOptions() {
      this.loading = true

      return cafeClient
        .fetchFilterOptions()
        .then(data => {
          this.searchKeys = data
        })
        .catch(e => {
          this.$message.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    togglePanelExpand() {
      this.panelExpand = !this.panelExpand
    },
    isTagSelected(tag, key) {
      return !!(this.selected[key] && this.selected[key].includes(tag))
    },
    selectTag(tag, index, key) {
      if (!this.selected[key]) {
        this.selected[key] = []
      }
      if (!this.selected[key].includes(tag)) {
        this.selected[key].push(tag)
      } else {
        this.selected[key] = this.selected[key].filter(i => i !== tag)
      }
      this.selected = { ...this.selected }
      this.$emit('select', { value: this.selected, tag, key })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-panel-wrapper {
  margin-bottom: 20px;
}
.search-panel {
  position: relative;
  padding: 20px;
  box-shadow: 0 4px 5px -4px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #c0c0c0;
  min-height: 300px;
}
.search-panel-handler {
  width: 150px;
  margin: 0 auto;
  background: #fff;
  top: -1px;
  position: relative;
  border: 1px solid #c0c0c0;
  border-top: 0;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0 0 2px 2px;
  text-align: center;
  font-size: 20px;
  color: #c0c0c0;
}
.search-panel-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #e2e2e2;
  &:last-child {
    border-bottom: 0;
  }
  .label {
    width: 100px;
    min-width: 100px;
    margin-right: 20px;
    color: #6a6d6f;
    font-weight: bold;
    font-size: 12px;
  }
  .tags {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    &.tags-oneline {
      height: 22px;
      overflow: hidden;
    }
  }
  .tag {
    margin: 0 10px 5px 5px;
    width: 110px;
    font-size: 12px;
    word-break: break-all;
    border: 1px solid #d2d2d2;
    border-radius: 2px;
    padding: 0 5px;
    .el-link {
      font-size: 12px;
    }
  }
}
</style>
