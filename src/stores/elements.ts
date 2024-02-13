import { reactive } from 'vue';
import { defineStore } from 'pinia';
import type { Element } from '@/types/Element';

interface ElementState {
  elements: Element[],
  selectedElement: Element[];
}

export const useElementStore = defineStore('elementStore', () => {
  const state = reactive<ElementState>({
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
    selectedElement: []
  })
  // const elements = reactive<Element[]>([
  //   {
  //     id: '1',
  //     name: 'test',
  //     x: 0,
  //     y: 0,
  //     width: 100,
  //     height: 100,
  //     backgroundColor: '#333'
  //   }
  // ]);

  // const selectedElement = reactive<Element | null>(null);

  function addElement(element: Element) {
    state.elements.push(element);
  }

  function findElement(range: Element[], id: string) {
    return range.find(element => element.id === id);
  }

  function setSelectedElement(element: Element[]) {
    state.selectedElement = element;
  }

  function addSelectedElement(element: Element) {
    state.selectedElement.push(element);
  }

  function removeSelectedElement(element: Element) {
    state.selectedElement = state.selectedElement.filter(el => el.id !== element.id);
  }

  // 다른 필요한 메서드 추가 가능

  return { state, addElement, findElement, setSelectedElement, addSelectedElement, removeSelectedElement };
});