"use client";
import React, { useState, useEffect } from "react";
import styles from "./PlayerShow.module.scss";
import PlayerControls from "./PlayerControls";
import YouTube from "react-youtube";
import { useSearchParams } from "next/navigation";

const ShowPlayer: React.FC = () => {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoInfo, setVideoInfo] = useState({ title: "", description: "" });
  const [isFullScreen, setIsFullScreen] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const tipo = searchParams.get("tipo");
  const [videoKey, setVideoKey] = useState<string>("");

  const goBack = () => {
    window.history.back();
  };

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekForward = (seconds: number) => {
    if (player) {
      const newTime = currentTime + seconds;
      if (newTime < duration) {
        player.seekTo(newTime, true);
        setCurrentTime(newTime);
      }
    }
  };

  const backForward = (seconds: number) => {
    if (player) {
      const newTime = currentTime - seconds;
      if (newTime > 0) {
        player.seekTo(newTime, true);
        setCurrentTime(newTime);
      }
    }
  };

  const toggleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      const playerElement = document.getElementById("player");
      if (playerElement) {
        playerElement.requestFullscreen();
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  const opts = {
    width: "100%",
    height: "866vh",
    playerVars: {
      controls: 0,
      modestbranding: 1,
      rel: 0,
      origin: window.location.origin, // Define a origem como a do seu aplicativo
    },
  };

  // Dentro do bloco useEffect
  useEffect(() => {
    if (id && tipo) {
      const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTUzYjk2MmY2Nzg2MGY2NjAxMjc4YTE1ZDdjNmVkMSIsInN1YiI6IjY1NDRlODAyNmJlYWVhMDEwYjMyNGVkYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EWLmbWqxpkl0X_f3SicwD20Jee8zD-jls2pKLq6Qohs"; // Substitua pela sua chave de API do TMDB
      let baseUrl = "";

      if (tipo === "movie") {
        baseUrl = `https://api.themoviedb.org/3/movie/${id}/videos`;
      } else if (tipo === "tv") {
        baseUrl = `https://api.themoviedb.org/3/tv/${id}/videos`;
      }

      const url = `${baseUrl}?api_key=${apiKey}`;

      const fetchVideoKey = async () => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            // Verifique se há resultados de vídeo e obtenha a chave do trailer
            if (data.results && data.results.length > 0) {
              const trailerKey = data.results[0].key;
              setVideoKey(trailerKey);
            }
          }
        } catch (error) {
          console.error("Erro ao buscar a chave do vídeo:", error);
        }
      };

      fetchVideoKey();
    }
  }, [id, tipo]);

  const fetchVideoInfo = (videoKey: string) => {
    const apiKey = "AIzaSyCdvi-PCCAClNngx1OTH-3uoxggXvEhNpA"; // Substitua pela sua chave de API do YouTube Data API v3
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoKey}&key=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          const video = data.items[0].snippet;
          let title = video.title;
          const description =
            video.description.length > 60
              ? `${video.description.slice(0, 60)}...`
              : video.description;

          if (title.length > 32) {
            title = `${title.slice(0, 32)}...`;
          }

          setVideoInfo({
            title,
            description,
          });
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar informações do vídeo", error);
      });
  };

  useEffect(() => {
    if (videoKey) {
      fetchVideoInfo(videoKey);
    }
  }, [videoKey]);

  return (
    <div className={styles.playerShow}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={goBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M31.7719 8.62713C30.9357 7.79096 29.5876 7.79096 28.7514 8.62713L14.5706 22.808C13.905 23.4736 13.905 24.5486 14.5706 25.2142L28.7514 39.3951C29.5876 40.2312 30.9357 40.2312 31.7719 39.3951C32.6081 38.5589 32.6081 37.2108 31.7719 36.3746L19.417 24.0026L31.789 11.6305C32.6081 10.8114 32.6081 9.44625 31.7719 8.62713Z"
              fill="white"
            />
          </svg>
        </button>
        <div className={styles.headerInfo}>
          <div className={styles.title}>{videoInfo.title}</div>
          <div className={styles.episode}>{videoInfo.description}</div>
        </div>
      </div>
      <div className={styles.videoContainer}>
        <div className={styles.controlsContainer}>
          <PlayerControls
            pauseVideo={togglePlay}
            seekForward={seekForward}
            backForward={backForward}
            duration={duration}
            currentTime={currentTime}
            toggleFullScreen={toggleFullScreen}
          />
        </div>
        <YouTube
          videoId={videoKey}
          opts={opts}
          onReady={(event) => {
            setPlayer(event.target);
          }}
          id="player"
        />
      </div>
    </div>
  );
};

export default ShowPlayer;
