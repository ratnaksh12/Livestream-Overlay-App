import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const HLS_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

const LivestreamPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Make sure to only initialize the player once
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        width: 640,
        height: 360,
        sources: [{ src: HLS_URL, type: "application/x-mpegURL" }]
      });
    }
    // Cleanup: dispose the player on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <h2>Livestream Video</h2>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        width="640"
        height="360"
        controls
        preload="auto"
        data-setup="{}"
      />
    </div>
  );
};

export default LivestreamPlayer;
