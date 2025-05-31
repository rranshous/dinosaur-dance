// The magnificent dancing dinosaur game!
// A delightful collaboration between Robby and GitHub Copilot

import { VoiceController } from './VoiceController.js';
import { DancePartyManager } from './DancePartyManager.js';
import { BackgroundManager } from './BackgroundManager.js';

export {}; // Make this file a module

class DinosaurDanceGame {
    private cursorDinosaur!: HTMLElement; // Will be initialized in createCursorDinosaur
    private plantedDinosaurs: HTMLElement[] = [];
    private tinyDancerPile: HTMLElement[] = []; // Track the pile for physics!
    
    // Painting mode for continuous brush strokes!
    private isMouseDown: boolean = false;
    private lastPlantTime: number = 0;
    private brushDelay: number = 100; // milliseconds between brush strokes
    
    // Thematic collections for visual consistency with variety!
    private emojiSets = {
        prehistoric: ['🦕', '🦴', '🐊', '🐲', '🦖', '🐉'],
        reptiles: ['🦎', '🐍', '🐢', '🐊', '🐸', '🦕'],
        insects: ['🦋', '🐝', '🐞', '🦗', '🕷️', '🦂', '🐛', '🐜', '🦟'],
        mammals: ['🐨', '🐼', '🦘', '🦥', '🦦', '🦨', '🦔', '🐿️', '🐹', '🐭', '🐰', '🦊'],
        predators: ['🐺', '🐻', '🐯', '🦁', '🦈', '🐉', '🦖'],
        ocean: ['🐙', '🦑', '🦐', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐚'],
        magical: ['⭐', '🌟', '✨', '💫', '🔥', '❄️', '☄️', '🌈', '🎪']
    };
    
    private currentSet: string = 'prehistoric';
    private setOrder: string[] = ['prehistoric', 'reptiles', 'insects', 'mammals', 'predators', 'ocean', 'magical'];
    private setIndex: number = 0;
    private plantingsInCurrentSet: number = 0;
    private plantingsBeforeSetChange: number = 8; // Will be randomized in constructor
    private dancerCount = 0;

    // Managers for different aspects of the game
    private voiceController!: VoiceController;
    private dancePartyManager!: DancePartyManager;
    private backgroundManager!: BackgroundManager;

    constructor() {
        this.plantingsBeforeSetChange = this.getRandomEvolutionCount();
        this.createCursorDinosaur();
        this.setupEventListeners();
        
        // Initialize managers
        this.backgroundManager = new BackgroundManager();
        this.dancePartyManager = new DancePartyManager(this.emojiSets, this.currentSet, this.plantedDinosaurs, () => {
            this.dancerCount++;
            this.updateCounter();
        });
        this.voiceController = new VoiceController(this.handleVoiceCommand.bind(this));
        
        this.updateCounter();
        this.backgroundManager.evolve(0); // Initialize the beautiful background
    }

    private createCursorDinosaur(): void {
        this.cursorDinosaur = document.createElement('div');
        this.cursorDinosaur.className = 'dinosaur cursor-dinosaur';
        this.cursorDinosaur.textContent = this.getRandomDinosaur();
        document.body.appendChild(this.cursorDinosaur);
    }

    private handleVoiceCommand(command: string, transcript: string): void {
        switch (command) {
            case 'clear dance floor':
                console.log('🎤 Voice command: Clearing dance floor!');
                this.clearDanceFloor();
                break;
            case 'dance party':
                console.log('🎤 Voice command: Dance party demonstration!');
                this.dancePartyManager.createDanceParty(1);
                // Trigger the delightful celebration effects!
                this.triggerVoiceCommandCelebration();
                break;
            case 'restart the party':
                console.log('🎤 Voice command: Restarting the party!');
                this.clearAllDinosaurs();
                break;
            case 'musical_dance_party':
                const intensity = this.voiceController.getDanceIntensity(transcript);
                console.log(`🎤 Voice command: Musical dance party with intensity ${intensity}!`);
                this.dancePartyManager.createDanceParty(intensity);
                // Trigger EXTRA celebration effects for musical intensity!
                this.triggerVoiceCommandCelebration(intensity);
                break;
        }
    }

    private getRandomDinosaur(): string {
        const currentEmojis = this.emojiSets[this.currentSet as keyof typeof this.emojiSets];
        return currentEmojis[Math.floor(Math.random() * currentEmojis.length)];
    }
    
    private getRandomEvolutionCount(): number {
        // Organic evolution timing: between 6-12 plantings for delightful unpredictability
        return Math.floor(Math.random() * 7) + 6; // 6-12 inclusive
    }
    
    private tryBrushStroke(x: number, y: number): void {
        const now = Date.now();
        if (now - this.lastPlantTime >= this.brushDelay) {
            this.plantDinosaur(x, y);
        }
    }
    
    private evolveBackground(): void {
        this.backgroundManager.evolve(this.dancerCount);
    }
    
    private evolveToNextSet(): void {
        this.setIndex = (this.setIndex + 1) % this.setOrder.length;
        this.currentSet = this.setOrder[this.setIndex];
        this.plantingsInCurrentSet = 0;
        
        // Set new random evolution count for organic unpredictability
        this.plantingsBeforeSetChange = this.getRandomEvolutionCount();
        
        // Update cursor to new set immediately for preview
        this.cursorDinosaur.textContent = this.getRandomDinosaur();
        
        // Update the dance party manager with new set
        this.dancePartyManager = new DancePartyManager(this.emojiSets, this.currentSet, this.plantedDinosaurs, () => {
            this.dancerCount++;
            this.updateCounter();
        });
        
        // Show a delightful notification of the set change
        this.showSetChangeNotification();
    }
    
    private showSetChangeNotification(): void {
        // Spawn celebration creatures that dance across the canvas!
        this.spawnCelebrationCreatures();
    }
    
    private findNextPilePosition(): {x: number, y: number} {
        const pileCenter = window.innerWidth / 2;
        const pileSpread = Math.min(800, window.innerWidth * 0.9); // Even wider spread!
        const baseLevel = window.innerHeight - 35; // Closer to very bottom
        
        // If no pile exists yet, start at the bottom center with wide initial spread
        if (this.tinyDancerPile.length === 0) {
            return {
                x: pileCenter + (Math.random() - 0.5) * 150, // Much wider initial spread
                y: baseLevel
            };
        }
        
        // For dense wide carpeting, strongly prefer horizontal spreading!
        const targetX = pileCenter + (Math.random() - 0.5) * pileSpread;
        let highestY = baseLevel;
        let nearbyDancers = 0;
        
        // Check density in the target area - count dancers more broadly for better spreading
        this.tinyDancerPile.forEach(dancer => {
            const dancerX = parseInt(dancer.style.left);
            const dancerY = parseInt(dancer.style.top);
            const distance = Math.abs(dancerX - targetX);
            
            // Count dancers in this horizontal zone (wider for better density awareness)
            if (distance < 35) {
                nearbyDancers++;
                
                // Only stack if this exact spot is really crowded (4+ dancers)
                if (nearbyDancers >= 4 && distance < 18) {
                    const stackHeight = dancerY - 18; // Tight stacking height
                    if (stackHeight < highestY) {
                        highestY = stackHeight;
                    }
                }
            }
        });
        
        // Strongly prefer horizontal spreading until dense carpet is formed!
        if (nearbyDancers < 4) {
            // Find a less crowded spot for better wide distribution
            let bestX = targetX;
            let lowestDensity = nearbyDancers;
            
            // Try several spots across the spread to find the least dense area
            for (let attempt = 0; attempt < 8; attempt++) {
                const testX = pileCenter + (Math.random() - 0.5) * pileSpread;
                let testDensity = 0;
                
                this.tinyDancerPile.forEach(dancer => {
                    const dancerX = parseInt(dancer.style.left);
                    if (Math.abs(dancerX - testX) < 35) testDensity++;
                });
                
                if (testDensity < lowestDensity) {
                    bestX = testX;
                    lowestDensity = testDensity;
                }
            }
            
            return {
                x: bestX,
                y: baseLevel // Always stay at ground level for wide carpet effect!
            };
        }
        
        return {
            x: targetX,
            y: highestY
        };
    }
    
    private spawnCelebrationCreatures(): void {
        const currentEmojis = this.emojiSets[this.currentSet as keyof typeof this.emojiSets];
        const celebrationCount = 8; // Even more tiny dancers for faster carpet building!
        
        for (let i = 0; i < celebrationCount; i++) {
            setTimeout(() => {
                const creature = document.createElement('div');
                creature.className = 'dinosaur tiny-dancer';
                creature.textContent = currentEmojis[Math.floor(Math.random() * currentEmojis.length)];
                
                // Start from random positions across the top
                const startX = Math.random() * window.innerWidth;
                const startY = -50;
                
                // Find where this dancer should land in the growing pile!
                const landingSpot = this.findNextPilePosition();
                
                creature.style.left = startX + 'px';
                creature.style.top = startY + 'px';
                creature.style.fontSize = '24px'; // Much smaller!
                creature.style.zIndex = '50'; // Below everything else
                creature.setAttribute('data-tiny-dancer', 'true');
                
                document.body.appendChild(creature);
                
                // Animate the gentle fall to the calculated pile position
                setTimeout(() => {
                    creature.style.transition = 'left 2.5s ease-out, top 2.5s ease-in';
                    creature.style.left = landingSpot.x + 'px';
                    creature.style.top = landingSpot.y + 'px';
                }, 100);
                
                // Once they land, they become part of the pile physics!
                setTimeout(() => {
                    creature.classList.add('pile-dancer');
                    creature.style.transition = 'none';
                    this.tinyDancerPile.push(creature); // Add to pile tracking!
                }, 2600);
                
            }, i * 300); // Stagger the falling
        }
    }
    
    private setupEventListeners(): void {
        // Follow the mouse cursor
        document.addEventListener('mousemove', (e) => {
            this.cursorDinosaur.style.left = `${e.clientX - 30}px`;
            this.cursorDinosaur.style.top = `${e.clientY - 30}px`;
            
            // Continuous painting when mouse is held down!
            if (this.isMouseDown) {
                this.tryBrushStroke(e.clientX, e.clientY);
            }
        });

        // Start painting stroke
        document.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.plantDinosaur(e.clientX, e.clientY);
        });

        // End painting stroke
        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });

        // Plant dinosaur on right click (and prevent context menu)
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.randomDinosaurParty();
        });

        // Hide cursor dinosaur when mouse leaves window
        document.addEventListener('mouseleave', () => {
            this.cursorDinosaur.style.display = 'none';
        });

        // Show cursor dinosaur when mouse enters window
        document.addEventListener('mouseenter', () => {
            this.cursorDinosaur.style.display = 'block';
        });
    }

    private plantDinosaur(x: number, y: number): void {
        const plantedDinosaur = document.createElement('div');
        plantedDinosaur.className = 'dinosaur planted-dinosaur';
        // Plant the SAME dinosaur that's following the cursor!
        plantedDinosaur.textContent = this.cursorDinosaur.textContent;
        plantedDinosaur.style.left = `${x - 30}px`;
        plantedDinosaur.style.top = `${y - 30}px`;
        
        // Add protective attributes to ensure these stay safe
        plantedDinosaur.setAttribute('data-planted', 'true');
        plantedDinosaur.setAttribute('data-creation-time', Date.now().toString());
        
        // Add some random rotation for variety
        const randomRotation = Math.random() * 20 - 10;
        plantedDinosaur.style.transform = `rotate(${randomRotation}deg)`;
        
        // Stickers are meant to stay! No more tragic removals
        // plantedDinosaur.addEventListener('click', (e) => {
        //     e.stopPropagation();
        //     this.removeDinosaur(plantedDinosaur);
        // });

        document.body.appendChild(plantedDinosaur);
        this.plantedDinosaurs.push(plantedDinosaur);
        this.dancerCount++;
        this.updateCounter();
        this.lastPlantTime = Date.now();

        // Evolve the background subtly with each placement
        this.evolveBackground();

        // Make UI elements participate in the dance!
        this.makeUIElementsDance();

        // Track plantings in current set and evolve when ready
        this.plantingsInCurrentSet++;
        if (this.plantingsInCurrentSet >= this.plantingsBeforeSetChange) {
            this.evolveToNextSet();
        } else {
            // Change cursor dinosaur to a new random one from current set
            this.cursorDinosaur.textContent = this.getRandomDinosaur();
        }

        // Add a little celebration animation
        this.celebratePlanting(plantedDinosaur);
    }

    private celebratePlanting(dinosaur: HTMLElement): void {
        dinosaur.style.transform += ' scale(1.5)';
        setTimeout(() => {
            dinosaur.style.transform = dinosaur.style.transform.replace(' scale(1.5)', '');
        }, 200);
    }

    private clearAllDinosaurs(): void {
        // Clear the main artwork
        this.plantedDinosaurs.forEach(dinosaur => dinosaur.remove());
        this.plantedDinosaurs = [];
        this.dancerCount = 0;
        
        // Also clear the tiny dancer pile for a complete fresh start
        const tinyDancers = document.querySelectorAll('[data-tiny-dancer="true"]');
        tinyDancers.forEach(dancer => dancer.remove());
        this.tinyDancerPile = []; // Reset pile tracking!
        
        // Reset to beginning of cycle for fresh start
        this.setIndex = 0;
        this.currentSet = this.setOrder[0];
        this.plantingsInCurrentSet = 0;
        this.plantingsBeforeSetChange = this.getRandomEvolutionCount();
        this.cursorDinosaur.textContent = this.getRandomDinosaur();
        
        // Reset background to starting state
        this.backgroundManager.reset();
        
        this.updateCounter();
    }

    private randomDinosaurParty(): void {
        // Plant 5 random dinosaurs at random locations
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * (window.innerWidth - 60) + 30;
            const y = Math.random() * (window.innerHeight - 60) + 30;
            setTimeout(() => {
                this.plantDinosaur(x, y);
            }, i * 100);
        }
    }

    private updateCounter(): void {
        const counterElement = document.getElementById('dancer-count');
        if (counterElement) {
            counterElement.textContent = this.dancerCount.toString();
            
            // Make the counter celebrate every placement!
            const counter = counterElement.parentElement;
            if (counter) {
                counter.classList.add('celebrating');
                setTimeout(() => {
                    counter.classList.remove('celebrating');
                }, 400);
            }
        }
    }
    
    private makeUIElementsDance(): void {
        this.backgroundManager.makeUIElementsDance(this.dancerCount);
    }

    private clearDanceFloor(): void {
        // Clear ALL dancers from the center, including dance party dancers that might be outside the radius!
        const allDancers = this.plantedDinosaurs.slice(); // Copy the array
        const edgeMargin = 50; // Distance from screen edge
        const dancerSize = 60; // Dancer elements are 60px wide/tall
        const centerRadius = Math.min(window.innerWidth, window.innerHeight) * 0.3; // Clear circle size
        
        let movedCount = 0;
        
        allDancers.forEach((dancer) => {
            const currentX = parseInt(dancer.style.left);
            const currentY = parseInt(dancer.style.top);
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Check if dancer is in the center area that needs clearing
            const distanceFromCenter = Math.sqrt(
                Math.pow(currentX - centerX, 2) + Math.pow(currentY - centerY, 2)
            );
            
            // ENHANCED: Also check for dance party dancers specifically - they should ALL be moved!
            const isDancePartyDancer = dancer.hasAttribute('data-dance-party');
            
            if (distanceFromCenter < centerRadius || isDancePartyDancer) {
                // Move this dancer to the edges
                let newX, newY;
                
                // Choose a random edge: top, right, bottom, or left
                const edge = Math.floor(Math.random() * 4);
                
                switch (edge) {
                    case 0: // Top edge
                        newX = edgeMargin + Math.random() * (window.innerWidth - 2 * edgeMargin - dancerSize);
                        newY = Math.random() * edgeMargin; // Random position closer to the actual edge
                        break;
                    case 1: // Right edge
                        newX = window.innerWidth - edgeMargin - dancerSize + Math.random() * (edgeMargin / 2);
                        newY = edgeMargin + Math.random() * (window.innerHeight - 2 * edgeMargin - dancerSize);
                        break;
                    case 2: // Bottom edge
                        newX = edgeMargin + Math.random() * (window.innerWidth - 2 * edgeMargin - dancerSize);
                        newY = window.innerHeight - edgeMargin - dancerSize + Math.random() * (edgeMargin / 2);
                        break;
                    case 3: // Left edge
                        newX = Math.random() * edgeMargin; // Random position closer to the actual edge
                        newY = edgeMargin + Math.random() * (window.innerHeight - 2 * edgeMargin - dancerSize);
                        break;
                    default:
                        newX = currentX;
                        newY = currentY;
                }
                
                // Animate the movement to the edge
                dancer.style.transition = 'left 1.5s ease-out, top 1.5s ease-out';
                dancer.style.left = newX + 'px';
                dancer.style.top = newY + 'px';
                
                // Remove the dance party markers since they're now regular edge dancers
                dancer.removeAttribute('data-dance-party');
                dancer.removeAttribute('data-musical-intensity');
                
                // Remove transition after animation completes
                setTimeout(() => {
                    dancer.style.transition = '';
                }, 1500);
                
                movedCount++;
            }
        });
        
        console.log(`🎪 Cleared the dance floor! Moved ${movedCount} dancers to the edges to make room for a solo performance!`);
    }
    
    private triggerVoiceCommandCelebration(intensity: number = 1): void {
        // 🎵 Voice commands should trigger the same magical effects as manual planting!
        
        // Evolve the background to show the party is growing
        this.evolveBackground();
        
        // Make UI elements dance with joy
        this.makeUIElementsDance();
        
        // Spawn celebration creatures (falling dancers) - more for higher intensity!
        const celebrationCount = Math.min(5 + intensity * 2, 12); // Scale with intensity
        this.spawnVoiceCelebrationCreatures(celebrationCount);
        
        // For high intensity musical parties, trigger extra background evolution
        if (intensity >= 3) {
            // Extra background evolution for really intense parties!
            setTimeout(() => {
                this.evolveBackground();
            }, 500);
        }
        
        console.log(`🎤✨ Voice celebration triggered! Intensity: ${intensity}, falling dancers: ${celebrationCount}`);
    }
    
    private spawnVoiceCelebrationCreatures(count: number): void {
        // Similar to spawnCelebrationCreatures but specifically for voice commands
        const currentEmojis = this.emojiSets[this.currentSet as keyof typeof this.emojiSets];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const creature = document.createElement('div');
                creature.className = 'dinosaur tiny-dancer';
                creature.textContent = currentEmojis[Math.floor(Math.random() * currentEmojis.length)];
                
                // Start from random positions across the top
                const startX = Math.random() * window.innerWidth;
                const startY = -50;
                
                // Find where this dancer should land in the growing pile!
                const landingSpot = this.findNextPilePosition();
                
                creature.style.left = startX + 'px';
                creature.style.top = startY + 'px';
                creature.style.fontSize = '24px'; // Tiny dancers
                creature.style.zIndex = '50'; // Below everything else
                creature.setAttribute('data-tiny-dancer', 'true');
                creature.setAttribute('data-voice-celebration', 'true'); // Mark as voice-triggered
                
                document.body.appendChild(creature);
                
                // Animate the gentle fall to the calculated pile position
                setTimeout(() => {
                    creature.style.transition = 'left 2.5s ease-out, top 2.5s ease-in';
                    creature.style.left = landingSpot.x + 'px';
                    creature.style.top = landingSpot.y + 'px';
                }, 100);
                
                // Once they land, they become part of the pile physics!
                setTimeout(() => {
                    creature.classList.add('pile-dancer');
                    creature.style.transition = 'none';
                    this.tinyDancerPile.push(creature); // Add to pile tracking!
                }, 2600);
                
            }, i * 200); // Slightly faster stagger for voice celebrations
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DinosaurDanceGame();
    
    // Add some helpful instructions
    console.log('🎨 Welcome to Dinosaur Dance Evolution - Voice-Controlled Painting Edition!');
    console.log('• Move your mouse to see the cursor creature');
    console.log('• Left click to place a single dancing creature');
    console.log('• Hold and drag to paint continuous brush strokes!');
    console.log('• Right click for an instant party (5 random creatures)!');
    console.log('• Watch the background subtly evolve with your artwork');
    console.log('🎤 VOICE COMMANDS: Sing naturally to control your art!');
    console.log('  🎵 "dance party" - Creates a formation demonstration');
    console.log('  🎵 "clear dance floor" - Moves dancers to edges for solo space');
    console.log('  🎵 "restart the party" - Clears everything for a fresh canvas');
    console.log('• Sets auto-evolve organically (6-12 plantings) for natural surprises!');
});
