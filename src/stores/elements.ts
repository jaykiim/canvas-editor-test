import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Element } from '@/types/Element';

export const useElementStore = defineStore('elementStore', () => {
  const elements = ref<Element[]>([
    {
      id: '1',
      name: 'test',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      backgroundColor: '#333'
    }
  ]);

  const selectedElement = ref<Element | null>(null);

  function addElement(element: Element) {
    elements.value.push(element);
  }

  function getElements() {
    return elements.value;
  }

  function getSelectedElement() {
    return selectedElement.value;
  }

  function setSelectedElement(element: Element | null) {
    selectedElement.value = element;
  }


  // 다른 필요한 메서드 추가 가능

  return { elements, addElement, getElements, getSelectedElement, setSelectedElement };
});