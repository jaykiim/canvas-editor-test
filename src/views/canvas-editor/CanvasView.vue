<script setup lang="ts">
import { ref } from 'vue';
import DesignElement from './components/DesignElement.vue'
import { useElementStore } from '@/stores/elements';

const canvas = ref<HTMLDivElement>();
const isDragging = ref<boolean>(false);
const startDragX = ref<number>(0);
const startDragY = ref<number>(0);
const panX = ref<number>(0);
const panY = ref<number>(0);
const zoomLevel = ref<number>(1);

const elementStore = useElementStore();

function handleMouseDown(e: MouseEvent) {
  isDragging.value = true;
  startDragX.value = e.clientX;
  startDragY.value = e.clientY;
}

function handleMouseMove(e: MouseEvent) {
  if (canvas.value && isDragging.value === true) {
    const deltaX = e.clientX - startDragX.value;
    const deltaY = e.clientY - startDragY.value;
    panX.value += deltaX;
    panY.value += deltaY;
    startDragX.value = e.clientX;
    startDragY.value = e.clientY;
  }
}

function handleMouseUp() {
  isDragging.value = false;
}

function handleWheel(e: WheelEvent) {
  const delta = e.deltaY;
  if (delta > 0) zoomOut();
  else zoomIn();
}

function zoomIn() {
  zoomLevel.value += 0.1;
}

function zoomOut() {
  zoomLevel.value -= 0.1;
}

function handleCanvasClick() {
  console.log('canvas click', elementStore.getSelectedElement());
  
  // 빈 공간 클릭 시 선택된 엘리먼트 해제
  if (!elementStore.getSelectedElement()) {
    console.log('canvas click > no selected element');
    elementStore.setSelectedElement(null);
  }
}
</script>

<template>
  <div 
    ref="canvas" 
    class="canvas" 
    @mousedown="handleMouseDown" 
    @mousemove="handleMouseMove" 
    @mouseup="handleMouseUp" 
    @wheel="handleWheel"
    @click="handleCanvasClick"
  >
    <DesignElement :zoomLevel="zoomLevel" :panX="panX" :panY="panY" />
  </div>
</template>

<style scoped lang="scss">
.canvas {
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
  width: 100%;
  height: calc(100% - 3rem);
}
.container {
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
  width: 100%;
  height: calc(100% - 3rem);
}

.test-box {
  width: 100px;
  height: 100px;
  background-color: black;
}
</style>