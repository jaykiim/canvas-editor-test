<script setup lang="ts">
defineProps({
  left: { required: true, type: Number },
  top: { required: true, type: Number },
  width: { required: true, type: Number },
  height: { required: true, type: Number },
  scale: { required: true, type: Number },
})
</script>

<template>
  <div class="container">
    <div 
      class="drag-box" 
      :style="{ 
        left: left + 'px', 
        top: top + 'px', 
        width: width + 'px', 
        height: height + 'px' 
      }" 
    />
  </div>
</template>

<style scoped lang="scss">
.container {
  position: relative;
  width: 100%;
  height: 100%;
}
.drag-box {
  position: absolute;
  background-color: #4597f74d;
  border: 1px solid #4597f7;
}
</style>