<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useElementStore } from '@/stores/elements';
import BoundingBox from './BoundingBox.vue';
import type { Element } from '@/types/Element';

const props = defineProps({
  zoomLevel: { type: Number, required: true },
  panX: { type: Number, required: true },
  panY: { type: Number, required: true }
})

const { state, setSelectedElement } = useElementStore();
const mouseX = ref(0);
const mouseY = ref(0);


const handleElementClick = (element: Element) => {
  setSelectedElement(element);
};

// function test(item: Element) {
//   return bool && ((item.x + props.panX) > mouseX.value) ? 
//         (item.x + props.panX) + (200 * (props.zoomLevel - 1))
//       : (item.x + props.panX) - (200 * (props.zoomLevel - 1)) 
// }

onMounted(() => {
  window.addEventListener('mousemove', (e) => {
    mouseX.value = e.clientX;
    mouseY.value = e.clientY;
  })
})
</script>

<template>
  <div 
    v-for="item in state.elements"
    :key="item.id"
    class="element"
    :style="{
      left: `${(item.x + panX)}px`,
      // left: `${ bool && ((item.x + panX) > mouseX) 
      // ? (item.x + panX) + (200 * (zoomLevel - 1))
      // : (item.x + panX) - (200 * (zoomLevel - 1)) }px`,
      top: `${(item.y + panY)}px`,
      width: `${item.width}px`,
      height: `${item.height}px`,
      backgroundColor: item.backgroundColor,
      transform: `scale(${zoomLevel})`,
      color: item.textColor,
      position: 'absolute',
    }"
    @mousedown.stop="handleElementClick(item)"
  >
    <BoundingBox 
      v-if="state.selectedElement && state.selectedElement.id === item.id" 
      :zoom-level="zoomLevel"
    />
  </div>      
</template>

<style scoped lang="scss">
.element {
  cursor: pointer;
}
</style>
