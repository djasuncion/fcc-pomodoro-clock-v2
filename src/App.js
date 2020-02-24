import React, { useState, useEffect, useRef } from "react";

import {} from "./Hooks";

import { GlobalStyles } from "./GlobalStyles";
import {
  AppWrapper,
  Title,
  LengthControlsWrapper,
  LengthControls,
  TimerWrapper,
  BottomControlsWrapper,
  Button,
  Footer,
  Audio
} from "./components";

let timerID;

function App() {
  const DEFAULT_SESSION_LENGTH = 1500;
  const DEFAULT_BREAK_LENGTH = 300;
  const audioRef = useRef();

  const [phase, setPhase] = useState(true);
  useEffect(() => {
    if (phase) {
      setTimeLeft(sessionLength);
    } else {
      setTimeLeft(breakLength);
    }
  }, [phase]);

  const [play, setPlay] = useState(false);

  const [pause, setPause] = useState(false);

  const [shifting, setShifting] = useState(false);
  useEffect(() => {
    if (shifting) {
      const timeoutID = setTimeout(() => {
        setPhase(!phase);
        setShifting(false);
        startTime();
      }, 1000);

      return () => clearTimeout(timeoutID);
    }
  });

  const [sessionLength, setSessionLength] = useState(DEFAULT_SESSION_LENGTH);

  const [breakLength, setBreakLength] = useState(DEFAULT_BREAK_LENGTH);

  const [timeLeft, setTimeLeft] = useState(DEFAULT_SESSION_LENGTH);
  useEffect(() => {
    if (timeLeft === 0) {
      stopTime();
      audioRef.current.play();
      setShifting(true);
    }
  }, [timeLeft]);

  const handleReset = () => {
    setPhase(true);
    setPlay(false);
    setPause(false);
    setShifting(false);
    setSessionLength(DEFAULT_SESSION_LENGTH);
    setBreakLength(DEFAULT_BREAK_LENGTH);
    setTimeLeft(DEFAULT_SESSION_LENGTH);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    clearInterval(timerID);
  };

  const startTime = () => {
    timerID = setInterval(() => {
      setTimeLeft(tL => tL - 1);
    }, 1000);
  };

  const stopTime = () => {
    clearInterval(timerID);
  };

  const handleClick = e => {
    const ID = e.target.id;

    switch (ID) {
      case "break-increment":
        if (breakLength === 60 * 60) return;
        setBreakLength(breakLength + 60);
        break;
      case "break-decrement":
        if (breakLength < 120) return;
        setBreakLength(breakLength - 60);
        break;
      case "session-increment":
        if (sessionLength === 60 * 60) return;
        if (!play) {
          setTimeLeft(sessionLength + 60);
        }
        setSessionLength(sessionLength + 60);
        break;
      case "session-decrement":
        if (sessionLength < 120) return;
        if (!play) {
          setTimeLeft(sessionLength - 60);
        }
        setSessionLength(sessionLength - 60);
        break;
      case "reset":
        handleReset();
        break;
      case "start_stop":
        if (!play) {
          setPlay(true);
          startTime();
        } else if (play && !pause) {
          setPause(true);
          stopTime();
        } else {
          setPause(false);
          startTime();
        }
        break;
      case "pause":
        if (!play || pause) return;
        setPause(true);
        break;
      default:
        return;
    }
  };

  console.log(`
  phase = ${phase}
  play = ${play}
  pause = ${pause}
  shifting = ${shifting}
  sessionLength = ${sessionLength}
  breakLength = ${breakLength}
  timeLeft = ${timeLeft}
  audioRef = ${audioRef.current}
  timerID = ${timerID}
  `);

  console.log(audioRef);

  return (
    <>
      <GlobalStyles />
      <AppWrapper>
        <Title>Pomodoro Clock</Title>
        <LengthControlsWrapper>
          <LengthControls id="break">
            <Button id="break-decrement" handleClick={handleClick}>
              <i className="fas fa-arrow-alt-circle-down fa-2x"></i>
            </Button>
            <span id="break-length">{Math.floor(breakLength / 60)}</span>
            <Button id="break-increment" handleClick={handleClick}>
              &#9195;
            </Button>
          </LengthControls>
          <LengthControls id="session" length={sessionLength}>
            <Button id="session-decrement" handleClick={handleClick}>
              <i className="fas fa-arrow-alt-circle-down fa-2x"></i>
            </Button>
            <span id="session-length">{Math.floor(sessionLength / 60)}</span>
            <Button id="session-increment" handleClick={handleClick}>
              <i className="fas fa-arrow-alt-circle-up fa-2x"></i>
            </Button>
          </LengthControls>
        </LengthControlsWrapper>
        <TimerWrapper play={play} phase={phase} timeLeft={timeLeft} />

        <BottomControlsWrapper>
          <Button id="start_stop" handleClick={handleClick}>
            {!play ? (
              <i className="fas fa-pause"></i>
            ) : (
              <i className="fas fa-play"></i>
            )}
          </Button>
          <Button id="pause" handleClick={handleClick}>
            pause
          </Button>
          <Button id="reset" handleClick={handleClick}>
            reset
          </Button>
        </BottomControlsWrapper>
      </AppWrapper>
      <Footer />
      <Audio audioRef={audioRef} timeLeft={timeLeft} />
    </>
  );
}

export default App;
