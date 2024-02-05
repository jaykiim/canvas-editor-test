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

const { setSelectedElement } = useElementStore();

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

function handleCanvasClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target) {
    const clickedElement = target.closest('.element');
    // 클릭한 요소의 조상 중에 .element가 없는 경우 = 빈 공간을 클릭한 경우
    if (!clickedElement) { 
      setSelectedElement(null);
    }
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
</style>