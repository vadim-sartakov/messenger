import React, { useEffect, useState, useCallback } from 'react';
import { useFormik } from 'formik';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import Settings from './Settings';
import { startCall, endCall, getLocalStream, updateMediaDevices } from '../../../actions';
import MicVolume from '../../../utils/MicVolume';

function SettingsContainer(props) {
  const {
    mics = [],
    cams = [],
    video,
    audioStream,
    onUpdateMediaDevices,
    onGetLocalStream,
    onStartCall
  } = props;
  const { chatId } = useParams();
  const [micVolume, setMicVolume] = useState(0);

  useEffect(function updateMediaDevices() {
    onUpdateMediaDevices();
    navigator.mediaDevices.addEventListener('devicechange', onUpdateMediaDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', onUpdateMediaDevices);
    }
  }, [onUpdateMediaDevices]);

  const formik = useFormik({
    initialValues: {
      cam: '',
      mic: ''
    },
    onSubmit: () => onStartCall(chatId)
  });
  const { setFieldValue } = formik;

  const handleMicChange = useCallback(mic => {
    setFieldValue('mic', mic);
    onGetLocalStream('audio', mic.deviceId);
  }, [setFieldValue, onGetLocalStream]);

  const handleCamChange = useCallback(cam => {
    setFieldValue('cam', cam);
    onGetLocalStream('video', cam.deviceId);
  }, [setFieldValue, onGetLocalStream]);

  useEffect(function setDefaultMic() {
    mics[0] && handleMicChange(mics[0]);
  }, [mics, handleMicChange]);
  useEffect(function setDefaultCam() {
    video && cams[0] && handleCamChange(cams[0]);
  }, [video, cams, handleCamChange]);

  useEffect(function attachMicVolume() {
    if (!audioStream) return;
    const micVolume = new MicVolume(audioStream, avarage => {
      setMicVolume(Math.round(avarage / 10));
    });
    micVolume.listen();
    return () => micVolume.clear();
  }, [audioStream]);

  return (
    <Settings
      {...props}
      micVolume={micVolume}
      value={formik.values}
      onMicChange={handleMicChange}
      onCamChange={handleCamChange}
      onSubmit={formik.handleSubmit} />
  )
}

function mapStateToProps(state) {
  return {
    mics: state.call.mics,
    cams: state.call.cams,
    audio: state.call.audio,
    video: state.call.video,
    audioStream: state.call.audioStream,
    videoStream: state.call.videoStream
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateMediaDevices: () => dispatch(updateMediaDevices()),
    onStartCall: chatId => dispatch(startCall(chatId)),
    onEndCall: () => dispatch(endCall()),
    onGetLocalStream: (kind, deviceId) => dispatch(getLocalStream(kind, deviceId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);