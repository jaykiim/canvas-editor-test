<script setup lang="ts">
import { ref } from 'vue';
import { useElementStore } from '@/stores/elements';
import BoundingBox from './BoundingBox.vue';
import type { Element } from '@/types/Element';

defineProps({
  zoomLevel: { type: Number, required: true },
  panX: { type: Number, required: true },
  panY: { type: Number, required: true }
})

const elementStore = useElementStore();
const elements = elementStore.getElements();
const selectedElement = elementStore.getSelectedElement();

const handleElementClick = (e: MouseEvent, element: Element) => {
  console.log('element mousedown');
  elementStore.setSelectedElement(element);
};

</script>

<template>
  <div 
    v-for="item in elements"
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
    @mousedown.stop="handleElementClick($event, item)"
  >
    <BoundingBox 
      v-if="selectedElement && selectedElement.id === item.id" 
      :element="item" 
    />
  </div>      
</template>

<style scoped lang="scss">
.element {
  cursor: pointer;
}
</style>
