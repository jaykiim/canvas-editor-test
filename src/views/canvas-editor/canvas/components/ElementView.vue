<script setup lang="ts">
import { inject, onBeforeUnmount, ref } from 'vue';
import { usePageStore } from '../../stores/pages';
import BoundingBox from './BoundingBox.vue';
import type { PropType, Ref } from 'vue';
import type { Element } from '@/types/Element';
import type { MouseActionType } from '@/types/Canvas'; 
import { storeToRefs } from 'pinia';

const props = defineProps({
  element: { type: Object as PropType<Element>, required: true },
  scale: { type: Number, required: true },
});

const currentAction = inject<Ref<MouseActionType>>('currentAction');
const setCurrentAction = inject<(action: MouseActionType) => void>('setCurrentAction');

const store = usePageStore();
const { selectedElements } = storeToRefs(store);

const isMouseOver = ref(false);
const startX = ref(0);
const startY = ref(0);
let elementSnapshot:Element[];

function handleMouseDown(e: MouseEvent, element: Element) {
  isMouseOver.value = false; 

  store.setSelectedElements([element]); // 추후 실행 취소 기능 개발 시 lastAction이 selectArea인 경우 제외하고 실행

  startX.value = e.clientX;
  startY.value = e.clientY;
  elementSnapshot = JSON.parse(JSON.stringify(selectedElements.value));
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
};

function handleMouseMove(e: MouseEvent) {
  if (!selectedElements.value.length) return;
  if (setCurrentAction) setCurrentAction('move-element');

  selectedElements.value.forEach((element, i) => {
    const dx = (e.clientX - startX.value) * (1 / props.scale);
    const dy = (e.clientY - startY.value) * (1 / props.scale);
    element.x = elementSnapshot[i].x + dx;
    element.y = elementSnapshot[i].y + dy;
  })
}

function handleMouseUp() {
  if (setCurrentAction) setCurrentAction('');
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
}

onBeforeUnmount(() => {
  // 컴포넌트가 소멸되기 전에 이벤트 리스너 제거
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});

function handleMouseOver(element: Element) {
  const isCurrentElementSelected = !!store.findElement(selectedElements.value, element.id);
  if (!isCurrentElementSelected && !currentAction?.value) {
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
    <template v-if="!!store.findElement(selectedElements, element.id)">
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
</style>@/views/canvas-editor/stores/elements