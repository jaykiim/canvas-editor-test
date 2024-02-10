<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useElementStore } from '@/stores/elements';
import type { Element } from '@/types/Element';

const props = defineProps({
  zoomLevel: { type: Number, required: true }
});

const { state } = useElementStore();

const isResizing = ref(false);
const resizeHandleRef = ref<'lt' | 'rt' | 'lb' | 'rb' | null>(null);
const startX = ref(0);
const startY = ref(0);

let elementSnapshot:Element;

function handleMouseDown(e: MouseEvent, direction?: 'lt' | 'rt' | 'lb' | 'rb') {
  if (direction) {
    isResizing.value = true;
    resizeHandleRef.value = direction;
  }
  
  startX.value = e.clientX;
  startY.value = e.clientY;
  elementSnapshot = JSON.parse(JSON.stringify(state.selectedElement));
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
};

function handleMouseMove(e: MouseEvent) {
  if (!state.selectedElement) return;
  console.log('zoom level', props.zoomLevel);
  const dx = (e.clientX - startX.value) * (1 / props.zoomLevel);
  const dy = (e.clientY - startY.value) * (1 / props.zoomLevel);

  // 크기 조정
  if (isResizing.value) {  
    let l = elementSnapshot.x;
    let t = elementSnapshot.y;
    let r = l + elementSnapshot.width;
    let b = t + elementSnapshot.height;

    const direction = resizeHandleRef.value;
    if (direction) {
      if (direction === 'lt') {
        console.log('lt')
        l += dx;
        t += dy;
      }
      if (direction === 'rt') {
        console.log('rt')
        r += dx;
        t += dy;
      }
      if (direction === 'lb') {
        console.log('lb')
        l += dx;
        b += dy;
      }
      if (direction === 'rb') {
        console.log('rb')
        r += dx;
        b += dy;
      }
      state.selectedElement.x = l;
      state.selectedElement.y = t;
      state.selectedElement.width = r - l;
      state.selectedElement.height = b - t;

      // 너비를 끝까지 줄일 경우 방향 변경
      if (state.selectedElement.width < 0) {
        state.selectedElement.x += state.selectedElement.width; // x좌표값이 기존 r값 (l + width)이 됨
        state.selectedElement.width *= -1; // 너비를 양수로 변환 
      }

      // 높이를 끝까지 줄일 경우 방향 변경
      if (state.selectedElement.height < 0) {
        state.selectedElement.y += state.selectedElement.height; // y좌표값이 기존 b값 (t + height)이 됨
        state.selectedElement.height *= -1; // 높이를 양수로 변환
      }
    }
  }

  // 이동
  else {
    state.selectedElement.x = elementSnapshot.x + dx;
    state.selectedElement.y = elementSnapshot.y + dy;
  }
};

function handleMouseUp() {
  isResizing.value = false;
  resizeHandleRef.value = null;

  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
}

onBeforeUnmount(() => {
  // 컴포넌트가 소멸되기 전에 이벤트 리스너 제거
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <div 
    ref="boundingBox" 
    class="bounding-box"
    @mousedown.stop="handleMouseDown" 
  >
    <div 
      ref="resizeHandleTopLeft" 
      class="resize-handle top-left"
      @mousedown.stop="handleMouseDown($event, 'lt')"
    />
    <div 
      ref="resizeHandleTopRight" 
      class="resize-handle top-right"
      @mousedown.stop="handleMouseDown($event, 'rt')"
    />
    <div 
      ref="resizeHandleBottomLeft" 
      class="resize-handle bottom-left"
      @mousedown.stop="handleMouseDown($event, 'lb')"
    />
    <div 
      ref="resizeHandleBottomRight" 
      class="resize-handle bottom-right"
      @mousedown.stop="handleMouseDown($event, 'rb')"
    />
  </div>
</template>

<style scoped lang="scss">
.bounding-box {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid #4597f7;
  pointer-events: auto; /* 이벤트를 받도록 설정 */
  cursor: move;

  .resize-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 1px solid #4597f7;
    background-color: #fff;
    cursor: nwse-resize; /* 대각선 리사이즈 커서 */

    &.top-left {
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
    }

    &.top-right {
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      cursor: nesw-resize; /* 대각선 리사이즈 커서 반대 방향 */
    }

    &.bottom-left {
      bottom: 0;
      left: 0;
      transform: translate(-50%, 50%);
      cursor: nesw-resize; /* 대각선 리사이즈 커서 반대 방향 */
    }

    &.bottom-right {
      bottom: 0;
      right: 0;
      transform: translate(50%, 50%);
    }
  }
}
</style>