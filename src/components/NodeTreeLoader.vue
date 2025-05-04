<template>
  <div class="loader-container">
    <svg class="tree-svg" width="200" height="150">
      <!-- Lines connecting nodes -->
      <line
          v-for="(line, index) in lines"
          :key="'line-' + index"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          stroke="#4CAF50"
          stroke-width="2"
          :style="{ 'stroke-dashoffset': line.progress }"
          class="animated-line"
      />
      <!-- Nodes with blinking animation -->
      <circle
          v-for="(node, index) in nodes"
          :key="'node-' + index"
          :cx="node.x"
          :cy="node.y"
          r="5"
          fill="#4CAF50"
          class="blinking-node"
      />
      <!-- Check icons on top of nodes -->
      <ph-check-circle
          v-for="(node, index) in nodes"
          :key="'check-' + index"
          :x="node.x - 10"
          :y="node.y - 10"
          size="20"
          color="#4CAF50"
          class="check-icon"
          :style="{ opacity: node.checked && 1, 'z-index': 10 }"
      />
    </svg>
  </div>
  <div class="text-green-500 text-lg pt-5 text-center">Распознование конфликт интересов...</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { PhCheckCircle } from '@phosphor-icons/vue';

const nodes = ref([
  { x: 100, y: 15, checked: false }, // Parent
  { x: 50, y: 60, checked: false }, // Child 1
  { x: 150, y: 60, checked: false }, // Child 2
  { x: 25, y: 120, checked: false }, // Grandchild 1
  { x: 75, y: 120, checked: false }, // Grandchild 2
  { x: 125, y: 120, checked: false }, // Grandchild 3
  { x: 175, y: 120, checked: false }, // Grandchild 4
]);

const lines = ref([
  // Parent to Child 1
  { x1: 100, y1: 20, x2: 50, y2: 55, progress: 100 },
  // Parent to Child 2
  { x1: 100, y1: 20, x2: 150, y2: 55, progress: 100 },
  // Child 1 to Grandchild 1
  { x1: 50, y1: 65, x2: 25, y2: 115, progress: 100 },
  // Child 1 to Grandchild 2
  { x1: 50, y1: 65, x2: 75, y2: 115, progress: 100 },
  // Child 2 to Grandchild 3
  { x1: 150, y1: 65, x2: 125, y2: 115, progress: 100 },
  // Child 2 to Grandchild 4
  { x1: 150, y1: 65, x2: 175, y2: 115, progress: 100 },
]);

let animationInterval = null;
const animateLines = () => {
  lines.value.forEach((line) => (line.progress = 100));
  nodes.value.forEach((node) => (node.checked = false));

  let index = 0;
  const animateLine = () => {
    if (index < lines.value.length) {
      lines.value[index].progress = 0;
      const line = lines.value[index];
      nodes.value.forEach((node) => {
        if (
            (Math.abs(node.x - line.x2) < 1 && Math.abs(node.y - line.y2) < 1) ||
            (Math.abs(node.x - line.x1) < 1 && Math.abs(node.y - line.y1) < 1)
        ) {
          node.checked = true;
        }
      });
      index++;
    } else {
      index = 0;
      lines.value.forEach((line) => (line.progress = 100));
      nodes.value.forEach((node) => (node.checked = false));
    }
  };

  animationInterval = setInterval(animateLine, 450);
};

onMounted(() => {
  animateLines();
});

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval);
  }
});
</script>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.tree-svg {
  background: transparent;
}

.animated-line {
  stroke-dasharray: 100;
  transition: stroke-dashoffset 0.8s ease-in-out;
}

.blinking-node {
  animation: blink 1.5s infinite;
}

.check-icon {
  transition: opacity 0.3s ease-in-out;
}

@keyframes blink {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>