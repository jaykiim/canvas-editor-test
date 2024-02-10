<script setup lang="ts">
import { type PropType, ref } from 'vue';
import BoundingBox from './BoundingBox.vue';
import { useElementStore } from '@/stores/elements';
import type { Element } from '@/types/Element';

defineProps({
  element: { type: Object as PropType<Element>, required: true },
  scale: { type: Number, required: true },
})

const { state, setSelectedElement } = useElementStore();

const elementHovered = ref(false);

function handleElementClick(element: Element){
  elementHovered.value = false;
  setSelectedElement(element);
};

function handleMouseOver(element: Element) {
  console.log('element hover');
  if (state.selectedElement?.id !== element.id) {
    elementHovered.value = true;
  }
}
function handleMouseLeave() {
  elementHovered.value = false;
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
    <div v-if="elementHovered" class="hover-box" />
    <div v-if="element.id === state.selectedElement?.id" class="size-box">{{ element.width }} x {{ element.height }}</div>
    <BoundingBox 
      v-if="state.selectedElement && state.selectedElement.id === element.id" 
      :zoom-level="scale"
    />
  </div>  
</template>

<style scoped lang="scss">
.element > .hover-box {
  width: 100%;
  height: 100%;
  border: 3px solid #4597f7;
}
.element > .size-box {
  position: absolute;
  white-space: nowrap;
  left: 50%;
  bottom: 0px;
  transform: translate(-50%, 140%);
  padding: 1px 4px;
  background-color: #0a99ff;
  color: #fff;
  font-size: .7rem;
  font-weight: 500;
  border-radius: 3px;
}
</style>