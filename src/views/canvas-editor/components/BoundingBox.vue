<script setup lang="ts">
import { ref, reactive } from 'vue';

const props = defineProps(['element']); // element prop 추가

const boundingBoxRef = ref(null);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);

const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
};

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value) {
    const deltaX = e.clientX - startX.value;
    const deltaY = e.clientY - startY.value;

    // 여기서 엘리먼트를 이동시키는 로직을 추가합니다.
    // element 속성을 통해 현재 BoundingBox가 속한 엘리먼트 정보에 접근할 수 있습니다.
    // 이동 시에는 store 등을 사용하여 엘리먼트의 좌표를 업데이트하거나, 업데이트된 좌표를 다시 BoundingBox에 전달합니다.

    startX.value = e.clientX;
    startY.value = e.clientY;
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};
</script>

<template>
  <div 
    class="bounding-box" 
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  ></div>
</template>

<style scoped lang="scss">
.bounding-box {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 2px dashed #3498db;
  pointer-events: auto; /* 이벤트를 받도록 설정 */
  cursor: move;
}
</style>