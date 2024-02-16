import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import type { PageStore, PageType } from '@/types/Page';

const defaultPage = 'abc-11';

export const usePageStore = defineStore('pageStore', () => {
  const pageStore = reactive<PageStore>({
    'abc-11': {
      id: 'abc-11',
      name: 'Home',
      width: 800,
      height: 600,
      elements: [
        {
          id: '1',
          name: 'test',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          backgroundColor: '#333'
        },
        {
          id: '2',
          name: 'test2',
          x: 300,
          y: 300,
          width: 300,
          height: 250,
          backgroundColor: '#ccc'
        }
      ],
    },
    'test1': {
      id: 'test1',
      name: 'test1',
      width: 1440,
      height: 1080,
      elements: [
        {
          id: '2',
          name: 'test2',
          x: 300,
          y: 300,
          width: 300,
          height: 250,
          backgroundColor: '#ccc'
        }
      ],
    }
  });
  
  // const currentPage = reactive<PageType>(pageStore[defaultPage]);
  const currentPageId = ref(defaultPage);
  const currentPage = computed(() => pageStore[currentPageId.value]);

  function setPageRef(id: string, ref: HTMLDivElement) {
    pageStore[id].ref = ref;
  }

  function setCurrentPageId(id: string) {
    currentPageId.value = id;
  }

  return { pageStore, currentPageId, currentPage, setPageRef, setCurrentPageId };
});