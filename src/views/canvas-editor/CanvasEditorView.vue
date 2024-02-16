<script setup lang="ts">
import GlobalNavigationBar from './navigation-bars/GlobalNavigationBar.vue';
import LeftNavigationBar from './lnb/LnbView.vue';
import CanvasView from './canvas/CanvasView.vue';
</script>

<template>
  <GlobalNavigationBar />
  <div class="editor-container">
    <LeftNavigationBar />
    <CanvasView />
  </div>
</template>

<style scoped lang="scss">
.editor-container {
  display: flex;
  width: 100%;
  height: calc(100% - 3rem);
}
</style>