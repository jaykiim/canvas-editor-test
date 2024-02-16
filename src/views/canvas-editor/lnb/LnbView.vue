<script setup lang="ts">
import { ref } from 'vue';
import PagesView from './PagesView.vue';

const TABS = ['Pages', 'Layers', 'Assets'];

const selectedTab = ref<typeof TABS[number]>('Pages'); 

function onClickTab(tab: typeof TABS[number]) {
  selectedTab.value = tab;
}
</script>

<template>
  <div class="lnb-container">

    <!-- Tabs -->
    <div class="tab-container">
      <div 
        v-for="tab of TABS" 
        :key="tab"
        class="tab"
        :class="selectedTab === tab ? 'selected' : ''" 
        @click="onClickTab(tab)"
      >
        {{ tab }}
      </div>
    </div>

    <div class="contents-container">
      <PagesView v-if="selectedTab === 'Pages'"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lnb-container {
  width: 240px;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  
}
.tab-container {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
  .tab {
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
}

.contents-container {
  padding: 10px 15px;
}
</style>