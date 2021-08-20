<template>
  <div>Login</div>
</template>

<script>
import socket from '@/plugins/socket-io';
export default {
  mounted() {
    socket.createConnection();
    socket.onConnected((data) => {
      console.log(data);
    });
    socket.onDisconnected(() => console.log('Disconnected'));
  },
};
</script>
