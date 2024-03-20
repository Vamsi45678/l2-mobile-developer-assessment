import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const [time, setTime] = useState(120); // Initial time in seconds (2 minutes)
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState([]);
  const [missedBalloon, setMissedBalloon] = useState(false); // State to track missed balloons
  const [gameStarted, setGameStarted] = useState(false); // State to track game start
  const [pressedBalloon, setPressedBalloon] = useState(null); // State to track pressed balloon

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (time === 0) {
      // Game over logic
      alert('Game Over! Your final score is: ' + score);
      // Reset game
      setTime(120);
      setScore(0);
      setBalloons([]);
      setGameStarted(false); // Reset game started state
    }
  }, [time, score]);

  const startGame = () => {
    setGameStarted(true);
  };

  const generateBalloon = () => {
    const newBalloon = {
      id: Math.random().toString(),
      positionX: Math.random() * 1500, // Random horizontal position
      positionY: -50, // Start from the top of the screen
    };
    setBalloons(prevBalloons => [...prevBalloons, newBalloon]);
  };

  const popBalloon = id => {
    setScore(prevScore => prevScore + 2); // Increase score by 2 when balloon is popped
    setBalloons(prevBalloons => prevBalloons.filter(balloon => balloon.id !== id));
  };

  const handleMissedBalloon = () => {
    if (!missedBalloon) {
      setScore(prevScore => prevScore - 1); // Reduce score by 1 when user misses a balloon
      setMissedBalloon(true); // Set missedBalloon to true to prevent multiple score deductions
    }
  };

  const balloonPressedIn = id => {
    setPressedBalloon(id);
  };

  const balloonPressedOut = () => {
    setPressedBalloon(null);
  };

  useEffect(() => {
    if (gameStarted) {
      const balloonInterval = setInterval(() => {
        generateBalloon();
      }, 700); // Interval for generating new balloons (adjust as needed)

      // Clean up interval on component unmount
      return () => clearInterval(balloonInterval);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      const moveBalloonsInterval = setInterval(() => {
        setBalloons(prevBalloons =>
          prevBalloons.map(balloon => ({
            ...balloon,
            positionY: balloon.positionY + 3 // Adjust speed here
          }))
        );
      }, 50); // Adjust speed here

      // Clean up interval on component unmount
      return () => clearInterval(moveBalloonsInterval);
    }
  }, [gameStarted]);

  

  return (
    <View style={[styles.container, { backgroundColor: gameStarted ? '#A9A9A9' : '#FFFFFF' }]}>
      {!gameStarted && (
        <View>
          <Text style={styles.instructions}>Pop the Balloons!</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      )}
      {gameStarted && (
        <>
          <Text style={styles.timer}>Time left :{Math.floor(time / 60)}:{time % 60 < 10 ? '0' + (time % 60) : time % 60}</Text>
          <Text style={styles.score}>Score: {score}</Text>
          <View style={styles.balloonContainer}>
            {balloons.map(balloon => (
              <TouchableOpacity
                key={balloon.id}
                style={[
                  styles.balloon,
                  { left: balloon.positionX, bottom: balloon.positionY },
                  pressedBalloon === balloon.id && styles.pressedBalloon
                ]}
                onPress={() => {
                  popBalloon(balloon.id);
                  setMissedBalloon(false); // Reset missedBalloon state when a balloon is popped
                }}
                onPressIn={() => balloonPressedIn(balloon.id)}
                onPressOut={balloonPressedOut}> 
                <Text style={styles.balloonText}>🎈</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    fontSize: 24,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#7FB3D5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 20,
    left:20,
    color: '#fff',
  },
  timer: {
    fontSize: 24,
    marginBottom: 20,
  },
  score: {
    fontSize: 20,
    marginBottom: 20,
  },
  balloonContainer: {
    position: 'relative',
    width: '100%',
    height: '80%',
  },
  balloon: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  balloonText: {
    fontSize: 35,
  },
  pressedBalloon: {
    transform: [{ scale: 1.2 }], // Scale up when pressed
  },
});
