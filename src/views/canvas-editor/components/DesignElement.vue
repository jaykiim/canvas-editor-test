<script setup lang="ts">
import { useElementStore } from '@/stores/elements';
import BoundingBox from './BoundingBox.vue';
import type { Element } from '@/types/Element';

defineProps({
  zoomLevel: { type: Number, required: true },
  panX: { type: Number, required: true },
  panY: { type: Number, required: true }
})

const { state, setSelectedElement } = useElementStore();

const handleElementClick = (element: Element) => {
  setSelectedElement(element);
};

</script>

<template>
  <div 
    v-for="item in state.elements"
    :key="item.id"
    class="element"
    :style="{
      left: `${item.x * zoomLevel + panX}px`,
      top: `${item.y * zoomLevel + panY}px`,
      width: `${item.width * zoomLevel}px`,
      height: `${item.height * zoomLevel}px`,
      backgroundColor: item.backgroundColor,
      color: item.textColor,
      transform: `scale(${zoomLevel})`,
      position: 'absolute',
    }"
    @mousedown.stop="handleElementClick(item)"
  >
    <BoundingBox 
      v-if="state.selectedElement && state.selectedElement.id === item.id" 
      :element="state.selectedElement" 
      :zoom-level="zoomLevel"
    />
  </div>      
</template>

<style scoped lang="scss">
.element {
  cursor: pointer;
}
</style>
