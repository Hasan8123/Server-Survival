import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, INITIAL_STATE } from './GameState';
import { SoundService } from '../services/SoundService'; // Assuming this will be ported later
import * as THREE from 'three';
import { CONFIG, TRAFFIC_TYPES } from '../config'; // Import CONFIG and TRAFFIC_TYPES

// Define the action types for the reducer
type GameAction =
  | { type: 'SET_MONEY'; payload: number }
  | { type: 'SET_REPUTATION'; payload: number }
  | { type: 'SET_SCORE'; payload: Partial<GameState['score']> }
  | { type: 'SET_ACTIVE_TOOL'; payload: string }
  | { type: 'SET_GAME_MODE'; payload: 'survival' | 'sandbox' }
  | { type: 'SET_IS_RUNNING'; payload: boolean }
  | { type: 'SET_TIME_SCALE'; payload: number }
  | { type: 'SET_SOUND_SERVICE'; payload: SoundService }
  | { type: 'RESET_GAME'; payload: 'survival' | 'sandbox' }; // Payload defines the mode for reset

// Reducer function to manage state changes
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_MONEY':
      return { ...state, money: action.payload };
    case 'SET_REPUTATION':
      return { ...state, reputation: action.payload };
    case 'SET_SCORE':
      return { ...state, score: { ...state.score, ...action.payload } };
    case 'SET_ACTIVE_TOOL':
        return { ...state, activeTool: action.payload };
    case 'SET_GAME_MODE':
        return { ...state, gameMode: action.payload };
    case 'SET_IS_RUNNING':
        return { ...state, isRunning: action.payload };
    case 'SET_TIME_SCALE':
        return { ...state, timeScale: action.payload };
    case 'SET_SOUND_SERVICE':
        return { ...state, sound: action.payload };
    case 'RESET_GAME':
      // This is a more complex action, mimicking the old resetGame function
      const mode = action.payload;
      const newState: GameState = {
        ...INITIAL_STATE, // Start with the initial state
        gameMode: mode,
        sound: state.sound, // Keep the existing sound service instance
        animationId: state.animationId, // Keep animationId if already running

        // Apply mode-specific initializations
        money: mode === 'sandbox' ? CONFIG.sandbox.defaultBudget : CONFIG.survival.startBudget,
        upkeepEnabled: mode === 'survival', // Upkeep is only enabled in survival by default
        trafficDistribution: mode === 'sandbox' ? {
            STATIC: CONFIG.sandbox.trafficDistribution.STATIC / 100,
            READ: CONFIG.sandbox.trafficDistribution.READ / 100,
            WRITE: CONFIG.sandbox.trafficDistribution.WRITE / 100,
            UPLOAD: CONFIG.sandbox.trafficDistribution.UPLOAD / 100,
            SEARCH: CONFIG.sandbox.trafficDistribution.SEARCH / 100,
            MALICIOUS: CONFIG.sandbox.trafficDistribution.MALICIOUS / 100,
        } : { ...CONFIG.survival.trafficDistribution },
        currentRPS: mode === 'sandbox' ? CONFIG.sandbox.defaultRPS : 0.5,
        burstCount: mode === 'sandbox' ? CONFIG.sandbox.defaultBurstCount : INITIAL_STATE.burstCount,
        timeScale: 0, // Always start paused after reset
        gameStarted: true, // Game has started after reset
        internetNode: { // Reset internetNode position as well
            ...INITIAL_STATE.internetNode,
            position: new THREE.Vector3(
                CONFIG.internetNodeStartPos.x,
                CONFIG.internetNodeStartPos.y,
                CONFIG.internetNodeStartPos.z
            ),
            connections: [] // Clear connections
        },
        // Reset finances, failures, score specific to new game start
        finances: {
            income: {
                byType: { STATIC: 0, READ: 0, WRITE: 0, UPLOAD: 0, SEARCH: 0 },
                countByType: { STATIC: 0, READ: 0, WRITE: 0, UPLOAD: 0, SEARCH: 0, blocked: 0 },
                requests: 0, blocked: 0, total: 0,
            },
            expenses: {
                services: 0, upkeep: 0, repairs: 0, autoRepair: 0,
                byService: { waf: 0, alb: 0, compute: 0, db: 0, s3: 0, cache: 0, sqs: 0 },
                countByService: { waf: 0, alb: 0, compute: 0, db: 0, s3: 0, cache: 0, sqs: 0 },
            },
        },
        failures: { STATIC: 0, READ: 0, WRITE: 0, UPLOAD: 0, SEARCH: 0, MALICIOUS: 0 },
        score: { total: 0, storage: 0, database: 0, maliciousBlocked: 0 },
        services: [], // Clear all placed services
        requests: [], // Clear all active requests
        connections: [], // Clear all connections
        maliciousSpikeTimer: 0,
        maliciousSpikeActive: false,
        normalTrafficDist: null,
        autoRepairEnabled: false,
        intervention: {
            ...INITIAL_STATE.intervention, // Reset intervention state
            currentMilestoneIndex: 0,
            rpsMultiplier: 1.0,
            trafficShiftTimer: 0,
            trafficShiftActive: false,
            currentShift: null,
            originalTrafficDist: null,
            randomEventTimer: 0,
            activeEvent: null,
            eventEndTime: 0,
            recentEvents: [],
            warnings: []
        }
      };

      // Play background music
      if (newState.sound) {
        // Need to ensure sound is initialized upon user interaction.
        // This part needs to be handled carefully as audio context needs user gesture.
        // For now, assume it's okay to call play here, but may need adjustment.
        // newState.sound.init(); // init is called from game.js on reset
        // newState.sound.playGameBGM();
      }

      return newState;
    default:
      return state;
  }
};

// Define the context type
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Create the provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
