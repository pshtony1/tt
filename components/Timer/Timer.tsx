import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  clockDegreeAtom,
  isClockPointerDownAtom,
  isTimingNowAtom,
  soundEffectAudioAtom,
} from "../../shared/atom";
import { Container, TimerButtonContainer, TimeText } from "./Timer.styled";
import { getTimeFromDegree } from "./Timer.util";
import "firebase/messaging";
import useAudio from "../../hooks/useAudio";
import AlarmOptionContainer from "../AlarmOption/AlarmOptionContainer";

let timerInterval: NodeJS.Timer | null = null;


export default function Timer() {
  const [isTimingNow, setIsTimingNow] = useRecoilState(isTimingNowAtom);
  const [clockDegree, setClockDegree] = useRecoilState(clockDegreeAtom);
  const isClockPointerDown = useRecoilValue(isClockPointerDownAtom);
  const soundEffectAudio = useRecoilValue(soundEffectAudioAtom);
  const [getAudioPermission, playAudio] = useAudio(soundEffectAudio?.src);
  const isEmptyClockDegree = clockDegree >= 360;

  const startTimer = () => {
    const getNextDegree = (prevDegree: number, elapsedTime: number) => {
      const result = prevDegree + elapsedTime / 10;
      const degreeOvered = result > 360;

      if (degreeOvered && timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }

      return Math.min(360, result);
    };

    const onInterval = () => {
      const curTime = new Date().getTime();
      const elapsed = (curTime - prevTime) / 1000;
      setClockDegree((prevDegree) => getNextDegree(prevDegree, elapsed));
      prevTime = curTime;
    };

    let prevTime = new Date().getTime();
    timerInterval = setInterval(onInterval, 1000);
  };

  const pauseTimer = () => {
    if (!timerInterval) return;

    clearInterval(timerInterval);
    timerInterval = null;
    setIsTimingNow(false);
  };

  useEffect(() => {
    const isTimingEnd = !isClockPointerDown && isEmptyClockDegree;
    if (!isTimingEnd) return;

    setIsTimingNow(false);
  }, [clockDegree, isClockPointerDown]);

  return (
    <Container>
      <TimerButtonContainer triggerHide={!isTimingNow}>
        <button disabled={!isTimingNow} onClick={pauseTimer}>
          일시정지
        </button>
      </TimerButtonContainer>
      <TimerButtonContainer triggerHide={isClockPointerDown || isTimingNow}>
        <button
          disabled={isEmptyClockDegree}
          onClick={() => {
            getAudioPermission();
            setIsTimingNow(true);
            startTimer();
          }}
        >
          {isEmptyClockDegree ? "시간을 설정해주세요" : "집중 시작하기"}
        </button>
      </TimerButtonContainer>
      <AlarmOptionContainer
        timer={{ isEmptyClockDegree, isTimingNow }}
        audio={{ playAudio }}
      />
      <TimeText triggerZoom={isClockPointerDown || isTimingNow}>
        <div className="row">
          <span className="min">{getTimeFromDegree(clockDegree).min}</span>
        </div>
        <div className="row">
          <span className="sec">{getTimeFromDegree(clockDegree).sec}</span>
        </div>
      </TimeText>
    </Container>
  );
}
