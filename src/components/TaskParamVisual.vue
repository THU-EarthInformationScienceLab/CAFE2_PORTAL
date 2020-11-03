<template>
  <div class="list">
    <div class="item" v-for="(label, key) in needShowKeys" :key="key">
      <label>{{ label }}</label>
      <p>{{ contentJson[key] }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskParamVisual',
  props: {
    content: String,
  },
  data() {
    return {
      needShowKeys: {
        name: 'method',
        temporalStart: 'start',
        temporalEnd: 'end',
        lonMin: 'min lon',
        latMin: 'min lat',
        lonMax: 'max lon',
        latMax: 'max lat',
      },
      contentJson: {},
    }
  },
  mounted() {
    if (this.content) {
      this.parseContent(this.content)
    }
  },
  methods: {
    parseContent(content) {
      try {
        this.contentJson = JSON.parse(content)
        ;['lonMin', 'latMin', 'lonMax', 'latMax'].forEach(key => {
          this.contentJson[key] = Number(this.contentJson[key]).toFixed(4)
        })
      } catch (e) {
        console.error(`parse json error: ${e.message}`)
        this.contentJson = {}
      }
    },
  },
  watch: {
    content(value) {
      this.parseContent(value)
    },
  },
}
</script>

<style scoped>
.list {
  width: 200px;
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  line-height: 16px;
}
.item label {
  color: #ffba38;
  font-weight: bold;
  font-size: 12px;
}
.item p {
  margin: 0;
  font-size: 12px;
}
</style>
