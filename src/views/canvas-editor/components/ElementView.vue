<script setup lang="ts">
import type { PropType } from 'vue';
import BoundingBox from './BoundingBox.vue';
import { useElementStore } from '@/stores/elements';
import type { Element } from '@/types/Element';

defineProps({
  element: { type: Object as PropType<Element>, required: true },
  scale: { type: Number, required: true },
})

const { state, setSelectedElement } = useElementStore();

const handleElementClick = (element: Element) => {
  setSelectedElement(element);
};
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
  >
    <BoundingBox 
      v-if="state.selectedElement && state.selectedElement.id === element.id" 
      :zoom-level="scale"
    />
  </div>  
</template>