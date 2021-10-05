<template>
  <div class="position-relative">
    <template v-if="!isInRoom">
      <div class="header d-flex py-1 border-bottom">
        <div class="container d-flex">
          <div class="media align-items-center">
            <img style="width: 50px" src="@/assets/images/logo.png" alt="" />
            <h6>Live Meet</h6>
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
            !hasOtherUsers ? 'col-12' : 'col-8',
            { 'd-none': !isHasUserShareScreen && hasOtherUsers },
          ]"
          id="main-screen"
          class="position-relative p-1"
        >
          <video
            class="w-100 main-video"
            :class="{ 'presentation-mode': isSharingScreen }"
            id="my-main-video"
          ></video>
        </div>
        <div
          v-show="hasOtherUsers"
          :class="!isHasUserShareScreen && hasOtherUsers ? 'col-12' : 'col-4'"
          class="video-box p-1"
          id="video-grid"
        >
          <div id="my-video-grid" class="video-item position-relative">
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
      <div class="group-button group-button-in-call position-absolute">
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
          @click="toggleVideoStreaming"
          :disabled="isLoadingVideo"
        >
          <ion-icon class="video-setup-icon" name="power"></ion-icon>
        </a-button>
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
    }),
  },
  async created() {
    this.$root.$loading.start();
    await this.fetchRoom();
    this.$root.$loading.finish();
  },
  methods: {
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
          console.log(err);
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
      this.audioStream.getTracks()[0].stop();
      this.voiceTune = 0;
      if (this.audioContext) {
        this.audioContext.close();
      }
      if (this.stream) {
        this.stream.getAudioTracks()[0].stop();
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
      this.videoStream.getTracks()[0].stop();
      if (this.stream) {
        this.stream.getVideoTracks()[0].stop();
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

        socket.on("user-connected", async userId => {
          this.$message.info(`${userId} joined the room`);
          await this.getStream();
          this.connectToNewUser(userId, this.stream);
        });

        socket.on("user-disconnected", userId => {
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
          this.$message.info(`${userId} left the room`);
        });
      });
      socket.onDisconnected(() => {
        this.$error({
          title: "Something went wrong",
          content:
            "You have entered the room at another device or could not connect to the server",
        });
        this.stopVideo();
        this.stopAudio();
        this.$router.push({ name: "app.index" });
      });
    },
    addVideoToStream(stream, peerId) {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();
      video.muted = true;
      video.classList.add("remote-video");
      video.setAttribute("id", `video-${peerId}`);
      const audio = new Audio();
      audio.srcObject = stream;
      audio.play();
      const videoGrid = document.getElementById("video-grid");
      const videoWrapper = document.createElement("div");
      videoWrapper.setAttribute("id", `video-container-${peerId}`);
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
      } catch (e) {
        this.stopScreenShare();
        console.log(e);
      }
    },
    stopScreenShare() {
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
  },
};
</script>
<style scoped>
@import "../assets/styles/room.css";
</style>
