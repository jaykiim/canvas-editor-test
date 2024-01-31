<script setup lang="ts">
import { ref, computed } from 'vue';
import { useElementStore } from '@/stores/elements';
import BoundingBox from './BoundingBox.vue';
import type { Element } from '@/types/Element';

const elements = useElementStore().getElements();
const selectedElement = ref<Element | null>(null);

const zoomLevel = ref(1);
const panX = ref(0);
const panY = ref(0);

const handleElementClick = (element: Element) => {
  selectedElement.value = element;
};

const zoomedPanX = computed(() => panX.value / zoomLevel.value);
const zoomedPanY = computed(() => panY.value / zoomLevel.value);

const updateZoom = (newZoomLevel: number) => {
  panX.value = zoomedPanX.value * newZoomLevel;
  panY.value = zoomedPanY.value * newZoomLevel;
};
</script>

<template>
  <div class="design-canvas">
    <div 
      v-for="item in elements" 
      :key="item.id"
      class="design-element" 
      :style="{
        left: `${item.x * zoomLevel + panX}px`,
        top: `${item.y * zoomLevel + panY}px`,
        width: `${item.width * zoomLevel}px`,
        height: `${item.height * zoomLevel}px`,
        backgroundColor: item.backgroundColor,
        color: item.textColor,
        transform: `scale(${zoomLevel})`,
        position: 'absolute', // 변경된 부분
      }"
      @mousedown.stop="handleElementClick(item)"
    >
      <BoundingBox 
        v-if="selectedElement && selectedElement.id === item.id" 
        :element="item" 
      />
      {{ item.name }}
    </div>      
  </div>
</template>

<style scoped lang="scss">
.design-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.design-element {
  cursor: pointer;
}
</style>
