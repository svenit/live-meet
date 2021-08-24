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
          <div class="col-lg-7 col-md-6 col-sm-12 position-relative">
            <video autoplay id="my-video"></video>
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
          <div class="col-lg-5 col-md-6 col-sm-12 text-center">
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
                Room ID: <span class="font-weight-bold">{{ room.roomId }}</span>
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
    <template v-else>
      <div class="position-relative" id="video-grid">
        <video style="border: 5px solid red" autoplay id="my-video"></video>
        <p class="video-cam-status text-white text-center position-absolute">
          <span v-if="isLoadingVideo"> Camera is preparing... </span>
          <span v-else-if="!videoStatus && !isSharingScreen">
            Camera is turn off
          </span>
        </p>
        <div
          v-show="audioStatus"
          id="my-tune"
          class="audio-tune position-absolute"
        >
          <div id="tune-1" class="tune"></div>
          <div id="tune-2" class="tune"></div>
          <div id="tune-3" class="tune"></div>
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
    </template>
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
            <span>{{ blockedAll ? 'are' : 'is' }} blocked</span>
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
import api from '@/api';
import socket from '@/plugins/socket-io';
import { send } from 'process';
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
      currentPeer: null,
      peersList: [],
      isSharingScreen: false,
    };
  },
  computed: {
    blockedAll() {
      return this.isAudioBlocked && this.isVideoCamBlocked;
    },
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
        this.$router.push({ name: 'app.index' });
      }
    },
    async requestAudioAndVideo() {
      this.isAudioBlocked = false;
      this.isVideoCamBlocked = false;
      await this.checkRequestPermission('isAudioBlocked', 'microphone');
      await this.checkRequestPermission('isVideoCamBlocked', 'camera');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        this.stream = stream;
      } catch (e) {
        console.log(e);
      }
    },
    async requestAudio() {
      this.isAudioBlocked = false;
      if (!this.audioStatus) {
        await this.checkRequestPermission('isAudioBlocked', 'microphone');
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
            },
            video: false,
          });
          this.audioStream = stream;
          this.audioStatus = true;
          this.$message.success('Microphone is turn on');
          if (document.getElementById('preview-tune')) {
            this.analyserTune(stream, 'preview-tune');
          }
        } catch (err) {
          console.log(err);
          if (!this.isAudioBlocked) {
            this.$warning({
              title: 'Please accept access microphone permission',
              content:
                "Click the camera blocked icon in your browser's address bar",
            });
          }
        }
      } else {
        this.audioStatus = false;
        this.audioStream.getTracks()[0].stop();
        this.voiceTune = 0;
        this.$message.success('Microphone is turn off');
        if (this.audioContext) {
          this.audioContext.close();
        }
      }
    },
    async requestVideo() {
      this.isVideoCamBlocked = false;
      const video = document.getElementById('my-video');
      if (!this.videoStatus) {
        this.isLoadingVideo = true;
        await this.checkRequestPermission('isVideoCamBlocked', 'camera');
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          if (video) {
            this.videoStream = stream;
            if (!this.isSharingScreen) {
              video.srcObject = stream;
            }
            this.videoStatus = true;
            this.isLoadingVideo = false;
            this.$message.success('Camera is turn on');
          }
        } catch (err) {
          this.isLoadingVideo = false;
          if (!this.isVideoCamBlocked) {
            this.$warning({
              title: 'Please accept access camera permission',
              content:
                'Click into blocked camera icon in address bar of browser and allow access',
            });
          }
        }
      } else {
        this.$message.success('Camera is turn off');
        this.videoStatus = false;
        video.pause();
        video.src = '';
        this.videoStream.getTracks()[0].stop();
      }
    },
    async checkRequestPermission(type, permission) {
      const self = this;
      await navigator.permissions
        .query({ name: permission })
        .then(function (permissionStatus) {
          if (permissionStatus.state == 'denied') {
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
      socket.onConnected(async (socketId) => {
        await this.getStream();

        const peer = new Peer(undefined, {
          host: '/',
          port: 3003,
        });
        this.peer = peer;

        peer.on('open', (id) => {
          socket.emit('join-room', {
            roomId: this.room.roomId,
            userId: id,
          });
          this.peerId = id;
          if (this.stream) {
            if (this.audioStatus) {
              this.analyserTune(this.stream, 'my-tune');
            }
            this.addMyVideo(this.stream);
          }
        });

        peer.on('call', async (call) => {
          call.answer(this.stream || this.createMediaStreamFake());
          call.on('stream', (remoteStream) => {
            if (!this.peersList.includes(call.peer)) {
              this.addVideoToStream(remoteStream);
              this.currentPeer = call.peerConnection;
              this.peersList.push(call.peer);
            }
          });
        });

        socket.on('user-connected', async (userId) => {
          await this.getStream();
          this.connectToNewUser(userId, this.stream);
        });

        socket.on('user-disconnected', (userId) => {
          if (this.peers[userId]) {
            this.peers[userId].close();
          }
        });
      });
      socket.onDisconnected(() => {
        this.$error({
          title: 'Something went wrong',
          content: 'Can not connect to server, please try again',
        });
        this.$router.push({ name: 'app.index' });
      });
    },
    addVideoToStream(stream) {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      video.muted = true;
      const audio = new Audio();
      audio.srcObject = stream;
      audio.play();
      const videoGrid = document.getElementById('video-grid');
      videoGrid.append(video);
    },
    connectToNewUser(userId, stream) {
      stream = stream || this.createMediaStreamFake();
      if (stream) {
        const call = this.peer.call(userId, stream);
        return call.on('stream', (remoteStream) => {
          if (!this.peersList.includes(call.peer)) {
            this.addVideoToStream(remoteStream);
            this.peersList.push(call.peer);
            this.currentPeer = call.peerConnection;
          }
        });
      }
      this.addVideoToStream(null);
    },
    addMyVideo(stream) {
      const video = document.getElementById('my-video');
      video.srcObject = stream;
      video.muted = true;
      const videoGrid = document.getElementById('video-grid');
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
      if (this.isSharingScreen) {
        video.classList.add('presentation-mode');
      } else {
        video.classList.remove('presentation-mode');
      }
      videoGrid.append(video);
    },
    async toggleMicroStreaming() {
      const type = 'audioStatus';
      const track = 'audioStream';
      const trackType = 'audio';
      const requestType = 'requestAudio';
      await this.toggleResourceStreaming(type, track, trackType, requestType);
      if (this.audioStatus) {
        this.analyserTune(this.audioStream, 'my-tune');
      }
    },
    async toggleVideoStreaming() {
      const type = 'videoStatus';
      const track = 'videoStream';
      const trackType = 'video';
      const requestType = 'requestVideo';
      if (this.isSharingScreen) {
        return await this.requestVideo();
      }
      this.toggleResourceStreaming(type, track, trackType, requestType);
    },
    async toggleScreenStreaming() {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always',
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
        if (this.currentPeer) {
          const sender = this.currentPeer
            .getSenders()
            .find((s) => s.track.kind == screenTrack.kind);
          sender.replaceTrack(screenTrack);
        }
      } catch (e) {
        this.stopScreenShare();
        console.log(e);
      }
    },
    stopScreenShare() {
      this.isSharingScreen = false;
      this.addMyVideo(this.videoStream);
      if (this.currentPeer) {
        const sender = this.currentPeer
          .getSenders()
          .find((s) => s.track.kind == 'video');
        if (this.videoStatus) {
          return sender.replaceTrack(this.videoStream.getVideoTracks()[0]);
        }
        sender.replaceTrack(
          this.createEmptyVideoTrack({ width: 620, height: 400 }),
        );
      }
    },
    async toggleResourceStreaming(type, track, trackType, requestType) {
      if (this[type] && this.currentPeer) {
        const sender = this.currentPeer
          .getSenders()
          .find((s) => s.track.kind == trackType);
        sender.track.stop();
        this[type] = false;
      } else {
        let sender = null;
        if (this.currentPeer) {
          sender = this.currentPeer
            .getSenders()
            .find((s) => s.track.kind == trackType);
        }
        await this[requestType]();
        if (sender && this[track]) {
          const getTrack =
            trackType == 'audio'
              ? this[track].getAudioTracks()
              : this[track].getVideoTracks();
          return sender.replaceTrack(getTrack[0]);
        }
        socket.emit('join-room', {
          roomId: this.room.roomId,
          userId: this.peerId,
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
              : average / lowContour + 'px';
          const highTune =
            average / highCountour <= minTuneHeight
              ? minTuneHeight
              : average / highCountour > maxTuneHeight
              ? maxTuneHeight
              : average / highCountour + 'px';
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
      const canvas = Object.assign(document.createElement('canvas'), {
        width,
        height,
      });
      canvas.getContext('2d').fillRect(0, 0, width, height);

      const stream = canvas.captureStream();
      const track = stream.getVideoTracks()[0];

      return Object.assign(track, { enabled: false });
    },
  },
};
</script>
<style scoped>
@import '../assets/styles/room.css';
</style>
