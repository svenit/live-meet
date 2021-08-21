<template>
  <div class="layout-container py-3">
    <div class="main-room-menu">
      <a-button>
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
  </div>
</template>
<script>
import api from '@/api';
import utilities from '@/utils/utilities';
export default {
  data() {
    return {
      formCreateRoomRule: {
        name: [
          'name',
          {
            rules: [{ required: true, message: 'Please input your room name' }],
          },
        ],
        password: ['password'],
      },
      createRoomVisible: false,
      formCreateRoom: this.$form.createForm(this, { name: 'formCreateRoom' }),
      errorCreateRoomMessage: null,
      isCreatingRoom: false,
    };
  },
  methods: {
    createRoom(e) {
      e.preventDefault();
      this.errorCreateRoomMessage = null;
      this.formCreateRoom.setFields({
        password: {
          value: this.formCreateRoom.getFieldValue('password'),
          errors: null,
        },
      });
      this.formCreateRoom.validateFields(async (err, values) => {
        if (err) return;
        this.isCreatingRoom = true;
        try {
          const { data } = await api.room.create(values);
          this.$router.push({ name: 'app.room', params: { id: data.roomId } });
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
</style>
