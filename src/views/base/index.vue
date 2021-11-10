<template>
  <div class="home df aic jcc">
    <div>欢迎来到{{ cmsName }}</div>
  </div>
</template>

<script lang='ts' setup>
const cmsName = window.globalVar.cmsName
</script>

<style scoped>
.home {
  font-size: 18px;
}
</style>

