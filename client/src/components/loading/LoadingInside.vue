<template>
  <transition name="fade">
    <div class="block">
      <div class="loading-spinner" style="">
        <div class="loading-spinner-box">
          <div class="cube">
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
            <div class="side"></div>
          </div>
          <p class="mt-5 text text-light">{{ title }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
.loading-spinner {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 8;
}

.loading-spinner-box {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  text-align: center;
}

.cube {
  margin: auto;
  margin-bottom: 0.5em;
  font-size: 50px;
  height: 1em;
  width: 1em;
  position: relative;
  transform: rotatex(30deg) rotatey(45deg);
  transform-style: preserve-3d;
  animation: cube-spin 1.5s linear infinite;
}

.cube .side {
  transform-style: preserve-3d;
}

.cube .side,
.cube .side:before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.cube .side:before {
  content: '';
  background-color: #fff;
  transform: translatez(0.5em);
  animation: cube-explode 1.5s linear infinite;
  opacity: 0.5;
}

.cube .side:first-child {
  transform: rotatey(90deg);
}

.cube .side:nth-child(2) {
  transform: rotatey(180deg);
}

.cube .side:nth-child(3) {
  transform: rotatey(270deg);
}

.cube .side:nth-child(4) {
  transform: rotatey(1turn);
}

.cube .side:nth-child(5) {
  transform: rotateX(90deg);
}

.cube .side:nth-child(6) {
  transform: rotateX(-90deg);
}

.cube .side:first-child:before {
  opacity: 1;
  background-color: #ffc400;
}

@keyframes cube-spin {
  0% {
    transform: rotatex(30deg) rotatey(45deg);
  }

  to {
    transform: rotatex(30deg) rotatey(405deg);
  }
}

@keyframes cube-explode {
  0% {
    transform: translatez(0.5em);
  }

  50% {
    transform: translatez(0.75em);
  }

  to {
    transform: translatez(0.5em);
  }
}
</style>
