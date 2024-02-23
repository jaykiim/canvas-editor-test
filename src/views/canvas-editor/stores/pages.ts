import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import type { PageStore } from '@/types/Page';
import type { Element } from '@/types/Element';

const defaultPage = 'abc-11';

export const usePageStore = defineStore('pageStore', () => {

/* ================================================================================================================================================================================================
Page  
================================================================================================================================================================================================ */
  
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
      selectedElements: []
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
      selectedElements: []
    }
  });

  const currentPageId = ref(defaultPage);
  const currentPage = computed(() => pageStore[currentPageId.value]);  

  function bindPageRef(id: string, ref: HTMLDivElement) {
    pageStore[id].ref = ref;
  }

  function setCurrentPageId(id: string) {
    currentPageId.value = id;
  }

/* ================================================================================================================================================================================================
Elements  
================================================================================================================================================================================================ */

  const elements = computed(() => currentPage.value.elements); 
  const selectedElements = computed(() => currentPage.value.selectedElements);

  function addElement(element: Element) {
    pageStore[currentPageId.value].elements.push(element);
  }

  function findElement(range: Element[], id: string) {
    return range.find(element => element.id === id);
  }

  function setSelectedElements(element: Element[]) {
    pageStore[currentPageId.value].selectedElements = element;
  }

  function addSelectedElement(element: Element) {
    pageStore[currentPageId.value].selectedElements.push(element);
  }

  function removeSelectedElement(element: Element) {
    pageStore[currentPageId.value].selectedElements = pageStore[currentPageId.value].selectedElements.filter(el => el.id !== element.id);
  }

  return { 
    pageStore, currentPage, bindPageRef, setCurrentPageId, 
    elements, selectedElements, addElement, findElement, setSelectedElements, addSelectedElement, removeSelectedElement 
  };
});