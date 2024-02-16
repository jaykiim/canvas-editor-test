<script setup lang="ts">
import { usePageStore } from '../stores/pages';

const { pageStore, currentPage, setCurrentPageId } = usePageStore();

function onClickPage(id: string) {
  // console.log('currentPage', currentPage, pageStore[id]);
  // Object.assign(pageStore[id], currentPage);
  setCurrentPageId(id);
  console.log('current page id ', currentPage.id);
}
</script>

<template>
  <div class="header">
    <div class="btn-add">+</div>
  </div>

  <div class="page-list">
    <div 
      v-for="page in pageStore" 
      :class="currentPage.id === page.id ? 'selected' : ''" 
      :key="page.id" 
      class="page-item"
      @click="onClickPage(page.id)"
    >
      {{ page.name }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
 .btn-add {
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
 }
}

.page-item {
  color: #ababab;
  font-weight: 500;
  font-size: 0.8rem;
  cursor: pointer;
  &.selected {
    color: #333;
  }

  &:hover {
    color: #333;
  }
}
</style>