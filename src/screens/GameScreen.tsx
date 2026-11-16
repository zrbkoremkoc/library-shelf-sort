import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Vibration } from 'react-native';
import { Home, Pause } from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { ShelfBoard } from '../components/ShelfBoard';
import { GameControls } from '../components/GameControls';
import { PauseDialog } from '../components/PauseDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useShelfGame } from '../hooks/useShelfGame';
import { boardGeometry } from '../utils/boardGeometry';
import { roomNameForShelf } from '../game/progression';
import { TIMING } from '../constants/config';

interface Props {
  shelf: number;
  soundEnabled: boolean;
  reduceMotion: boolean;
  onSoundChange: (next: boolean) => void;
  onHome: () => void;
  onGameOver: (moves: number, par: number) => void;
}

export function GameScreen({
  shelf,
  soundEnabled,
  reduceMotion,
  onSoundChange,
  onHome,
  onGameOver,
}: Props) {
  const [paused, setPaused] = useState(false);
  const [confirmReplay, setConfirmReplay] = useState(false);
  const enter = useRef(new Animated.Value(reduceMotion ? 0 : 8)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const handleSolved = useCallback(
    (moves: number, par: number) => {
      if (soundEnabled) {
        Vibration.vibrate(20);
      }
      onGameOver(moves, par);
    },
    [onGameOver, soundEnabled],
  );

  const game = useShelfGame({ shelf, onSolved: handleSolved });
  const geometry = useMemo(() => boardGeometry(game.board.bays.length), [game.board.bays.length]);

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: reduceMotion ? TIMING.reduced : 180,
        useNativeDriver: true,
      }),
      Animated.timing(enter, {
        toValue: 0,
        duration: reduceMotion ? TIMING.reduced : 180,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [enter, fade, reduceMotion]);

  const openPause = useCallback(() => {
    game.cancelSelection();
    setPaused(true);
  }, [game]);

  const goHome = useCallback(() => {
    game.cancelSelection();
    onHome();
  }, [game, onHome]);

  const requestReplay = useCallback(() => {
    game.cancelSelection();
    if (game.hasChanges) {
      setConfirmReplay(true);
      return;
    }
    game.replay();
  }, [game]);

  return (
    <AppShell tone="game">
      <ScreenHeader
        title={`Shelf ${shelf}`}
        subtitle={roomNameForShelf(shelf)}
        leftSlot={<IconButton Icon={Home} onPress={goHome} label="Library Floors" />}
        rightSlot={<IconButton Icon={Pause} onPress={openPause} label="Pause" />}
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.area, { opacity: fade, transform: [{ translateY: enter }] }]}>
        <ShelfBoard
          bays={game.board.bays}
          capacity={game.level.capacity}
          geometry={geometry}
          selectedBay={game.selectedBay}
          pulsingBay={game.pulsingBay}
          reducedMotion={reduceMotion}
          onBayPress={game.handleBayPress}
        />
      </Animated.View>

      <GameControls
        moves={game.board.moves}
        capacity={game.level.capacity}
        ladderBook={game.board.ladder}
        ladderSelected={game.ladderSelected}
        canUndo={game.canUndo}
        hint={game.hint}
        hintEmphasis={game.hintEmphasis}
        reducedMotion={reduceMotion}
        onUndo={game.undo}
        onReplay={requestReplay}
        onLadderPress={game.handleLadderPress}
      />

      {paused ? (
        <PauseDialog
          soundEnabled={soundEnabled}
          onResume={() => setPaused(false)}
          onSoundChange={onSoundChange}
          onHome={() => {
            setPaused(false);
            goHome();
          }}
          onReplay={() => {
            setPaused(false);
            game.replay();
          }}
        />
      ) : null}

      {confirmReplay ? (
        <ConfirmDialog
          title="Start this shelf again?"
          explanation="Your books go back to the first layout. Earlier progress stays."
          cancelLabel="KEEP PLAYING"
          confirmLabel="PLAY AGAIN"
          onCancel={() => setConfirmReplay(false)}
          onConfirm={() => {
            setConfirmReplay(false);
            game.replay();
          }}
        />
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
