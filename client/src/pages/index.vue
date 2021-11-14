<template>
  <div class="layout-container py-3">
    <div class="main-room-menu">
      <a-button @click="joinRoomVisible = true">
        <img src="@/assets/images/join-room.svg" class="mr-3" /><span
          class="label"
          >Join</span
        >
      </a-button>
      <a-button @click="createRoomVisible = true">
        <img src="@/assets/images/create-room.svg" class="mr-3" /><span
          class="label"
          >Create</span
        >
      </a-button>
    </div>
    <div class="row mt-3">
      <div class="col-6">
        <div class="main-card">
          <h5 style="font-size: 15px" class="mb-3">Host's Room list</h5>
          <template v-if="rooms.length == 0">
            <a-empty class="mt-5" />
          </template>
          <template v-else>
            <div v-for="(room, index) in rooms" :key="index">
              <p>
                <a-icon type="calendar" class="mr-2" />
                {{ new Date(room.createdAt).toDateString() }}
              </p>
              <div class="d-flex justify-content-between">
                <p class="font-weight-bold">{{ room.name }}</p>
                <a-button
                  @click="
                    $router.push({
                      name: 'app.room',
                      params: { id: room.roomId },
                    })
                  "
                  size="small"
                  type="primary"
                >
                  Join
                </a-button>
              </div>
              <p>Room ID: {{ room.roomId }}</p>
              <a-divider v-if="index + 1 < rooms.length" />
            </div>
          </template>
        </div>
      </div>
      <div class="col-6">
        <div class="main-card">
          <h5 style="font-size: 15px" class="mb-3">Guest's Room list</h5>
          <template v-if="roomsGuest.length == 0">
            <a-empty class="mt-5" />
          </template>
          <template v-else>
            <div v-for="(room, index) in roomsGuest" :key="index">
              <p>
                <a-icon type="calendar" class="mr-2" />
                {{ new Date(room.createdAt).toDateString() }}
              </p>
              <div class="d-flex justify-content-between">
                <p class="font-weight-bold">{{ room.room.name }}</p>
                <a-button
                  @click="
                    $router.push({
                      name: 'app.room',
                      params: { id: room.room.roomId },
                    })
                  "
                  size="small"
                  type="primary"
                >
                  Join
                </a-button>
              </div>
              <p class="mb-2">Room ID: {{ room.room.roomId }}</p>
              <p>
                Host:
                <span class="font-weight-bold">{{ room.user.fullName }}</span>
              </p>
              <a-divider v-if="index + 1 < roomsGuest.length" />
            </div>
          </template>
        </div>
      </div>
    </div>
    <a-modal
      @cancel="createRoomVisible = false"
      @ok="createRoom"
      class="form-modal"
      :visible="createRoomVisible"
      title="Create"
      :ok-button-props="{ props: { loading: isCreatingRoom } }"
    >
      <div class="d-flex justify-content-center mb-3">
        <img
          class="w-100"
          src="@/assets/images/create-room-preview-teacher.svg"
          alt=""
        />
        <img
          class="w-100"
          src="@/assets/images/create-room-preview.svg"
          alt=""
        />
      </div>
      <a-form @submit="createRoom" :form="formCreateRoom">
        <a-alert
          class="mb-1"
          v-if="errorCreateRoomMessage"
          type="error"
          :message="errorCreateRoomMessage"
          banner
        />
        <a-form-item label="Room name" class="login-form-item">
          <a-input
            v-decorator="formCreateRoomRule.name"
            placeholder="Enter your room name"
          />
        </a-form-item>
        <a-form-item label="Password ( Optional )" class="login-form-item">
          <a-input
            v-decorator="formCreateRoomRule.password"
            placeholder="Enter your password ( Optional )"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      @cancel="joinRoomVisible = false"
      @ok="joinRoom"
      class="form-modal"
      :visible="joinRoomVisible"
      title="Join room"
      okText="Join"
      :ok-button-props="{ props: { loading: isJoiningRoom } }"
    >
      <a-form @submit="joinRoom" :form="formJoinRoom">
        <a-form-item label="Room ID" class="login-form-item">
          <a-input
            v-decorator="formJoinRoomRule.roomId"
            placeholder="Enter your room id"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api";
import utilities from "@/utils/utilities";
export default {
  data() {
    return {
      formCreateRoomRule: {
        name: [
          "name",
          {
            rules: [{ required: true, message: "Please input your room name" }],
          },
        ],
        password: ["password"],
      },
      formJoinRoomRule: {
        roomId: [
          "roomId",
          {
            rules: [{ required: true, message: "Please input your room id" }],
          },
        ],
      },
      createRoomVisible: false,
      formCreateRoom: this.$form.createForm(this, { name: "formCreateRoom" }),
      formJoinRoom: this.$form.createForm(this, { name: "formJoinRoom" }),
      errorCreateRoomMessage: null,
      isCreatingRoom: false,
      joinRoomVisible: false,
      isJoiningRoom: false,
      rooms: [],
      roomsGuest: [],
    };
  },
  created() {
    this.getRooms();
    this.getRoomsGuest();
  },
  methods: {
    createRoom(e) {
      e.preventDefault();
      this.errorCreateRoomMessage = null;
      this.formCreateRoom.setFields({
        password: {
          value: this.formCreateRoom.getFieldValue("password"),
          errors: null,
        },
      });
      this.formCreateRoom.validateFields(async (err, values) => {
        if (err) return;
        this.isCreatingRoom = true;
        try {
          const { data } = await api.room.create(values);
          this.$router.push({ name: "app.room", params: { id: data.roomId } });
        } catch (e) {
          this.isCreatingRoom = false;
          if (e.errors) {
            return utilities.showFormErrors(this.formCreateRoom, e.errors);
          }
          this.errorCreateRoomMessage = e.message;
        }
      });
      this.isCreatingRoom = false;
    },
    joinRoom(e) {
      e.preventDefault();
      this.formJoinRoom.validateFields(async (err, values) => {
        if (err) return;
        const { data } = await api.room.joinRoom(values);
        if (!data.success) {
          return this.$message.error("Can not found this room");
        }
        this.$router.push({ name: "app.room", params: { id: values.roomId } });
      });
    },
    async getRooms() {
      const { data } = await api.room.getOwnerRoom();
      if (data.success) {
        this.rooms = data.rooms;
      }
    },
    async getRoomsGuest() {
      const { data } = await api.room.getRoomsGuest();
      if (data.success) {
        this.roomsGuest = data.rooms;
      }
    },
  },
};
</script>
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
.main-card {
  border-radius: 8px;
  background-color: #fff;
  background-color: #fff;
  padding: 20px;
}
.form-modal >>> .ant-modal {
  width: 400px !important;
}
.form-modal >>> label {
  line-height: 20px;
  margin-bottom: 0px !important;
}
.form-modal >>> .ant-form-item {
  margin-bottom: 0px;
}
.form-modal >>> .ant-modal-body {
  padding: 0px 24px 24px 24px !important;
}
</style>
