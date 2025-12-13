import * as THREE from 'three';
import { CONFIG, TRAFFIC_TYPES } from '../config';
import { SoundService } from '../services/SoundService'; // Assuming this will be ported later

// Define interfaces for complex state objects
export interface ScoreState {
    total: number;
    storage: number;
    database: number;
    maliciousBlocked: number;
}

export interface FailuresState {
    STATIC: number;
    READ: number;
    WRITE: number;
    UPLOAD: number;
    SEARCH: number;
    MALICIOUS: number;
}

export interface InternetNodeState {
    id: string;
    type: string;
    position: THREE.Vector3;
    connections: string[]; // IDs of connected services
    mesh?: THREE.Mesh; // Will be set by game logic
    ring?: THREE.Mesh; // Will be set by game logic
}

export interface IncomeByType {
    STATIC: number;
    READ: number;
    WRITE: number;
    UPLOAD: number;
    SEARCH: number;
}

export interface CountByType extends IncomeByType {
    blocked: number;
}

export interface ExpensesByService {
    waf: number;
    alb: number;
    compute: number;
    db: number;
    s3: number;
    cache: number;
    sqs: number;
}

export interface FinancesState {
    income: {
        byType: IncomeByType;
        countByType: CountByType;
        requests: number;
        blocked: number;
        total: number;
    };
    expenses: {
        services: number;
        upkeep: number;
        repairs: number;
        autoRepair: number;
        byService: ExpensesByService;
        countByService: ExpensesByService; // Assuming same structure for count
    };
}

export interface InterventionState {
    trafficShiftTimer: number;
    trafficShiftActive: boolean;
    currentShift: any | null; // Will define a specific interface for shift later
    originalTrafficDist: any | null; // Will define a specific interface for distribution later
    randomEventTimer: number;
    activeEvent: string | null;
    eventEndTime: number;
    eventDuration?: number;
    currentMilestoneIndex: number;
    rpsMultiplier: number;
    recentEvents: any[]; // Will define a specific interface for events later
    warnings: any[]; // Will define a specific interface for warnings later
    costMultiplier?: number;
    trafficBurstMultiplier?: number;
}

// Define the main State interface
export interface GameState {
    money: number;
    reputation: number;
    requestsProcessed: number;
    score: ScoreState;
    failures: FailuresState;
    activeTool: string;
    selectedNodeId: string | null;
    services: any[]; // Will define a specific interface for Service later
    requests: any[]; // Will define a specific interface for Request later
    connections: any[]; // Will define a specific interface for Connection later
    lastTime: number;
    spawnTimer: number;
    currentRPS: number;
    timeScale: number;
    isRunning: boolean;
    animationId: number | null;
    internetNode: InternetNodeState;
    sound: SoundService | null; // Initialized as null, set by game logic

    // Sandbox mode state
    gameMode: 'survival' | 'sandbox';
    sandboxBudget: number;
    upkeepEnabled: boolean;
    trafficDistribution: {
        [key: string]: number; // Map TRAFFIC_TYPES to their distribution percentage
    };
    burstCount: number;

    // Menu state
    gameStarted: boolean;
    previousTimeScale: number;

    // Balance overhaul state
    gameStartTime: number;
    elapsedGameTime: number;
    maliciousSpikeTimer: number;
    maliciousSpikeActive: boolean;
    normalTrafficDist: any | null; // Will define a specific interface for distribution later
    autoRepairEnabled: boolean;

    // Intervention mechanics state
    intervention: InterventionState;
}

// Initial game state
export const INITIAL_STATE: GameState = {
    money: 0,
    reputation: 0,
    requestsProcessed: 0,
    score: { total: 0, storage: 0, database: 0, maliciousBlocked: 0 },
    failures: {
        STATIC: 0,
        READ: 0,
        WRITE: 0,
        UPLOAD: 0,
        SEARCH: 0,
        MALICIOUS: 0,
    },
    activeTool: 'select',
    selectedNodeId: null,
    services: [],
    requests: [],
    connections: [],
    lastTime: 0,
    spawnTimer: 0,
    currentRPS: 0.5,
    timeScale: 1, // Default to 1 (running), but resetGame sets to 0
    isRunning: true, // Default to true, but resetGame handles actual start
    animationId: null,
    internetNode: {
        id: 'internet',
        type: 'internet',
        position: new THREE.Vector3(
            CONFIG.internetNodeStartPos.x,
            CONFIG.internetNodeStartPos.y,
            CONFIG.internetNodeStartPos.z
        ),
        connections: []
    },
    sound: null,

    gameMode: 'survival',
    sandboxBudget: CONFIG.sandbox.defaultBudget,
    upkeepEnabled: true, // Overridden by sandbox mode config
    trafficDistribution: {
        STATIC: CONFIG.survival.trafficDistribution[TRAFFIC_TYPES.STATIC],
        READ: CONFIG.survival.trafficDistribution[TRAFFIC_TYPES.READ],
        WRITE: CONFIG.survival.trafficDistribution[TRAFFIC_TYPES.WRITE],
        UPLOAD: CONFIG.survival.trafficDistribution[TRAFFIC_TYPES.UPLOAD],
        SEARCH: CONFIG.survival.trafficDistribution[TRAFFIC_TYPES.SEARCH],
        MALICIOUS: CONFIG.survival.trafficDistribution[TRAFFIC_TYPES.MALICIOUS],
    },
    burstCount: CONFIG.sandbox.defaultBurstCount,

    gameStarted: false,
    previousTimeScale: 1,

    gameStartTime: 0,
    elapsedGameTime: 0,
    maliciousSpikeTimer: 0,
    maliciousSpikeActive: false,
    normalTrafficDist: null,
    autoRepairEnabled: false,

    intervention: {
        trafficShiftTimer: 0,
        trafficShiftActive: false,
        currentShift: null,
        originalTrafficDist: null,
        randomEventTimer: 0,
        activeEvent: null,
        eventEndTime: 0,
        currentMilestoneIndex: 0,
        rpsMultiplier: 1.0,
        recentEvents: [],
        warnings: []
    }
};
