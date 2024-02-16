<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ElementView from './components/ElementView.vue';
import { usePageStore } from '../stores/pages';

defineProps({
  scale: { type: Number, required: true },
  panX: { type: Number, required: true },
  panY: {type: Number, required: true }
});

// page init
const { currentPage: page, setPageRef } = usePageStore();
const pageRef = ref<HTMLDivElement>();
onMounted(() => {
  if (pageRef.value) {
    setPageRef(page.id, pageRef.value);
  }
});
</script>

<template>
  <div 
    ref="pageRef"
    class="page"
    :style="{ left: panX + 'px', top: panY + 'px', width: `${page.width * scale}px`, height: `${page.height * scale}px` }"
  >
    <template v-for="element in page.elements" :key="element.id">
      <ElementView 
        :element="element"
        :scale="scale"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.page {
  position: absolute;
  background-color: #fff;
  transform: translate(50%, 25%);
}
</style>