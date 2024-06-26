<script setup lang="ts">
import { inject, onBeforeUnmount, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePageStore } from '../../stores/pages';
import type { Element } from '@/types/Element';
import type { MouseActionType } from '@/types/Canvas';

const props = defineProps({
  zoomLevel: { type: Number, required: true }
});

const setCurrentAction = inject<(action: MouseActionType) => void>('setCurrentAction');

const store = usePageStore();
const { selectedElements } = storeToRefs(store);

const isResizing = ref(false);
const resizeDirection = ref<'lt' | 'rt' | 'lb' | 'rb' | null>(null);
const startX = ref(0);
const startY = ref(0);

let elementSnapshot:Element[];

function handleMouseDown(e: MouseEvent, direction: 'lt' | 'rt' | 'lb' | 'rb') {
  isResizing.value = true;
  resizeDirection.value = direction;
  
  startX.value = e.clientX;
  startY.value = e.clientY;
  elementSnapshot = JSON.parse(JSON.stringify(selectedElements.value));
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
};

function handleMouseMove(e: MouseEvent) {
  if (!selectedElements.value.length) return;
  if (setCurrentAction) setCurrentAction('resize-element');

  const dx = (e.clientX - startX.value) * (1 / props.zoomLevel);
  const dy = (e.clientY - startY.value) * (1 / props.zoomLevel);

  selectedElements.value.forEach((element, i) => {
    let l = elementSnapshot[i].x;
    let t = elementSnapshot[i].y;
    let r = l + elementSnapshot[i].width;
    let b = t + elementSnapshot[i].height;

    const direction = resizeDirection.value;
    if (direction) {
      if (direction === 'lt') {
        l += dx;
        t += dy;
      }
      if (direction === 'rt') {
        r += dx;
        t += dy;
      }
      if (direction === 'lb') {
        l += dx;
        b += dy;
      }
      if (direction === 'rb') {
        r += dx;
        b += dy;
      }

      element.x = l;
      element.y = t;
      element.width = Math.round(r - l);
      element.height = Math.round(b - t);

      // 너비를 끝까지 줄일 경우 방향 변경
      if (element.width < 0) {
        element.x += element.width; // x좌표값이 기존 r값 (l + width)이 됨
        element.width *= -1; // 너비를 양수로 변환 
      }

      // 높이를 끝까지 줄일 경우 방향 변경
      if (element.height < 0) {
        element.y += element.height; // y좌표값이 기존 b값 (t + height)이 됨
        element.height *= -1; // 높이를 양수로 변환
      }
    }
  });
};

function handleMouseUp() {
  if (setCurrentAction) setCurrentAction('');
  isResizing.value = false;
  resizeDirection.value = null;

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
</style>@/views/canvas-editor/stores/elements