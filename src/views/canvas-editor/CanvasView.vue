<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useElementStore } from '@/stores/elements';
import ElementView from './components/ElementView.vue';
import DragBox from './components/DragBox.vue';

const canvas = ref<HTMLDivElement>();

// keyboard 
const spaceKeydown = ref<boolean>(false);

// mouse
const startDragX = ref<number>(0);
const startDragY = ref<number>(0);

// zoom 
const ZOOM_FACTOR = 0.05;
const scale = ref<number>(1); // 줌 배율

// .element-container
const container = ref<HTMLDivElement>();
const panX = ref<number>(0);
const panY = ref<number>(0);
const conWidth = ref<number>(800);
const conHeight = ref<number>(600);

// drag-box
const showDragbox = ref<boolean>(false);
const dragboxX = ref<number>(0);
const dragboxY = ref<number>(0);
const dragboxWidth = ref<number>(0);
const dragboxHeight = ref<number>(0);

const { state, setSelectedElement } = useElementStore();

function handleMouseDown(e: MouseEvent) {
  setSelectedElement([]);

  startDragX.value = e.clientX;
  startDragY.value = e.clientY;

  // 영역 드래그 시
  if (!spaceKeydown.value && canvas.value) {
    const canvasTop = canvas.value.getBoundingClientRect().top;
    startDragY.value -= canvasTop;
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
    panX.value += deltaX;
    panY.value += deltaY;
    startDragX.value = e.clientX;
    startDragY.value = e.clientY;
  }

  // 영역 선택 
  else if (canvas.value) {
    const canvasTop = canvas.value.getBoundingClientRect().top;
    deltaY -= canvasTop;

    showDragbox.value = true; 
    dragboxWidth.value = deltaX;
    dragboxHeight.value = deltaY;

    // 너비를 끝까지 줄일 경우 방향 변경
    if (dragboxWidth.value < 0) {
      dragboxX.value = e.clientX; 
      dragboxWidth.value *= -1;
    }

    // 높이를 끝까지 줄일 경우 방향 변경
    if (dragboxHeight.value < 0) {
      dragboxY.value = e.clientY - canvasTop;
      dragboxHeight.value *= -1;
    }

    // 영역 내 엘리먼트 존재 시 선택 목록에 추가
    const l1 = dragboxX.value;
    const t1 = dragboxY.value;
    const r1 = l1 + dragboxWidth.value;
    const b1 = t1 + dragboxHeight.value;

    const selected = state.elements.filter(e => {
      const l2 = e.x * scale.value + panX.value;
      const t2 = e.y * scale.value + panY.value;
      const r2 = l2 + e.width * scale.value;
      const b2 = t2 + e.height * scale.value;
      if ((l1 <= r2 && t1 <= b2) && (l2 <= r1 && t2 <= b1)) return true;
      else return false;  
    });

    setSelectedElement(selected);
  }
}

function handleMouseUp() {
  showDragbox.value = false;
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
}

function handleWheel(e: WheelEvent) {
  // container lt를 기준으로 마우스 포인터가
  // l: r로 이동
  // lt: rb로 이동
  // lb: rt로 이동
  // --> x, y 모두 반대방향으로 이동한다
  // 얼만큼? x,y 각각 lt 지점과 마우스 포인터와의 거리만큼
  if (!container.value) return;

  // 확대 배율 조정
  const prevScale = scale.value;
  const delta = e.deltaY
  if (delta > 0) zoomOut();
  else zoomIn();

  // .element-container ~ 마우스 포인터까지 거리
  const containerPos = container.value.getBoundingClientRect();
  const x = (e.clientX - containerPos.x) / scale.value; 
  const y = (e.clientY - containerPos.y) / scale.value;

  const px = x / conWidth.value;
  const py = y / conHeight.value;
  const ds = scale.value - prevScale;
  const dw = conWidth.value * ds;
  const dh = conHeight.value * ds;
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
    <div 
      ref="container"
      class="element-container"
      :style="{ left: panX + 'px', top: panY + 'px', width: `${conWidth * scale}px`, height: `${conHeight * scale}px` }"
    >
      <template v-for="element in state.elements" :key="element.id">
        <ElementView 
          :element="element"
          :scale="scale"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.canvas {
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
  width: 100%;
  height: calc(100% - 3rem);
}
.element-container {
  position: absolute;
  border: 3px solid red;
}
</style>