<template>
  <div class="layout-container py-3">
    <div class="main-room-menu">
      <a-button>
        <img src="@/assets/images/join-room.svg" class="mr-3" /><span class="label"
          >Join</span
        >
      </a-button>
      <a-button>
        <img src="@/assets/images/create-room.svg" class="mr-3" /><span class="label"
          >Create</span
        >
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.main-room-menu >>> .ant-btn {
  display: inline-flex;
  align-items: center;
  width: 176px;
  height: 72px;
  margin-right: 16px;
  border-radius: 8px;
  background-color: #fff;
  font-size: 16px;
  border-color: #fff;
}
</style>
