import * as THREE from 'three';
import { TRAFFIC_TYPES, CONFIG } from '../config';
import { Service } from './Service'; // Assuming Service class will be defined
import { InternetNodeState } from '../state/GameState'; // Import for InternetNode type

// Interface for traffic type configuration
interface TrafficTypeConfig {
    name: string;
    method: string;
    color: number;
    reward: number;
    score: number;
    cacheable: boolean;
    cacheHitRate: number;
    destination: string;
    processingWeight: number;
}

// Interface for entities that requests can fly to (Service or InternetNode)
export interface RequestTarget {
    id: string;
    position: THREE.Vector3;
    mesh: THREE.Object3D;
    type: string; // e.g., 'internet', 'waf', 'alb'
    config?: { name: string }; // Optional config for services
    connections?: string[]; // For internet node
    queue?: any[]; // For services
    processing?: any[]; // For services
    capacity?: number; // For services
    getEffectiveCapacity?: () => number; // For services
}

export class Request {
    id: string;
    type: string;
    typeConfig: TrafficTypeConfig;
    mesh: THREE.Mesh;
    position: THREE.Vector3;
    destination: string;
    isCacheable: boolean;
    cacheHitRate: number;
    processingWeight: number;
    target: RequestTarget | null;
    path: THREE.CatmullRomCurve3 | null;
    pathProgress: number;
    speed: number;
    cached: boolean; // Indicates if this request was served from cache

    constructor(type: string) {
        this.id = 'req_' + Math.random().toString(36).substr(2, 9);
        this.type = type;
        this.typeConfig = CONFIG.trafficTypes[type as keyof typeof CONFIG.trafficTypes];

        if (!this.typeConfig) {
            console.warn(`Unknown traffic type: ${type}. Defaulting to STATIC.`);
            this.typeConfig = CONFIG.trafficTypes.STATIC;
        }

        const geometry = new THREE.SphereGeometry(0.5, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: this.typeConfig.color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(new THREE.Vector3(CONFIG.internetNodeStartPos.x, 1, CONFIG.internetNodeStartPos.z));
        requestGroup.add(this.mesh); // requestGroup needs to be passed or accessed globally

        this.position = this.mesh.position;
        this.destination = this.typeConfig.destination;
        this.isCacheable = this.typeConfig.cacheable;
        this.cacheHitRate = this.typeConfig.cacheHitRate;
        this.processingWeight = this.typeConfig.processingWeight;

        this.target = null;
        this.path = null;
        this.pathProgress = 0;
        this.speed = 0.05; // Base speed, might be adjusted
        this.cached = false;
    }

    flyTo(target: RequestTarget) {
        this.target = target;
        const startPoint = this.position.clone();
        const endPoint = target.position.clone();
        endPoint.y = startPoint.y; // Keep requests on the same plane as services

        // Simple straight path for now
        this.path = new THREE.CatmullRomCurve3([startPoint, endPoint]);
        this.pathProgress = 0;

        // Add to target's queue if it's a service
        if (target.type !== 'internet' && target.queue) {
            target.queue.push(this);
        }
    }

    update(dt: number) {
        if (this.path && this.target) {
            this.pathProgress += this.speed * dt;
            if (this.pathProgress >= 1) {
                // Request reached target, remove from scene
                this.destroy();
                // Logic to process request at target is handled by the target service itself
            } else {
                this.path.getPointAt(this.pathProgress, this.position);
                this.mesh.position.copy(this.position);
            }
        }
    }

    destroy() {
        requestGroup.remove(this.mesh); // requestGroup needs to be passed or accessed globally
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}

// Dummy requestGroup for now, will be part of the main game component
declare const requestGroup: THREE.Group;
