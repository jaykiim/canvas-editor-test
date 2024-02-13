<script setup lang="ts">
import { ref } from 'vue';
import BoundingBox from './BoundingBox.vue';
import { useElementStore } from '@/stores/elements';
import type { PropType } from 'vue';
import type { Element } from '@/types/Element';

defineProps({
  element: { type: Object as PropType<Element>, required: true },
  scale: { type: Number, required: true },
})

const { state, setSelectedElement } = useElementStore();

const isMouseOver = ref(false);

function handleElementClick(element: Element) {
  isMouseOver.value = false;
  setSelectedElement(element);
};

function handleMouseOver(element: Element) {
  if (state.selectedElement?.id !== element.id) {
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
    @mousedown.stop="handleElementClick(element)"
    @mouseover.stop="handleMouseOver(element)"
    @mouseleave.stop="handleMouseLeave"
  >
  <div v-if="isMouseOver" class="border-box"></div>
    <template v-if="element.id === state.selectedElement?.id">
      <div class="size-box">{{ element.width }} x {{ element.height }}</div>
      <BoundingBox :zoom-level="scale"/>
    </template>
  </div>  
</template>

<style scoped lang="scss">
.size-box {
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