<template>
  <div class="position-relative">
    <template v-if="!isInRoom">
      <div class="header d-flex py-1 border-bottom">
        <div class="container d-flex justify-content-between align-items-center">
          <div @click="$router.push({name: 'app.index'})" class="pointer media align-items-center">
            <img style="width: 50px" src="@/assets/images/logo.png" alt="" />
            <h6>Live Meet</h6>
          </div>
          <div class="d-flex align-items-center">
            <a-avatar class="ml-3 mr-2">{{ user.fullName ? user.fullName[0] : 'U' }}</a-avatar>
            <div>{{ user.fullName }}</div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="screen-setup row">
          <div class="col-lg-7 col-md-6 col-sm-12 position-relative p-0">
            <video style="height: 400px" autoplay id="my-video"></video>
            <p
              class="video-cam-status text-white text-center position-absolute"
            >
              <span v-if="isLoadingVideo"> Camera is preparing... </span>
              <span v-else-if="!videoStatus"> Camera is turn off </span>
            </p>
            <div
              v-show="audioStatus"
              id="preview-tune"
              class="audio-tune position-absolute"
            >
              <div id="tune-1" class="tune"></div>
              <div id="tune-2" class="tune"></div>
              <div id="tune-3" class="tune"></div>
            </div>
            <div class="group-button position-absolute">
              <a-button
                size="large"
                class="mx-2"
                :type="audioStatus ? 'default' : 'danger'"
                shape="circle"
                @click="requestAudio"
              >
                <ion-icon
                  class="video-setup-icon"
                  :name="audioStatus ? 'mic' : 'mic-off'"
                ></ion-icon>
              </a-button>
              <a-button
                size="large"
                class="mx-2"
                :type="videoStatus ? 'default' : 'danger'"
                shape="circle"
                @click="requestVideo"
                :disabled="isLoadingVideo"
              >
                <ion-icon
                  class="video-setup-icon"
                  :name="videoStatus ? 'videocam' : 'videocam-off'"
                ></ion-icon>
              </a-button>
            </div>
          </div>
          <div class="col-lg-5 col-md-6 col-sm-12 text-center p-0">
            <div v-if="room">
              <h4 style="font-size: 28px" class="els">
                {{ room.name }}
              </h4>
              <img
                style="width: 200px; image-rendering: pixelated"
                :src="`https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=${url}`"
                alt=""
              />
              <p>
                Room ID:
                <span class="font-weight-bold">{{ room.roomId }}</span>
              </p>
              <div class="action-button mt-4">
                <a-button
                  @click="connectToServer"
                  size="large"
                  type="primary"
                  shape="round"
                >
                  Join now</a-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="video-grid-view position-relative" v-else>
      <div class="video-grid-container row w-100 h-100 m-0 p-5">
        <div
          :class="[
            hasOtherUsers ? 'col-8' : 'col-12',
            { 'd-none': !isHasUserShareScreen && hasOtherUsers },
          ]"
          id="main-screen"
          class="position-relative p-1"
        >
          <div class="user-name-video">
            You
          </div>
          <video
            class="w-100 main-video"
            :class="{ 'presentation-mode': isSharingScreen }"
            id="my-main-video"
          ></video>
        </div>
        <div
          v-show="hasOtherUsers"
          :class="[!isHasUserShareScreen && hasOtherUsers ? 'col-12' : 'col-3 video-grid-focus', {'d-none': !hasOtherUsers}]"
          class="video-box p-1"
          id="video-grid"
        >
          <div v-show="hasOtherUsers" id="my-video-grid" class="video-item position-relative">
            <div class="user-name-video">
              You
            </div>
            <video
              :class="{ 'presentation-mode': isSharingScreen }"
              autoplay
              id="my-video"
            ></video>
            <div v-show="audioStatus" id="my-tune" class="audio-tune">
              <div id="tune-1" class="tune"></div>
              <div id="tune-2" class="tune"></div>
              <div id="tune-3" class="tune"></div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 94%" class="group-button group-button-in-call position-absolute">
        <div class="px-1 w-100 d-flex justify-content-between align-items-center">
          <div class="text-white">
            {{ currentTime }}  <span class="mx-2">|</span>  {{ room.roomId }}
          </div>
          <div style="left: -65px" class="position-relative">
            <a-button
              class="mx-1"
              :type="audioStatus ? 'default' : 'danger'"
              shape="circle"
              @click="toggleMicroStreaming"
            >
              <ion-icon
                class="video-setup-icon"
                :name="audioStatus ? 'mic' : 'mic-off'"
              ></ion-icon>
            </a-button>
            <a-button
              class="mx-1"
              :type="videoStatus ? 'default' : 'danger'"
              shape="circle"
              @click="toggleVideoStreaming"
              :disabled="isLoadingVideo"
            >
              <ion-icon
                class="video-setup-icon"
                :name="videoStatus ? 'videocam' : 'videocam-off'"
              ></ion-icon>
            </a-button>
            <a-button
              class="mx-1"
              :type="isSharingScreen ? 'primary' : 'default'"
              shape="circle"
              @click="toggleScreenStreaming"
            >
              <ion-icon class="video-setup-icon" name="push"></ion-icon>
            </a-button>
            <a-button
              class="mx-1 w-auto"
              type="danger"
              shape="round"
              @click="quitRoom"
            >
              <ion-icon class="video-setup-icon" name="power"></ion-icon>
            </a-button>
            <a-drawer
              title="Chat"
              placement="right"
              :closable="true"
              :visible="chatVisible"
              @close="chatVisible = false"
              :width="300"
            >
              <div style="height: calc(100vh - 130px); overflow: auto" id="chat-log" class="chat-log">
                <div v-for="(message, index) in messages" :key="index" class="mb-2">
                  <span class="font-weight-bold">{{ message.user.fullName }}: </span> {{ message.message }}
                </div>
              </div>
              <div class="chat-box position-absolute" style="bottom: 20px">
                <a-input-search
                  placeholder="Type your message here..."
                  @search="onSubmitChat"
                  v-model="messageText"
                >
                  <a-button slot="enterButton">
                    <ion-icon name="send"></ion-icon>
                  </a-button>
                </a-input-search>
              </div>
            </a-drawer>
            <a-drawer
              title="Users"
              placement="right"
              :closable="true"
              :visible="userVisible"
              @close="userVisible = false"
              :width="300"
            >
              <div id="chat-log" class="chat-log">
                <div v-for="(userRoom, index) in users" :key="index" class="mb-3 d-flex justify-content-between align-items-center">
                  <div class="media align-items-center">
                    <a-avatar class="mr-2">{{ userRoom.fullName[0] }}</a-avatar>
                    <div>
                      <span class="font-weight-bold">{{ userRoom.fullName }}</span>
                      <span v-if="room.host.id == userRoom.id">( {{ userRoom.id == user.id ? 'You - Host' : 'Host' }} )</span>
                      <span v-else-if="userRoom.id == user.id">( You )</span>
                    </div>
                  </div>
                  <div v-if="room.host.id != userRoom.id && room.host.id == user.id">
                    <a-button @click="kickUser(userRoom.id)" shape="circle" type="default" class="mx-1">
                      <a-icon type="user-delete" />
                    </a-button>
                  </div>
                </div>
              </div>
            </a-drawer>
          </div>
          <div>
            <a-button
              class="mx-1"
              type="default"
              shape="circle"
              @click="userVisible = true"
            >
              <a-badge :count="users.length">
                <ion-icon class="video-setup-icon"name="person"></ion-icon>
              </a-badge>
            </a-button>
            <a-button
              class="mx-1"
              type="default"
              shape="circle"
              @click="chatVisible = true, unReadMessage = 0, scrollToBottomChat()"
            >
              <a-badge :count="unReadMessage">
                <ion-icon class="video-setup-icon"name="chatbubbles"></ion-icon>
              </a-badge>
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showBlockedModal" class="blocked-modal">
      <div class="close-modal pointer">
        <ion-icon
          @click="showBlockedModal = false"
          class="text-white"
          style="font-size: 40px; visibility: visible"
          name="close-outline"
        ></ion-icon>
      </div>
      <div class="content">
        <img src="@/assets/images/permission-blocked.png" alt="" />
        <div class="content-title text-white pt-4">
          <h4 class="text-white text-center font-weight-normal">
            <span v-if="isAudioBlocked">Microphone</span>
            <span v-if="blockedAll"> and </span>
            <span v-if="isVideoCamBlocked">Camera</span>
            <span>{{ blockedAll ? "are" : "is" }} blocked</span>
          </h4>
          <p class="text-center">
            Live Meet needs access to your camera or microphone. To us Live Meet
            Live Meet
          </p>
          <li class="mb-2">
            Click the camera blocked icon in your browser's address bar
          </li>
          <li>Allow access and then refresh the page</li>
        </div>
      </div>
    </div>
    <a-modal class="form-modal" @ok="validateRoomPassword" @cancel="passwordModalVisible = false" :visible="passwordModalVisible" title="Enter room's password">
      <div class="ant-col ant-form-item-label">
        <label class="ant-form-item-required">Password</label>
      </div>
      <a-input v-model="password" placeholder="Please enter password" />
    </a-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import api from "@/api";
import socket from "@/plugins/socket-io";
export default {
  data() {
    return {
      url: document.location.href,
      isFetching: false,
      videoStatus: false,
      audioStatus: false,
      isAudioBlocked: false,
      isVideoCamBlocked: false,
      showBlockedModal: false,
      stream: null,
      videoStream: null,
      audioStream: null,
      screenStream: null,
      room: null,
      voiceTune: 0,
      audioContext: null,
      isLoadingVideo: false,
      isInRoom: false,
      peer: null,
      peers: {},
      peerId: null,
      connectedPeers: [],
      peersList: [],
      isSharingScreen: false,
      isHasUserShareScreen: false,
      chatVisible: false,
      messages: [],
      unReadMessage: 0,
      messageText: '',
      usersList: {},
      users: [],
      userVisible: false,
      currentTime: '',
      forceExit: false,
      passwordModalVisible: false,
      password: ''
    };
  },
  computed: {
    blockedAll() {
      return this.isAudioBlocked && this.isVideoCamBlocked;
    },
    hasOtherUsers() {
      return this.peersList.length > 0;
    },
    ...mapState("auth", {
      tokenUser: state => state.tokenUser,
      user: (state) => state.user,
    }),
  },
  async created() {
    this.$root.$loading.start();
    await this.fetchRoom();
    this.$root.$loading.finish();
    this.currentTime = this.getCurrentTime()
    setInterval(() => {
      this.currentTime = this.getCurrentTime()
    }, 1000)
  },
  destroyed() {
    this.forceExit = true
    socket.terminate()
  },
  methods: {
    getCurrentTime() {
      const date = new Date();
      const time = `${date.getHours()}:${date.getMinutes()}`
      return time
    },
    async fetchRoom() {
      try {
        const roomId = this.$route.params.id;
        const { data } = await api.room.get(roomId);
        this.room = data;
      } catch (e) {
        this.$message.error(e.message);
        this.$router.push({ name: "app.index" });
      }
    },
    async requestAudioAndVideo() {
      this.isAudioBlocked = false;
      this.isVideoCamBlocked = false;
      await this.checkRequestPermission("isAudioBlocked", "microphone");
      await this.checkRequestPermission("isVideoCamBlocked", "camera");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
        });
        this.stream = stream;
      } catch (e) {
        console.log(e);
      }
    },
    async requestAudio() {
      this.isAudioBlocked = false;
      if (!this.audioStatus) {
        await this.checkRequestPermission("isAudioBlocked", "microphone");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
            },
            video: false,
          });
          this.audioStream = stream;
          this.audioStatus = true;
          this.$message.success("Microphone is turn on");
          if (document.getElementById("preview-tune")) {
            this.analyserTune(stream, "preview-tune");
          }
        } catch (err) {
          if (!this.isAudioBlocked) {
            this.$warning({
              title: "Please accept access microphone permission",
              content:
                "Click the camera blocked icon in your browser's address bar",
            });
          }
        }
      } else {
        this.$message.success("Microphone is turn off");
        this.stopAudio();
      }
    },
    stopAudio() {
      this.audioStatus = false;
      this.voiceTune = 0;
      if (this.audioContext) {
        this.audioContext.close();
      }
      this.audioStream.getAudioTracks()[0].enabled = false;
      if (this.stream) {
        this.stream.getAudioTracks()[0].enabled = false;
      }
    },
    async requestVideo() {
      this.isVideoCamBlocked = false;
      const video = document.getElementById("my-video");
      const mainVideo = document.getElementById("my-main-video");
      if (!this.videoStatus) {
        this.isLoadingVideo = true;
        await this.checkRequestPermission("isVideoCamBlocked", "camera");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              facingMode: "environment",
            },
            audio: false,
          });
          if (video) {
            this.videoStream = stream;
            if (!this.isSharingScreen) {
              video.srcObject = stream;
              if (mainVideo) {
                mainVideo.srcObject = stream;
              }
            }
            this.videoStatus = true;
            this.isLoadingVideo = false;
            this.$message.success("Camera is turn on");
          }
        } catch (err) {
          this.isLoadingVideo = false;
          if (!this.isVideoCamBlocked) {
            this.$warning({
              title: "Please accept access camera permission",
              content:
                "Click into blocked camera icon in address bar of browser and allow access",
            });
          }
        }
      } else {
        socket.emit('user-turn-off-camera', {
          roomId: this.room.roomId,
          userId: this.peerId
        })
        this.$message.success("Camera is turn off");
        this.stopVideo();
      }
    },
    stopVideo() {
      const video = document.getElementById("my-video");
      const mainVideo = document.getElementById("my-main-video");
      this.videoStatus = false;
      video.pause();
      video.src = "";
      if (mainVideo) {
        mainVideo.pause();
        mainVideo.src = "";
      }
      this.videoStream.getVideoTracks()[0].enabled = false;
      if (this.stream) {
        this.stream.getVideoTracks()[0].enabled = false;
      }
    },
    async checkRequestPermission(type, permission) {
      const self = this;
      await navigator.permissions
        .query({ name: permission })
        .then(function (permissionStatus) {
          if (permissionStatus.state == "denied") {
            self[type] = true;
            self.showBlockedModal = true;
          }
        });
    },
    async getStream() {
      if (this.audioStatus && this.videoStatus) {
        await this.requestAudioAndVideo();
      } else if (!this.audioStatus && this.videoStatus) {
        this.stream = this.videoStream;
        this.stream.addTrack(this.createEmptyAudioTrack());
      } else if (this.audioStatus && !this.videoStatus) {
        this.stream = this.audioStream;
        this.stream.addTrack(
          this.createEmptyVideoTrack({ width: 640, height: 480 }),
        );
      } else if (this.audioStatus && this.isSharingScreen) {
        this.stream = this.audioStream;
        this.stream.addTrack(this.screenStream);
      } else if (!this.audioStatus && this.isSharingScreen) {
        this.stream = this.screenStream;
        this.stream.addTrack(this.createEmptyAudioTrack());
      } else {
        this.stream = this.createMediaStreamFake();
      }
      return this.stream;
    },
    connectToServer() {
      if (this.room.isRequirePassword) {
        return this.passwordModalVisible = true
      }
      this.isInRoom = true;
      socket.createConnection();
      socket.onConnected(async socketId => {
        await this.getStream();

        const peer = new Peer({
          config: {
            iceServers: [{ url: "stun:stun.l.google.com:19302" }],
          },
        });
        this.peer = peer;

        peer.on("open", id => {
          socket.emit("join-room", {
            roomId: this.room.roomId,
            userId: id,
            tokenUser: this.tokenUser,
            userConfig: {
              video: this.videoStatus,
              audio: this.audioStatus,
              isSharingScreen: this.isSharingScreen,
            },
          });
          this.peerId = id;
          if (this.stream) {
            if (this.audioStatus) {
              this.analyserTune(this.stream, "my-tune");
            }
            this.addMyVideo(this.stream);
          }
          this.getUsersInRoom()
        });

        peer.on("disconnected", () => {
          peer.reconnect();
        });

        peer.on("call", async call => {
          call.answer(this.stream || this.createMediaStreamFake());
          call.on("stream", remoteStream => {
            if (!this.peersList.includes(call.peer)) {
              this.addVideoToStream(remoteStream, call.peer);
              this.connectedPeers.push(call.peerConnection);
              this.peersList.push(call.peer);
            }
          });
        });

        socket.on('on-user-send-message', data => {
          this.messages.push(data)
          if (!this.chatVisible) {
            this.unReadMessage += 1
          } else {
            this.scrollToBottomChat()
          }
        })

        socket.on("user-connected", async ({userId, fullName}) => {
          this.$message.info(`${fullName} joined the room`);
          await this.getStream();
          this.usersList[userId] = fullName
          this.connectToNewUser(userId, this.stream);
          this.getUsersInRoom()
        });

        socket.on('on-user-turn-off-camera', userId => {
          setTimeout(() => {
            const userVideo = document.getElementById(`video-${userId}`);
            if (userVideo) {
              userVideo.src = '';
            }
          }, 1000)
        })

        socket.on('on-kick-user', userId => {
          this.$error({
            title: "You have kicked out by Host",
            content:
              "You will be redirect to homepage after 3s",
            okText: 'Exit',
            onOk() {
              this.$router.push({name: 'app.index'})
            }
          });
          this.forceExit = true
          setTimeout(() => {
            this.$destroyAll()
            this.$router.push({name: 'app.index'})
          }, 3000)
        })

        socket.on('on-user-share-screen', data => {
          try {
            const { userId, user } = data;
            this.isHasUserShareScreen = true
            const userShareScreenVideo = document.getElementById(`video-${userId}`)
            const currentMainVideo = document.querySelector('[data-video-name="main-video"]')
            currentMainVideo.srcObject = userShareScreenVideo.srcObject
            currentMainVideo.addEventListener("loadedmetadata", () => {
              currentMainVideo.play();
            });
            user && this.$message.info(`${user.fullName} is sharing screen`)
          } catch (e) {
            console.log(e)
          }
        })

        socket.on('on-user-stop-share-screen', data => {
          try {
            const { userId, user } = data;
            this.isHasUserShareScreen = false
            const currentMainVideo = document.querySelector('[data-video-name="main-video"]')
            if (currentMainVideo.getAttribute('id') == `main-video-${userId}`) {
              this.$message.info(`${user.fullName} has stopped sharing screen`)
              currentMainVideo.style.display = 'none'
            }
          } catch (e) {
            console.log(e)
          }
        })

        socket.on("user-disconnected", ({userId, fullName}) => {
          const peerIndex = this.peersList.findIndex(peer => peer == userId);
          if (peerIndex != -1) {
            this.peersList.splice(peerIndex, 1);
          }
          if (this.peers[userId]) this.peers[userId].close();
          const mainVideo = document.getElementById(`main-video-${userId}`);
          if (mainVideo) {
            mainVideo.remove();
          }
          const videoContainer = document.getElementById(
            `video-container-${userId}`,
          );
          if (videoContainer) {
            videoContainer.remove();
          }
          if (!this.hasOtherUsers) {
            const myMainVideo = document.getElementById("my-main-video");
            myMainVideo.style.display = "block";
          }
          this.$message.info(`${fullName} left the room`);
          this.getUsersInRoom()
        });
      });
      socket.onDisconnected(() => {
        try {
          if (!this.forceExit) {
            this.$error({
              title: "Something went wrong",
              content:
                "You have entered the room at another device or could not connect to the server",
            });
          }
          this.stopVideo();
          this.stopAudio();
          this.$router.push({ name: "app.index" });
        } catch (e) {
          this.$router.push({ name: "app.index" });
        }
      });
    },
    async addVideoToStream(stream, peerId) {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      video.muted = true;
      video.classList.add("remote-video");
      video.setAttribute("id", `video-${peerId}`);
      const audio = new Audio();
      audio.srcObject = stream;
      audio.play();
      const videoGrid = document.getElementById("video-grid");
      const videoWrapper = document.createElement("div");
      videoWrapper.setAttribute("id", `video-container-${peerId}`);
      const userNameVideo = document.createElement('div')
      const { data } = await api.room.getUserByPeerId({
        peerId,
        roomId: this.room.roomId
      })
      userNameVideo.innerText = 'Anonymous'
      if (data.success) {
        userNameVideo.innerText = data.fullName
      }
      userNameVideo.classList.add('user-name-video')
      videoWrapper.appendChild(userNameVideo)

      videoWrapper.classList.add("video-item", "position-relative");
      videoWrapper.append(video);
      videoGrid.append(videoWrapper);

      const oldMainVideos = document.getElementsByClassName("main-video");

      for (let i = 0; i < oldMainVideos.length; ++i) {
        const oldMainVideo = oldMainVideos[i];
        oldMainVideo.style.display = "none";
      }

      const mainScreen = document.getElementById("main-screen");
      const mainRemoteVideo = document.createElement("video");
      mainRemoteVideo.classList.add("w-100", "main-video");
      mainRemoteVideo.setAttribute("id", `main-video-${peerId}`);
      mainRemoteVideo.setAttribute("data-video-name", `main-video`);
      mainRemoteVideo.srcObject = stream;
      mainRemoteVideo.play();
      mainRemoteVideo.muted = true;
      mainScreen.append(mainRemoteVideo);
    },
    connectToNewUser(userId, stream) {
      stream = stream || this.createMediaStreamFake();
      if (stream) {
        const call = this.peer.call(userId, stream);
        call.on("stream", remoteStream => {
          if (!this.peersList.includes(call.peer)) {
            this.addVideoToStream(remoteStream, call.peer);
            this.connectedPeers.push(call.peerConnection);
            this.peersList.push(call.peer);
          }
        });
        this.peers[userId] = call;
        return;
      }
      this.addVideoToStream(null);
    },
    addMyVideo(stream) {
      const video = document.getElementById("my-video");
      const mainVideo = document.getElementById("my-main-video");
      video.srcObject = stream;
      video.muted = true;
      mainVideo.srcObject = stream;
      mainVideo.muted = true;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      mainVideo.addEventListener("loadedmetadata", () => {
        mainVideo.play();
      });
    },
    async toggleMicroStreaming() {
      const type = "audioStatus";
      const track = "audioStream";
      const trackType = "audio";
      const requestType = "requestAudio";
      await this.toggleResourceStreaming(type, track, trackType, requestType);
      if (this.audioStatus) {
        this.analyserTune(this.audioStream, "my-tune");
      }
    },
    async toggleVideoStreaming() {
      const type = "videoStatus";
      const track = "videoStream";
      const trackType = "video";
      const requestType = "requestVideo";
      if (this.isSharingScreen) {
        return await this.requestVideo();
      }
      this.toggleResourceStreaming(type, track, trackType, requestType);
    },
    async toggleScreenStreaming() {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: "always",
            width: { ideal: 4096 },
            height: { ideal: 2160 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });
        const screenTrack = stream.getVideoTracks()[0];
        screenTrack.onended = this.stopScreenShare;
        this.isSharingScreen = true;
        this.addMyVideo(stream);
        this.screenStream = stream;
        if (this.connectedPeers) {
          this.connectedPeers.forEach(p => {
            const sender = p
              .getSenders()
              .find(s => s.track.kind == screenTrack.kind);
            sender.replaceTrack(screenTrack);
          });
        }
        socket.emit('user-share-screen', {
          roomId: this.room.roomId,
          userId: this.peerId
        })
        this.$message.info('You are sharing your screen')
        this.isHasUserShareScreen = true
        const mainVideo = document.querySelector('[data-video-name="main-video"]')
        if (mainVideo) {
          mainVideo.style.display = 'block'
          mainVideo.srcObject = stream;
          mainVideo.addEventListener("loadedmetadata", () => {
            mainVideo.play();
          });
        }
        const myMainVideo = document.getElementById('my-main-video')
        if (myMainVideo) {
          myMainVideo.srcObject = stream
          myMainVideo.addEventListener("loadedmetadata", () => {
            myMainVideo.play();
          });
        }
      } catch (e) {
        console.log(e)
        this.stopScreenShare();
      }
    },
    stopScreenShare() {
      this.isHasUserShareScreen = false;
      const mainVideo = document.querySelector('[data-video-name="main-video"]')
      if (mainVideo) mainVideo.style.display = 'none';
      socket.emit('user-stop-share-screen', {
        roomId: this.room.roomId,
        userId: this.peerId
      })
      this.isSharingScreen = false;
      this.addMyVideo(this.videoStream);
      if (this.connectedPeers) {
        this.connectedPeers.forEach(p => {
          const sender = p.getSenders().find(s => s.track.kind == "video");
          if (this.videoStatus) {
            return sender.replaceTrack(this.videoStream.getVideoTracks()[0]);
          }
          sender.replaceTrack(
            this.createEmptyVideoTrack({ width: 620, height: 400 }),
          );
        });
      }
    },
    async toggleResourceStreaming(type, track, trackType, requestType) {
      if (this[type] && this.connectedPeers) {
        this.connectedPeers.forEach(p => {
          const sender = p.getSenders().find(s => s.track.kind == trackType);
          sender.track.stop();
        });
        this[requestType]();
      } else {
        if (this.connectedPeers) {
          await this[requestType]();
          for (let i = 0; i < this.connectedPeers.length; ++i) {
            const sender = this.connectedPeers[i]
              .getSenders()
              .find(s => s.track.kind == trackType);
            if (sender && this[track]) {
              const getTrack =
                trackType == "audio"
                  ? this[track].getAudioTracks()
                  : this[track].getVideoTracks();
              sender.replaceTrack(getTrack[0]);
            }
          }
          return;
        }
        socket.emit("join-room", {
          roomId: this.room.roomId,
          userId: this.peerId,
          tokenUser: this.tokenUser,
          userConfig: {
            video: this.videoStatus,
            audio: this.audioStatus,
            isSharingScreen: this.isSharingScreen,
          },
        });
      }
    },
    analyserTune(stream, element) {
      const audioContext = new AudioContext();
      this.audioContext = audioContext;
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);
      const self = this;

      const tune1 = document.querySelector(`#${element} > #tune-1`);
      const tune2 = document.querySelector(`#${element} > #tune-2`);
      const tune3 = document.querySelector(`#${element} > #tune-3`);

      const minTuneHeight = 4;
      const maxTuneHeight = 16;

      const lowContour = 8;
      const highCountour = 4;

      javascriptNode.onaudioprocess = async function () {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;
        const length = array.length;
        for (let i = 0; i < length; i++) {
          values += array[i];
        }
        const average = values / length;
        self.voiceTune = Math.round(average);
        if (average > 0) {
          const lowTune =
            average / lowContour <= minTuneHeight
              ? minTuneHeight
              : average / lowContour > maxTuneHeight
              ? maxTuneHeight - 10
              : average / lowContour + "px";
          const highTune =
            average / highCountour <= minTuneHeight
              ? minTuneHeight
              : average / highCountour > maxTuneHeight
              ? maxTuneHeight
              : average / highCountour + "px";
          tune1.style.height = lowTune;
          tune2.style.height = highTune;
          tune3.style.height = lowTune;
        }
      };
    },
    createMediaStreamFake() {
      return new MediaStream([
        this.createEmptyAudioTrack(),
        this.createEmptyVideoTrack({ width: 640, height: 480 }),
      ]);
    },

    createEmptyAudioTrack() {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const dst = oscillator.connect(ctx.createMediaStreamDestination());
      oscillator.start();
      const track = dst.stream.getAudioTracks()[0];

      return Object.assign(track, { enabled: false });
    },

    createEmptyVideoTrack({ width, height }) {
      const canvas = Object.assign(document.createElement("canvas"), {
        width,
        height,
      });
      canvas.getContext("2d").fillRect(0, 0, width, height);

      const stream = canvas.captureStream();
      const track = stream.getVideoTracks()[0];

      return Object.assign(track, { enabled: false });
    },
    quitRoom() {
      window.location.href = '/'
    },
    onSubmitChat(message) {
      if (message && message.trim() != '') {
        const data = {
          roomId: this.room.roomId,
          userId: this.peerId,
          user: this.user,
          message
        }
        socket.emit('send-message', data)
        this.messages.push(data)
        this.messageText = ''
        this.scrollToBottomChat()
      }
    },
    scrollToBottomChat() {
      setTimeout(() => {
        const chatLog = document.getElementById("chat-log");
        chatLog.scrollTop = chatLog.scrollHeight;
      })
    },
    async getUsersInRoom() {
      const { data } = await api.room.getUsersInRoom(this.room.roomId)
      if (data.success) {
        this.users = data.users
      }
    },
    kickUser(userId) {
      this.$confirm({
        title: 'Are you sure?',
        content: 'Kick out this user from room?',
        onOk() {
          socket.emit('kick-user', userId)
        }
      })
    },
    async validateRoomPassword() {
      const { data } = await api.room.validatePassword({
        roomId: this.room.roomId,
        password: this.password
      })
      if (!data.success) {
        return this.$message.error('Password is incorrect')
      }
      this.room.isRequirePassword = false
      this.passwordModalVisible = false
      this.connectToServer()
    }
  },
};
</script>
<style scoped>
@import "../assets/styles/room.css";
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
