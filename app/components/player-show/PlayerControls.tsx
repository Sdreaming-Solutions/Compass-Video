/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import styles from "./PlayerControls.module.scss";
import AudioSubtitleModal from "./AudioSubtitleModal";

interface PlayerControlsProps {
  pauseVideo: () => void;
  seekForward: (seconds: number) => void;
  backForward: (seconds: number) => void;
  duration: number;
  currentTime: number;
  toggleFullScreen: () => void; // Adicione a função de tela cheia
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  pauseVideo,
  seekForward,
  backForward,
  duration,
  currentTime,
  toggleFullScreen,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalnextModalVisible, setIsModalnextModalVisible] = useState(false);
  const [isModalEpisodiosVisible, setIsModalEpisodiosVisible] = useState(false);
  const [isModalLegendasVisible, setIsModalLegendasVisible] = useState(false);
  const [isModalTelaCheiaVisible, setIsModalTelaCheiaVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState((currentTime / duration) * 100);
  const [ellipseLeft, setEllipseLeft] = useState(progress);
  const [isMuted, setIsMuted] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleModalnextModal = () => {
    setIsModalnextModalVisible(!isModalnextModalVisible);
  };

  const toggleModalEpisodios = () => {
    setIsModalEpisodiosVisible(!isModalEpisodiosVisible);
  };

  const toggleModalLegendas = () => {
    setIsModalLegendasVisible(!isModalLegendasVisible);
  };

  const toggleModalTelaCheia = () => {
    setIsModalTelaCheiaVisible(!isModalTelaCheiaVisible);
  };

  const togglePlay = () => {
    pauseVideo();
    setIsPlaying(!isPlaying);
  };

  const seekForward10Seconds = () => {
    seekForward(10);
  };

  const backForward10Seconds = () => {
    backForward(10);
  };

  const [isAudioSubtitleModalVisible, setIsAudioSubtitleModalVisible] =
    useState(false);

  const toggleAudioSubtitleModal = () => {
    setIsAudioSubtitleModalVisible(!isAudioSubtitleModalVisible);
  };

  useEffect(() => {
    const newProgress = (currentTime / duration) * 100;
    setProgress(newProgress);
    setEllipseLeft(newProgress);
  }, [currentTime, duration]);

  return (
    <div className={styles.playerControls}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressBackground}
          style={{ width: `${progress}%` }}
        />
        <div
          className={styles.progressEllipse}
          style={{ left: `${ellipseLeft}%` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            fill="none"
          >
            <circle />
          </svg>
        </div>
      </div>
      <div className={styles.controls}>
        <div className={styles.leftControls}>
          <img
            src="/icons/back-10segs.png"
            alt="Back 10 Seconds"
            className={styles.controlIcon}
            onClick={backForward10Seconds}
          />
          <img
            src={isPlaying ? "/icons/pause.png" : "/icons/play.png"}
            alt={isPlaying ? "Pause" : "Play"}
            className={styles.controlIcon}
            onClick={togglePlay}
          />
          <img
            src="/icons/foward-10segs.png"
            alt="Forward 10 Seconds"
            className={styles.controlIcon}
            onClick={seekForward10Seconds}
          />
          <img
            src={isMuted ? "/icons/volume_mute.png" : "/icons/volume.png"}
            alt={isMuted ? "Muted" : "Volume"}
            id="volume"
            className={styles.controlIcon}
            onClick={() => setIsMuted(!isMuted)} // Alternar entre mudo e não mudo
          />
          <div className={styles.timerText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        <div className={styles.rightControls}>
          <div className={styles.infoContainer}>
            <img
              src="/icons/info.png"
              alt="Info"
              className={styles.controlIcon}
              onMouseEnter={toggleModal}
              onMouseLeave={toggleModal}
            />
            {isModalVisible && (
              <div className={styles.modal}>
                <img
                  src="/player_help.png"
                  alt="Ajuda"
                  style={{ width: "75%" }}
                />
              </div>
            )}
          </div>

          <div className={styles.infoContainer}>
            <img
              src="/icons/skip.png"
              alt="nextModal"
              className={styles.controlIcon}
              onMouseEnter={toggleModalnextModal}
              onMouseLeave={toggleModalnextModal}
            />
            {isModalnextModalVisible && (
              <div className={`${styles.modal} ${styles["modal-nextModal"]}`}>
                <div className={styles.modalContent}>
                  <img
                    src="/caminho-da-imagem.jpg"
                    alt="Imagem nextModal"
                    className={styles.modalImage}
                  />
                  <div className={styles.modalTextContainer}>
                    <p className={styles.modalText}>Seguinte</p>
                    <h1 className={styles.modalTitle}>nextModal</h1>
                    <p className={styles.modalText}>Seu texto aqui</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.infoContainer}>
            <img
              src="/icons/video-library.png"
              alt="Episódios"
              className={styles.controlIcon}
              onMouseEnter={toggleModalEpisodios}
              onMouseLeave={toggleModalEpisodios}
            />
            {isModalEpisodiosVisible && (
              <div className={styles.modal}>
                <img
                  src="/player_episodes.png"
                  alt="Ajuda"
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div>

          <div className={styles.infoContainer}>
            <img
              src="/icons/subtitle.png"
              alt="Legendas"
              className={styles.controlIcon}
              onMouseEnter={toggleModalLegendas}
              onMouseLeave={toggleModalLegendas}
              onClick={toggleAudioSubtitleModal}
            />

            {isModalLegendasVisible && (
              <div className={styles.modal}>
                <img
                  src="/player_subtitles.png"
                  alt="Ajuda"
                  style={{ width: "100%" }}
                />
              </div>
            )}
            {isAudioSubtitleModalVisible && <AudioSubtitleModal />}
          </div>

          <div className={styles.infoContainer}>
            <img
              src="/icons/expand.png"
              alt="Tela cheia"
              className={styles.controlIcon}
              onMouseEnter={toggleModalTelaCheia}
              onMouseLeave={toggleModalTelaCheia}
              onClick={toggleFullScreen}
            />
            {isModalTelaCheiaVisible && (
              <div className={styles.modal}>
                <img
                  src="/player_expand.png"
                  alt="Ajuda"
                  style={{ width: "110%", height: "105%", marginLeft: " -55%" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

export default PlayerControls;
