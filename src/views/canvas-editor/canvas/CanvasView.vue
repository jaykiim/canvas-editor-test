<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { usePageStore } from '../stores/pages';
import PageView from './PageView.vue';
import DragBox from './components/DragBox.vue';
import type { MouseActionType } from '@/types/Canvas'; 
import { storeToRefs } from 'pinia';

const canvas = ref<HTMLDivElement>();
const currentAction = ref<MouseActionType>('');

// keyboard 
const spaceKeydown = ref<boolean>(false);

// mouse
const startDragX = ref<number>(0);
const startDragY = ref<number>(0);

// zoom 
const ZOOM_FACTOR = 0.05;
const scale = ref<number>(1); // 줌 배율

// page
const store = usePageStore();
const { currentPage: page, elements } = storeToRefs(store);
const panX = ref<number>(0);
const panY = ref<number>(0);
const pageW = ref<number>(800);
const pageH = ref<number>(600);

// drag-box
const showDragbox = ref<boolean>(false);
const dragboxX = ref<number>(0);
const dragboxY = ref<number>(0);
const dragboxWidth = ref<number>(0);
const dragboxHeight = ref<number>(0);

function handleMouseDown(e: MouseEvent) {
  store.setSelectedElements([]);
  startDragX.value = e.clientX;
  startDragY.value = e.clientY;

  // 영역 드래그 시
  if (!spaceKeydown.value && canvas.value) {
    const canvasRect = canvas.value.getBoundingClientRect();
    startDragX.value -= canvasRect.left;
    startDragY.value -= canvasRect.top;
    dragboxX.value = startDragX.value;
    dragboxY.value = startDragY.value;
  } 

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(e: MouseEvent) {  
  let deltaX = e.clientX - startDragX.value;
  let deltaY = e.clientY - startDragY.value;

  // 패닝
  if (spaceKeydown.value && !showDragbox.value) {
    setCurrentAction('move-canvas');
    panX.value += deltaX;
    panY.value += deltaY;
    startDragX.value = e.clientX;
    startDragY.value = e.clientY;
  }

  // 영역 선택 
  else if (canvas.value) {
    setCurrentAction('select-area');
    const canvasRect = canvas.value.getBoundingClientRect();
    deltaX -= canvasRect.left;
    deltaY -= canvasRect.top;

    showDragbox.value = true; 
    dragboxWidth.value = deltaX;
    dragboxHeight.value = deltaY;

    // 너비를 끝까지 줄일 경우 방향 변경
    if (dragboxWidth.value < 0) {
      dragboxX.value = e.clientX - canvasRect.left; 
      dragboxWidth.value *= -1;
    }

    // 높이를 끝까지 줄일 경우 방향 변경
    if (dragboxHeight.value < 0) {
      dragboxY.value = e.clientY - canvasRect.top;
      dragboxHeight.value *= -1;
    }

    // 영역 내 엘리먼트 존재 시 선택 목록에 추가
    const l1 = dragboxX.value;
    const t1 = dragboxY.value;
    const r1 = l1 + dragboxWidth.value;
    const b1 = t1 + dragboxHeight.value;
    const selected = elements.value.filter(e => {
      const l2 = e.x * scale.value + panX.value;
      const t2 = e.y * scale.value + panY.value;
      const r2 = l2 + e.width * scale.value;
      const b2 = t2 + e.height * scale.value;
      if ((l1 <= r2 && t1 <= b2) && (l2 <= r1 && t2 <= b1)) return true;
      else return false;  
    });

    store.setSelectedElements(selected);
  }
}

function handleMouseUp() {
  showDragbox.value = false;
  setCurrentAction('');
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
}

function handleWheel(e: WheelEvent) {
  // page lt를 기준으로 마우스 포인터가
  // l: r로 이동
  // lt: rb로 이동
  // lb: rt로 이동
  // --> x, y 모두 반대방향으로 이동한다
  // 얼만큼? x,y 각각 lt 지점과 마우스 포인터와의 거리만큼
  if (!page.value.ref) return;

  // 확대 배율 조정
  const prevScale = scale.value;
  const delta = e.deltaY
  if (delta > 0) zoomOut();
  else zoomIn();

  // .element-page ~ 마우스 포인터까지 거리
  const pagePos = page.value.ref.getBoundingClientRect();
  const x = (e.clientX - pagePos.x) / scale.value; 
  const y = (e.clientY - pagePos.y) / scale.value;
  
  const px = x / pageW.value;
  const py = y / pageH.value;
  const ds = scale.value - prevScale;
  const dw = pageW.value * ds;
  const dh = pageH.value * ds;
  panX.value -= px * dw;
  panY.value -= py * dh;
}

function zoomIn() {
  scale.value += ZOOM_FACTOR;
}

function zoomOut() {
  if (scale.value > 0.1) {
    scale.value -= ZOOM_FACTOR;
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === " ") {
    spaceKeydown.value = true;
  }
}

function onKeyup(e: KeyboardEvent) {
  if (e.key === " ") {
    spaceKeydown.value = false;
  }
}

function setCurrentAction(action: MouseActionType) {
  currentAction.value = action;
}

provide('currentAction', currentAction);
provide('setCurrentAction', setCurrentAction);

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('keyup', onKeyup);
})

onBeforeUnmount(() => {
  // 컴포넌트가 소멸되기 전에 이벤트 리스너 제거
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <div 
    ref="canvas" 
    class="canvas"
    @mousedown="handleMouseDown" 
    @wheel="handleWheel"
  >
    <DragBox 
      v-if="showDragbox" 
      :left="dragboxX" 
      :top="dragboxY" 
      :width="dragboxWidth" 
      :height="dragboxHeight" 
      :scale="scale"
    />
    <PageView
      :scale="scale"
      :pan-x="panX"
      :pan-y="panY"
    />
  </div>
</template>

<style scoped lang="scss">
.canvas {
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
  width: 100%;
  height: 100%;
}
</style>