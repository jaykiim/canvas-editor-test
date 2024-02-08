<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useElementStore } from '@/stores/elements';
import DesignElement from './components/DesignElement.vue'

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
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
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
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
}

function handleWheel(e: WheelEvent) {
  const delta = e.deltaY
  if (delta > 0) zoomOut();
  else zoomIn();
}

function zoomIn() {
  zoomLevel.value += 0.1;
}

function zoomOut() {
  zoomLevel.value -= 0.1;
}

// function handleWheel(e: WheelEvent) {
//   const delta = e.deltaY;
//   const rect = canvas.value?.getBoundingClientRect();
//   const mouseX = e.clientX - (rect?.left || 0);
//   const mouseY = e.clientY - (rect?.top || 0);

//   if (delta > 0) zoomOut(mouseX, mouseY, delta);
//   else zoomIn(mouseX, mouseY, delta);
// }

// function zoomIn(mouseX: number, mouseY: number, wheel: number) {
//   // 배율 = 1 - (e.deltaX * zoomFactor)
//   // 배율 증가량 = s - zoomLevel.value
//   // 너비 증가량 = screenX * 배율 증가량
//   // 이동량 =   
//   // 이동비율 = dx / screenX
//   // panX *= (1 - 이동비율) 

//   const scaleFactor = 0.01;
//   const s = 1 - (wheel * scaleFactor);
//   const ds = s - zoomLevel.value;

//   // const newZoomLevel = s;

//   panX.value -= mouseX * ds;
//   panY.value -= mouseY * ds;
//   zoomLevel.value = s;
// }

// function zoomOut(mouseX: number, mouseY: number, wheel: number) {
//   const scaleFactor = 0.01;
//   const s = 1 - (wheel * scaleFactor);
//   const ds = s - zoomLevel.value;
//   /// const newZoomLevel = zoomLevel.value - scaleFactor;
//   panX.value += mouseX * ds;
//   panY.value += mouseY * ds;
//   zoomLevel.value = s;
// }

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

onBeforeUnmount(() => {
  // 컴포넌트가 소멸되기 전에 이벤트 리스너 제거
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <div 
    ref="canvas" 
    class="canvas"
    @mousedown="handleMouseDown" 
    @wheel="handleWheel"
    @click="handleCanvasClick"
  >
    <DesignElement :zoomLevel="zoomLevel" :panX="panX" :panY="panY"/>
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