<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import BoundingBox from './BoundingBox.vue';
import { useElementStore } from '@/stores/elements';
import type { PropType } from 'vue';
import type { Element } from '@/types/Element';

const props = defineProps({
  element: { type: Object as PropType<Element>, required: true },
  scale: { type: Number, required: true },
})

const { state, setSelectedElement, findElement } = useElementStore();

const isMouseOver = ref(false);
const startX = ref(0);
const startY = ref(0);
let elementSnapshot:Element[];

function handleMouseDown(e: MouseEvent, element: Element) {
  isMouseOver.value = false;
  setSelectedElement([element]);

  startX.value = e.clientX;
  startY.value = e.clientY;
  elementSnapshot = JSON.parse(JSON.stringify(state.selectedElement));
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
};

function handleMouseMove(e: MouseEvent) {
  if (!state.selectedElement.length) return;

  state.selectedElement.forEach((element, i) => {
    const dx = (e.clientX - startX.value) * (1 / props.scale);
    const dy = (e.clientY - startY.value) * (1 / props.scale);
    element.x = elementSnapshot[i].x + dx;
    element.y = elementSnapshot[i].y + dy;
  })
}

function handleMouseUp() {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
}

onBeforeUnmount(() => {
  // 컴포넌트가 소멸되기 전에 이벤트 리스너 제거
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});

function handleMouseOver(element: Element) {
  const isCurrentElementSelected = !!findElement(state.selectedElement, element.id);
  if (!isCurrentElementSelected) {
    isMouseOver.value = true;
  }
}

function handleMouseLeave() {
  isMouseOver.value = false;
}
</script>

<template>
  <div 
    class="element"
    :style="{
      position: 'absolute',
      left: `${(element.x * scale)}px`,
      top: `${(element.y * scale)}px`,
      width: `${element.width * scale}px`,
      height: `${element.height * scale}px`,
      backgroundColor: element.backgroundColor,
      color: element.textColor,
    }"
    @mousedown.stop="handleMouseDown($event, element)"
    @mouseover.stop="handleMouseOver(element)"
    @mouseleave.stop="handleMouseLeave"
  >
  <div v-if="isMouseOver" class="border-box"></div>
    <template v-if="!!findElement(state.selectedElement, element.id)">
      <div class="size-box">{{ element.width }} x {{ element.height }}</div>
      <BoundingBox :zoom-level="scale"/>
    </template>
  </div>  
</template>

<style scoped lang="scss">
.size-box {
  white-space: nowrap;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 130%);
  padding: 1px 3px;
  background-color: #0d99ff;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 500;
  border-radius: 2px;
}
.border-box {
  position: absolute;
  border: 3px solid #4597f7;
  width: 100%;
  height: 100%;
}
</style>