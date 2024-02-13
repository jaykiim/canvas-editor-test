<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useElementStore } from '@/stores/elements';
import ElementView from './components/ElementView.vue';

const ZOOM_FACTOR = 0.05;

const canvas = ref<HTMLDivElement>();
const container = ref<HTMLDivElement>();

const startDragX = ref<number>(0);
const startDragY = ref<number>(0);
const panX = ref<number>(0);
const panY = ref<number>(0);
const conWidth = ref<number>(800);
const conHeight = ref<number>(600);
const scale = ref<number>(1); // 줌 배율

const spaceKeydown = ref<boolean>(false);

const { state, setSelectedElement } = useElementStore();

function handleMouseDown(e: MouseEvent) {
  console.log('mouse event: ', e)
  startDragX.value = e.clientX;
  startDragY.value = e.clientY;
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(e: MouseEvent) {
  if (canvas.value && spaceKeydown.value) {
    const deltaX = e.clientX - startDragX.value;
    const deltaY = e.clientY - startDragY.value;
    panX.value += deltaX;
    panY.value += deltaY;
    startDragX.value = e.clientX;
    startDragY.value = e.clientY;
  }
}

function handleMouseUp() {
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

function handleCanvasClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target) {
    const clickedElement = target.closest('.element');
    // 클릭한 요소의 조상 중에 .element가 없는 경우 = 빈 공간을 클릭한 경우
    if (!clickedElement) { 
      setSelectedElement([]);
    }
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
    @click="handleCanvasClick"
  >
    <!-- <DesignElement :zoomLevel="scale" :panX="panX" :panY="panY"/> -->
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
}
</style>