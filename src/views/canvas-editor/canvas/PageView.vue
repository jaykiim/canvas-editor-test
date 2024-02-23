<script setup lang="ts">
import { watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePageStore } from '../stores/pages';
import ElementView from './components/ElementView.vue';

defineProps({
  scale: { type: Number, required: true },
  panX: { type: Number, required: true },
  panY: {type: Number, required: true }
});

// store init
const store = usePageStore();
const { currentPage: page, elements } = storeToRefs(store)

// bind page ref 
const pageRef = ref<HTMLDivElement>();
watch(page, () => {
  if (pageRef.value) {
    store.bindPageRef(page.value.id, pageRef.value);
  }
});
</script>

<template>
  <div 
    ref="pageRef"
    class="page"
    :style="{ left: panX + 'px', top: panY + 'px', width: `${page.width * scale}px`, height: `${page.height * scale}px` }"
  >
    <template v-for="element in elements" :key="element.id">
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
}
</style>