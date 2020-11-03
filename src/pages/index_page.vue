<template>
  <div class="wrapper">
    <div class="content">
      <IndexContent></IndexContent>
    </div>
  </div>
</template>

<script>
import IndexContent from '../components/IndexContent'
export default {
  name: 'IndexPage',
  components: { IndexContent },
}
</script>

<style scoped>
.wrapper {
  width: 100%;
  background: #f5f5f5;
}
.content {
  width: 900px;
  padding: 20px 40px;
  border: 1px solid #cecece;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  background: #fff;
  margin: 0 auto;
}
</style>
