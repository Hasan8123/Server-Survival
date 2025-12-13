import * as THREE from 'three';
import { CONFIG, TRAFFIC_TYPES } from '../config';
import { Request } from './Request'; // Assuming Request class is defined

// Helper function from game.js
function flashMoney() {
    // This will eventually dispatch an action to GameContext
    console.log("Flash money (placeholder)");
}

// Helper function from game.js
function addInterventionWarning(message: string, type: string, duration: number) {
    // This will eventually dispatch an action to GameContext
    console.log(`Add warning (placeholder): ${message} (${type})`);
}

// Helper function from game.js
function updateScore(req: Request, outcome: string) {
    // This will eventually dispatch an action to GameContext
    console.log(`Update score (placeholder): ${req.id} - ${outcome}`);
}

// Helper function from game.js
function finishRequest(req: Request) {
    // This will eventually dispatch an action to GameContext
    console.log(`Finish request (placeholder): ${req.id}`);
    req.destroy();
}

// Helper function from game.js
function failRequest(req: Request) {
    // This will eventually dispatch an action to GameContext
    console.log(`Fail request (placeholder): ${req.id}`);
    req.destroy();
}

// Helper function from game.js (from `game.js`)
function getUpkeepMultiplier(): number {
    // This will eventually depend on GameContext state
    return 1.0; // Placeholder
}

/**
 * Calculates the percentage if failure based on the load of the node.
 * @param {number} load fractions of 1 (0 to 1) of how loaded the node is
 * @returns {number} chance of failure (0 to 1)
 */
function calculateFailChanceBasedOnLoad(load: number): number {
    if (load <= 0.5) return 0;
    return 2 * (load - 0.5);
}

// Interfaces for service configuration
export interface ServiceConfig {
    name: string;
    cost: number;
    type: string;
    processingTime: number;
    capacity: number;
    upkeep: number;
    tooltip: {
        upkeep: string;
        desc: string;
    };
    cacheHitRate?: number;
    maxQueueSize?: number;
    tiers?: ServiceTier[];
}

export interface ServiceTier {
    level: number;
    capacity: number;
    cost: number;
    cacheHitRate?: number;
}

export class Service {
    id: string;
    type: string;
    config: ServiceConfig;
    position: THREE.Vector3;
    queue: Request[];
    processing: { req: Request; timer: number }[];
    connections: string[]; // IDs of connected services
    mesh: THREE.Mesh;
    loadRing: THREE.Mesh;
    tier: number;
    tierRings: THREE.Mesh[];
    rrIndex: number;
    health: number;
    originalColor: number;
    healthBarBg: THREE.Mesh;
    healthBarFill: THREE.Mesh;
    queueFill?: THREE.Mesh;
    tempCapacityReduction?: number;
    isDisabled?: boolean;

    constructor(type: string, pos: THREE.Vector3) {
        this.id = "svc_" + Math.random().toString(36).substring(2, 9);
        this.type = type;
        this.config = CONFIG.services[type as keyof typeof CONFIG.services];
        this.position = pos.clone();
        this.queue = [];
        this.processing = [];
        this.connections = [];

        let geo: THREE.BufferGeometry;
        let mat: THREE.MeshStandardMaterial;
        const materialProps = { roughness: 0.2 };

        switch (type) {
            case "waf":
                geo = new THREE.BoxGeometry(3, 2, 0.5);
                mat = new THREE.MeshStandardMaterial({
                    color: CONFIG.colors.waf,
                    ...materialProps,
                });
                break;
            case "alb":
                geo = new THREE.BoxGeometry(3, 1.5, 3);
                mat = new THREE.MeshStandardMaterial({
                    color: CONFIG.colors.alb,
                    roughness: 0.1,
                });
                break;
            case "compute":
                geo = new THREE.CylinderGeometry(1.2, 1.2, 3, 16);
                mat = new THREE.MeshStandardMaterial({
                    color: CONFIG.colors.compute,
                    ...materialProps,
                });
                break;
            case "db":
                geo = new THREE.CylinderGeometry(2, 2, 2, 6);
                mat = new THREE.MeshStandardMaterial({
                    color: CONFIG.colors.db,
                    roughness: 0.3,
                });
                break;
            case "s3":
                geo = new THREE.CylinderGeometry(1.8, 1.5, 1.5, 8);
                mat = new THREE.MeshStandardMaterial({
                    color: CONFIG.colors.s3,
                    ...materialProps,
                });
                break;
            case "cache":
                geo = new THREE.BoxGeometry(2.5, 1.5, 2.5);
                mat = new THREE.MeshStandardMaterial({
                    color: CONFIG.colors.cache,
                    ...materialProps,
                });
                break;
            case "sqs":
                geo = new THREE.BoxGeometry(4, 0.8, 2);
                mat = new THREE.MeshStandardMaterial({
                    color: CONFIG.colors.sqs,
                    ...materialProps,
                });
                break;
            default:
                geo = new THREE.BoxGeometry(1, 1, 1);
                mat = new THREE.MeshStandardMaterial({ color: 0xffffff, ...materialProps });
                break;
        }

        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.position.copy(pos);

        if (type === "waf") this.mesh.position.y += 1;
        else if (type === "alb") this.mesh.position.y += 0.75;
        else if (type === "compute") this.mesh.position.y += 1.5;
        else if (type === "s3") this.mesh.position.y += 0.75;
        else if (type === "cache") this.mesh.position.y += 0.75;
        else if (type === "sqs") this.mesh.position.y += 0.4;
        else this.mesh.position.y += 1;

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.userData = { id: this.id };

        const ringGeo = new THREE.RingGeometry(2.5, 2.7, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x333333,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
        });
        this.loadRing = new THREE.Mesh(ringGeo, ringMat);
        this.loadRing.rotation.x = -Math.PI / 2;
        this.loadRing.position.y = -this.mesh.position.y + 0.1;
        this.mesh.add(this.loadRing);

        this.tier = 1;
        this.tierRings = [];
        this.rrIndex = 0;

        // Service health for degradation mechanic
        this.health = 100;
        this.originalColor = mat.color.getHex();

        // Health bar (3D bar above service)
        this.createHealthBar();

        // SQS queue fill indicator
        if (type === "sqs") {
            const fillGeo = new THREE.BoxGeometry(3.8, 0.6, 1.8);
            const fillMat = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.3,
            });
            this.queueFill = new THREE.Mesh(fillGeo, fillMat);
            this.queueFill.position.set(0, 0, 0);
            this.queueFill.scale.x = 0;
            this.mesh.add(this.queueFill);
        }

        serviceGroup.add(this.mesh); // serviceGroup needs to be passed or accessed globally
    }

    upgrade() {
        if (!["compute", "db", "cache"].includes(this.type)) return;
        const tiers = this.config.tiers;
        if (!tiers || this.tier >= tiers.length) return;

        const nextTier = tiers[this.tier]; // Tiers are 0-indexed, but this.tier is 1-indexed
        if (nextTier === undefined) return; // Should not happen if check is correct

        // This will eventually dispatch an action to GameContext to deduct money
        // if (STATE.money < nextTier.cost) {
        //   flashMoney();
        //   return;
        // }

        // STATE.money -= nextTier.cost;
        this.tier++;
        this.config = { ...this.config, capacity: nextTier.capacity };

        // Update cacheHitRate for cache type
        if (this.type === "cache" && nextTier.cacheHitRate !== undefined) {
            this.config = { ...this.config, cacheHitRate: nextTier.cacheHitRate };
        }

        // STATE.sound.playPlace(); // This will eventually be a dispatch

        // Visuals
        let ringSize, ringColor;
        if (this.type === "db") {
            ringSize = 2.2;
            ringColor = 0xff0000;
        } else if (this.type === "cache") {
            ringSize = 1.5;
            ringColor = 0xdc382d; // Redis red
        } else {
            ringSize = 1.3;
            ringColor = 0xffff00;
        }

        const ringGeo = new THREE.TorusGeometry(ringSize, 0.1, 8, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: ringColor });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        // Tier rings
        ring.position.y = -this.mesh.position.y + (this.tier === 2 ? 0.5 : 1.0);
        this.mesh.add(ring);
        this.tierRings.push(ring);
    }

    processQueue() {
        const effectiveCapacity = this.getEffectiveCapacity();
        while (
            this.processing.length < effectiveCapacity &&
            this.queue.length > 0
        ) {
            const req = this.queue.shift();
            if (!req) continue; // Should not happen with length check

            if (this.type === "waf" && req.type === TRAFFIC_TYPES.MALICIOUS) {
                updateScore(req, "MALICIOUS_BLOCKED"); // Placeholder
                req.destroy();
                continue;
            }

            this.processing.push({ req: req, timer: 0 });
        }
    }

    findConnectedService(serviceType: string, allServices: Service[]): Service | undefined {
        // This function needs access to all services in the game state
        // For now, it will be passed in as a parameter
        return allServices.find(
            (s) => this.connections.includes(s.id) && s.type === serviceType
        );
    }

    forwardToDestination(req: Request, allServices: Service[]) {
        const destType = req.destination;
        const target = this.findConnectedService(destType, allServices); // Pass allServices
        if (target) {
            // Add to target's queue
            target.queue.push(req);
            // Update request's target for visual flight
            req.flyTo(target);
            return true;
        }
        return false;
    }

    update(dt: number, currentGameState: any, dispatch: any, allServices: Service[]) { // Pass currentGameState and dispatch
        // Service degradation mechanic
        if (CONFIG.survival.degradation?.enabled && currentGameState.gameMode === "survival") {
            const degradeConfig = CONFIG.survival.degradation;
            const load = this.totalLoad;

            // Always degrade when handling any traffic, faster at higher loads
            if (load > 0.05) {
                // Base decay + load-based acceleration
                const loadMultiplier = 0.5 + load * 1.5; // 0.5x at low load, 2x at full load
                const degradeAmount =
                    degradeConfig.healthDecayRate * loadMultiplier * dt;
                this.health = Math.max(0, this.health - degradeAmount);
            } else if (degradeConfig.autoRepairRate && this.health < 100) { // autoRepairRate not in config
                // Auto-repair when idle (only if enabled)
                // This logic needs to be refactored with actual autoRepairRate from config or state
                this.health = Math.min(
                    100,
                    this.health + (degradeConfig.autoRepairRate || 0) * dt // Placeholder
                );
            }

            // Update visual appearance based on health
            this.updateHealthVisual();
        }

        if (currentGameState.upkeepEnabled) { // Access upkeepEnabled from currentGameState
            const multiplier = getUpkeepMultiplier(); // This needs to be passed or accessed via context
            const upkeepCost = (this.config.upkeep / 60) * dt * multiplier;
            // dispatch({ type: 'DEDUCT_MONEY', payload: upkeepCost }); // Example dispatch
        }

        this.processQueue();

        for (let i = this.processing.length - 1; i >= 0; i--) {
            let job = this.processing[i];

            const processingTime =
                this.type === "compute"
                    ? this.config.processingTime * job.req.processingWeight
                    : this.config.processingTime;

            job.timer += dt * 1000;

            if (job.timer >= processingTime) {
                this.processing.splice(i, 1);

                const failChance = calculateFailChanceBasedOnLoad(this.totalLoad);
                // Increase fail chance when health is low
                const healthPenalty =
                    this.health < (CONFIG.survival.degradation?.criticalHealth || 30)
                        ? (1 - this.health / 100) * 0.5
                        : 0;
                const totalFailChance = Math.min(1, failChance + healthPenalty);
                if (Math.random() < totalFailChance) {
                    failRequest(job.req); // Placeholder
                    continue;
                }

                if (this.type === "db") {
                    if (job.req.destination === "db") {
                        finishRequest(job.req); // Placeholder
                    } else {
                        failRequest(job.req); // Placeholder
                    }
                    continue;
                }

                if (this.type === "s3") {
                    if (job.req.destination === "s3") {
                        finishRequest(job.req); // Placeholder
                    } else {
                        failRequest(job.req); // Placeholder
                    }
                    continue;
                }

                if (this.type === "cache") {
                    if (job.req.isCacheable) {
                        const hitRate = job.req.cacheHitRate;

                        if (Math.random() < hitRate) {
                            job.req.cached = true;
                            // STATE.sound.playSuccess(); // Placeholder
                            this.flashCacheHit();
                            finishRequest(job.req); // Placeholder
                            continue;
                        }
                    }

                    const destType = job.req.destination;
                    const target = this.findConnectedService(destType, allServices); // Pass allServices

                    if (target) {
                        // Add to target's queue
                        target.queue.push(job.req);
                        // Update request's target for visual flight
                        job.req.flyTo(target);
                    } else {
                        failRequest(job.req); // Placeholder
                    }
                    continue;
                }

                // SQS processing logic
                if (this.type === "sqs") {
                    // SQS just forwards requests with backpressure check
                    const downstreamTypes = ["alb", "compute"];
                    const candidates = this.connections
                        .map((id) => allServices.find((s) => s.id === id)) // Use allServices
                        .filter((s): s is Service => s !== undefined && downstreamTypes.includes(s.type)); // Type guard

                    if (candidates.length === 0) {
                        failRequest(job.req); // Placeholder
                        continue;
                    }

                    // Round-robin with backpressure check
                    let sent = false;
                    for (let attempt = 0; attempt < candidates.length; attempt++) {
                        const target = candidates[this.rrIndex % candidates.length];
                        this.rrIndex++;

                        // Check if target can accept (has queue space)
                        const targetMaxQueue = target.config.maxQueueSize || 20;
                        if (target.queue.length < targetMaxQueue) {
                            // Add to target's queue
                            target.queue.push(job.req);
                            // Update request's target for visual flight
                            job.req.flyTo(target);
                            sent = true;
                            break;
                        }
                    }

                    if (!sent) {
                        // All downstream busy - put back in OUR queue
                        this.queue.unshift(job.req);
                        this.processing.splice(i, 1);
                        break; // Don't process more this frame
                    }
                    continue;
                }

                if (this.type === "compute") {
                    const destType = job.req.destination;

                    if (destType === "blocked") {
                        failRequest(job.req); // Placeholder
                        continue;
                    }

                    if (job.req.isCacheable) {
                        const cacheTarget = this.findConnectedService("cache", allServices); // Pass allServices
                        if (cacheTarget) {
                            // Add to cache's queue
                            cacheTarget.queue.push(job.req);
                            // Update request's target for visual flight
                            job.req.flyTo(cacheTarget);
                            continue;
                        }
                    }

                    const directTarget = this.findConnectedService(destType, allServices); // Pass allServices
                    if (directTarget) {
                        // Add to target's queue
                        directTarget.queue.push(job.req);
                        // Update request's target for visual flight
                        job.req.flyTo(directTarget);
                    } else {
                        failRequest(job.req); // Placeholder
                    }
                } else {
                    const candidates = this.connections
                        .map((id) => allServices.find((s) => s.id === id)) // Use allServices
                        .filter((s): s is Service => s !== undefined); // Type guard

                    if (candidates.length > 0) {
                        const target = candidates[this.rrIndex % candidates.length];
                        this.rrIndex++;
                        // Add to target's queue
                        target.queue.push(job.req);
                        // Update request's target for visual flight
                        job.req.flyTo(target);
                    } else {
                        failRequest(job.req); // Placeholder
                    }
                }
            }
        }

        // Update visual load ring
        if (this.totalLoad > 0.8) {
            this.loadRing.material.color.setHex(0xff0000);
            // if (currentGameState.selectedNodeId === this.id) { // Access selectedNodeId from currentGameState
            //     this.loadRing.material.opacity = 1.0;
            // } else {
            //     this.loadRing.material.opacity = 0.8;
            // }
        } else if (this.totalLoad > 0.5) {
            this.loadRing.material.color.setHex(0xffaa00);
            // if (currentGameState.selectedNodeId === this.id) { // Access selectedNodeId from currentGameState
            //     this.loadRing.material.opacity = 1.0;
            // } else {
            //     this.loadRing.material.opacity = 0.6;
            // }
        } else if (this.totalLoad > 0.2) {
            this.loadRing.material.color.setHex(0xffff00);
            // if (currentGameState.selectedNodeId === this.id) { // Access selectedNodeId from currentGameState
            //     this.loadRing.material.opacity = 1.0;
            // } else {
            //     this.loadRing.material.opacity = 0.4;
            // }
        } else {
            this.loadRing.material.color.setHex(0x00ff00);
            // if (currentGameState.selectedNodeId === this.id) { // Access selectedNodeId from currentGameState
            //     this.loadRing.material.opacity = 1.0;
            // } else {
            //     this.loadRing.material.opacity = 0.3;
            // }
        }

        // SQS queue fill indicator
        if (this.type === "sqs" && this.queueFill) {
            const maxQ = this.config.maxQueueSize || 200;
            const fillPercent = this.queue.length / maxQ;
            this.queueFill.scale.x = fillPercent;
            this.queueFill.position.x = (fillPercent - 1) * 1.9;

            if (fillPercent > 0.8) {
                this.queueFill.material.color.setHex(0xff0000);
            } else if (fillPercent > 0.5) {
                this.queueFill.material.color.setHex(0xffaa00);
            } else {
                this.queueFill.material.color.setHex(0x00ff00);
            }
        }
    }

    flashCacheHit() {
        if (!this.mesh) return;
        const originalColor = this.mesh.material.color.getHex();
        this.mesh.material.color.setHex(0x00ff00); // Green flash
        setTimeout(() => {
            this.mesh.material.color.setHex(originalColor);
        }, 100);
    }

    get totalLoad(): number {
        const capacity = this.config.capacity;
        if (capacity === 0) return 1; // Avoid division by zero
        return (
            (this.processing.length + this.queue.length) / (capacity * 2)
        );
    }

    destroy() {
        // serviceGroup.remove(this.mesh); // serviceGroup needs to be passed or accessed globally
        if (this.tierRings) {
            this.tierRings.forEach((r) => {
                r.geometry.dispose();
                (r.material as THREE.Material).dispose();
            });
        }
        if (this.healthBarBg) {
            this.healthBarBg.geometry.dispose();
            (this.healthBarBg.material as THREE.Material).dispose();
        }
        if (this.healthBarFill) {
            this.healthBarFill.geometry.dispose();
            (this.healthBarFill.material as THREE.Material).dispose();
        }
        this.mesh.geometry.dispose();
        (this.mesh.material as THREE.Material).dispose();
    }

    createHealthBar() {
        // Background bar (dark)
        const bgGeo = new THREE.BoxGeometry(3, 0.3, 0.1);
        const bgMat = new THREE.MeshBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.8,
        });
        this.healthBarBg = new THREE.Mesh(bgGeo, bgMat);
        this.healthBarBg.position.set(0, 2.5, 0);
        this.mesh.add(this.healthBarBg);

        // Fill bar (colored based on health)
        const fillGeo = new THREE.BoxGeometry(2.9, 0.25, 0.12);
        const fillMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.healthBarFill = new THREE.Mesh(fillGeo, fillMat);
        this.healthBarFill.position.set(0, 0, 0.01);
        this.healthBarBg.add(this.healthBarFill);

        // Initially hidden (show when damaged)
        this.healthBarBg.visible = false;
    }

    updateHealthBar() {
        if (!this.healthBarBg || !this.healthBarFill) return;

        // Show health bar when health < 100
        this.healthBarBg.visible = this.health < 100;

        if (this.health >= 100) return;

        // Update fill scale (0 to 1)
        const fillPercent = this.health / 100;
        this.healthBarFill.scale.x = Math.max(0.01, fillPercent);
        this.healthBarFill.position.x = (fillPercent - 1) * 1.45;

        // Update color based on health
        if (this.health < 30) {
            this.healthBarFill.material.color.setHex(0xff0000); // Red
        } else if (this.health < 60) {
            this.healthBarFill.material.color.setHex(0xff8800); // Orange
        } else if (this.health < 80) {
            this.healthBarFill.material.color.setHex(0xffff00); // Yellow
        } else {
            this.healthBarFill.material.color.setHex(0x00ff00); // Green
        }
    }

    updateHealthVisual() {
        if (!this.mesh || !this.mesh.material) return;

        // Update the 3D health bar
        this.updateHealthBar();

        const criticalHealth = CONFIG.survival.degradation?.criticalHealth || 30;

        if (this.health < criticalHealth) {
            // Critical - red tint and pulsing
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 200);
            (this.mesh.material as THREE.MeshStandardMaterial).color.setHex(0xff0000);
            (this.mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0xff0000);
            (this.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 0.3;
        } else if (this.health < 60) {
            // Damaged - orange tint
            (this.mesh.material as THREE.MeshStandardMaterial).color.setHex(0xff8800);
            (this.mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x000000);
            (this.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
        } else if (this.health < 80) {
            // Worn - yellow tint
            const healthRatio = this.health / 100;
            const r =
                (1 - healthRatio) * 255 +
                healthRatio * ((this.originalColor >> 16) & 0xff);
            const g = healthRatio * ((this.originalColor >> 8) & 0xff);
            const b = healthRatio * (this.originalColor & 0xff);
            (this.mesh.material as THREE.MeshStandardMaterial).color.setRGB(r / 255, g / 255, b / 255);
            (this.mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x000000);
            (this.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
        } else {
            // Healthy - original color
            (this.mesh.material as THREE.MeshStandardMaterial).color.setHex(this.originalColor);
            (this.mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x000000);
            (this.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
        }
    }

    repair(currentGameState: any, dispatch: any): boolean {
        if (this.health >= 100) return false;

        const repairConfig = CONFIG.survival.degradation;
        const repairCost = Math.ceil(
            this.config.cost * (repairConfig?.repairCostPercent || 0.15)
        );

        // if (currentGameState.money < repairCost) { // Access money from currentGameState
        //     flashMoney(); // Placeholder
        //     addInterventionWarning(
        //         `❌ Need $${repairCost} to repair`,
        //         "danger",
        //         2000
        //     );
        //     return false;
        // }

        // dispatch({ type: 'DEDUCT_MONEY', payload: repairCost }); // Example dispatch
        // dispatch({ type: 'UPDATE_FINANCES_EXPENSES', payload: { type: this.type, cost: repairCost } }); // Example dispatch

        this.health = 100;
        this.updateHealthVisual();
        // currentGameState.sound?.playPlace(); // Placeholder
        return true;
    }

    getEffectiveCapacity(): number {
        // Reduce capacity when health is low
        let capacity = this.config.capacity;

        // Apply health-based reduction
        const criticalHealth = CONFIG.survival.degradation?.criticalHealth || 30;
        if (this.health < criticalHealth) {
            // Linear reduction from critical to 0 health: 100% -> 30% capacity
            const healthRatio = this.health / criticalHealth;
            capacity = Math.max(1, Math.floor(capacity * (0.3 + 0.7 * healthRatio)));
        }

        // Apply temporary capacity reduction from random events
        if (this.tempCapacityReduction && this.tempCapacityReduction < 1) {
            capacity = Math.max(1, Math.floor(capacity * this.tempCapacityReduction));
        }

        // Check if service is disabled
        if (this.isDisabled) {
            return 0;
        }

        return capacity;
    }

    static restore(serviceData: any, pos: THREE.Vector3): Service { // serviceData type needs definition
        const service = new Service(serviceData.type, pos);
        service.id = serviceData.id;
        service.mesh.userData.id = serviceData.id;

        if (serviceData.tier && serviceData.tier > 1) {
            const tiers = CONFIG.services[serviceData.type as keyof typeof CONFIG.services]?.tiers;
            if (tiers) {
                service.tier = serviceData.tier;
                const tierData = tiers[service.tier - 1];
                if (tierData) {
                    service.config = { ...service.config, capacity: tierData.capacity };
                    if (tierData.cacheHitRate !== undefined) {
                        service.config = {
                            ...service.config,
                            cacheHitRate: tierData.cacheHitRate,
                        };
                    }
                }

                for (let t = 2; t <= service.tier; t++) {
                    let ringSize, ringColor;
                    if (service.type === "db") {
                        ringSize = 2.2;
                        ringColor = 0xff0000;
                    } else if (service.type === "cache") {
                        ringSize = 1.5;
                        ringColor = 0xdc382d;
                    } else {
                        ringSize = 1.3;
                        ringColor = 0xffff00;
                    }
                    const ringGeo = new THREE.TorusGeometry(ringSize, 0.1, 8, 32);
                    const ringMat = new THREE.MeshBasicMaterial({ color: ringColor });
                    const ring = new THREE.Mesh(ringGeo, ringMat);
                    ring.rotation.x = Math.PI / 2;
                    ring.position.y = -service.mesh.position.y + (t === 2 ? 0.5 : 1.0);
                    service.mesh.add(ring);
                    service.tierRings.push(ring);
                }
            }
        }

        return service;
    }
}

// Dummy serviceGroup for now, will be part of the main game component
declare const serviceGroup: THREE.Group;
