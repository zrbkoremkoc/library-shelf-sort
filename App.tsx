/**
 * Library Shelf Sort - screen state machine.
 * Gameplay lives in src/game and src/hooks; this file only routes screens.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { ReadingNookScreen } from './src/screens/ReadingNookScreen';
import { BookFactsScreen } from './src/screens/BookFactsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { useLibraryProgress } from './src/hooks/useLibraryProgress';
import { roomIndexForShelf } from './src/constants/rooms';
import { TOTAL_SHELVES } from './src/constants/config';
import { roomsCleared, rewardForClear } from './src/game/progression';
import { DecorCategory } from './src/constants/decor';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'nook' | 'facts' | 'settings';

interface Result {
  shelf: number;
  moves: number;
  bestMoves: number;
  stars: number;
  rewardName: string | null;
}

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [shelf, setShelf] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(1);
  const [result, setResult] = useState<Result | null>(null);

  const progress = useLibraryProgress();
  const {
    records,
    cleared,
    stars,
    equipped,
    soundEnabled,
    reduceMotion,
    setSoundEnabled,
    setReduceMotion,
    recordClear,
    equip,
    resetProgress,
  } = progress;

  const clearedRooms = useMemo(() => roomsCleared(records), [records]);

  const goMenu = useCallback(() => setScreen('menu'), []);

  const startShelf = useCallback((next: number) => {
    const target = Math.min(Math.max(next, 1), TOTAL_SHELVES);
    setShelf(target);
    setSelectedRoom(roomIndexForShelf(target) + 1);
    setScreen('game');
  }, []);

  const handleGameOver = useCallback(
    (moves: number, par: number) => {
      const reward = rewardForClear(shelf, records);
      const outcome = recordClear(shelf, moves, par);
      setResult({
        shelf,
        moves,
        bestMoves: outcome.bestMoves,
        stars: outcome.stars,
        rewardName: outcome.isFirstClear && reward ? reward.name : null,
      });
      setScreen('gameover');
    },
    [recordClear, records, shelf],
  );

  const handleEquip = useCallback(
    (category: DecorCategory, id: string) => {
      equip(category, id);
    },
    [equip],
  );

  // Android Back: overlays are handled inside their screens; here Back walks
  // the state machine back toward the menu.
  React.useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'menu' || screen === 'loader') {
        return false;
      }
      setScreen('menu');
      return true;
    });
    return () => sub.remove();
  }, [screen]);

  return (
    <View style={styles.root}>
      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          records={records}
          cleared={cleared}
          stars={stars}
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
          onPlay={startShelf}
          onOpenNook={() => setScreen('nook')}
          onOpenFacts={() => setScreen('facts')}
          onOpenSettings={() => setScreen('settings')}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          shelf={shelf}
          soundEnabled={soundEnabled}
          reduceMotion={reduceMotion}
          onSoundChange={setSoundEnabled}
          onHome={goMenu}
          onGameOver={handleGameOver}
        />
      ) : null}

      {screen === 'gameover' && result ? (
        <GameOverScreen
          shelf={result.shelf}
          moves={result.moves}
          bestMoves={result.bestMoves}
          stars={result.stars}
          rewardName={result.rewardName}
          isLastShelf={result.shelf >= TOTAL_SHELVES}
          reduceMotion={reduceMotion}
          onNextShelf={() => startShelf(result.shelf + 1)}
          onPlayAgain={() => startShelf(result.shelf)}
          onMenu={goMenu}
          onOpenNook={() => setScreen('nook')}
        />
      ) : null}

      {screen === 'nook' ? (
        <ReadingNookScreen
          equipped={equipped}
          clearedShelves={cleared}
          onEquip={handleEquip}
          onBack={goMenu}
        />
      ) : null}

      {screen === 'facts' ? (
        <BookFactsScreen
          roomsCleared={clearedRooms}
          reduceMotion={reduceMotion}
          onBack={goMenu}
        />
      ) : null}

      {screen === 'settings' ? (
        <SettingsScreen
          soundEnabled={soundEnabled}
          reduceMotion={reduceMotion}
          cleared={cleared}
          stars={stars}
          onSoundChange={setSoundEnabled}
          onReduceMotionChange={setReduceMotion}
          onReset={resetProgress}
          onBack={goMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F6ED' },
});

export default App;
