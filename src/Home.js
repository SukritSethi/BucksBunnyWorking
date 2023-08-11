import React, { useState } from 'react';
import Modal from 'react-modal';

// Set the modal root element to the app root div
Modal.setAppElement('#root');

function VideoModal({ isOpen, onClose, videolink }) {
  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '4px',
    width: '60%',

    overflow: 'auto',
    zIndex: 1000,
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  const videoContainerStyle = {
    position: 'relative',
    overflow: 'hidden',
    paddingTop: '56.25%', /* 16:9 aspect ratio */
    height: '0',
  };

  const iframeStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="YouTube Video Modal"
      style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
    >
      <button style={closeButtonStyle} onClick={onClose}>
        Close
      </button>
      <div style={modalStyle}>
        <div style={videoContainerStyle}>
          <iframe
            title="YouTube Video"
            src={videolink}
            frameBorder="0"
            allowFullScreen
            style={iframeStyle}
          ></iframe>
        </div>
      </div>
    </Modal>
  );
}

function Home({videolink}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div>
      <button style={buttonStyle} onClick={openModal}>
        Open Video
      </button>
      <VideoModal isOpen={modalIsOpen} onClose={closeModal} videolink={videolink}/>
    </div>
  );
}

export default Home;
