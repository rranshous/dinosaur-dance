// The magnificent dancing dinosaur game!
// A delightful collaboration between Robby and GitHub Copilot

// TypeScript declarations for Speech Recognition API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export {}; // Make this file a module

class DinosaurDanceGame {
    private cursorDinosaur!: HTMLElement; // Will be initialized in createCursorDinosaur
    private plantedDinosaurs: HTMLElement[] = [];
    private tinyDancerPile: HTMLElement[] = []; // Track the pile for physics!
    
    // Painting mode for continuous brush strokes!
    private isMouseDown: boolean = false;
    private lastPlantTime: number = 0;
    private brushDelay: number = 100; // milliseconds between brush strokes
    
    // Background evolution with the artwork
    private backgroundHue: number = 200; // Starting blue-green
    
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

    // Voice recognition for delightful voice commands!
    private recognition: any = null;
    private isListening: boolean = false;

    constructor() {
        this.plantingsBeforeSetChange = this.getRandomEvolutionCount();
        this.createCursorDinosaur();
        this.setupEventListeners();
        this.setupVoiceRecognition(); // Add voice magic!
        this.updateCounter();
        this.evolveBackground(); // Initialize the beautiful background
    }

    private createCursorDinosaur(): void {
        this.cursorDinosaur = document.createElement('div');
        this.cursorDinosaur.className = 'dinosaur cursor-dinosaur';
        this.cursorDinosaur.textContent = this.getRandomDinosaur();
        document.body.appendChild(this.cursorDinosaur);
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
        // Much more gentle evolution - only shift every 10 placements for contemplative progression
        if (this.dancerCount % 10 === 0) {
            this.backgroundHue = (this.backgroundHue + 5) % 360;
        }
        
        // Very subtle saturation and lightness changes
        const saturation = 25 + Math.floor(this.dancerCount / 20); // Increases every 20 creatures
        const lightness = 88 - Math.floor(this.dancerCount / 30); // Decreases every 30 creatures
        
        // Smooth transition with CSS
        document.body.style.transition = 'background 2s ease';
        document.body.style.background = `linear-gradient(135deg, 
            hsl(${this.backgroundHue}, ${Math.min(saturation, 40)}%, ${Math.max(lightness, 75)}%), 
            hsl(${(this.backgroundHue + 25) % 360}, ${Math.min(saturation + 8, 45)}%, ${Math.max(lightness + 3, 78)}%))`;
    }
    
    private evolveToNextSet(): void {
        this.setIndex = (this.setIndex + 1) % this.setOrder.length;
        this.currentSet = this.setOrder[this.setIndex];
        this.plantingsInCurrentSet = 0;
        
        // Set new random evolution count for organic unpredictability
        this.plantingsBeforeSetChange = this.getRandomEvolutionCount();
        
        // Update cursor to new set immediately for preview
        this.cursorDinosaur.textContent = this.getRandomDinosaur();
        
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
    
    private showCurrentSetInfo(): void {
        // Show set info through dancing demonstration creatures!
        this.demonstrateCurrentSet();
    }
    
    private demonstrateCurrentSet(): void {
        const currentEmojis = this.emojiSets[this.currentSet as keyof typeof this.emojiSets];
        const demoCount = Math.min(5, currentEmojis.length); // Show up to 5 examples
        
        // Choose a random formation for each dance party! Even MORE variety!
        const formations = ['arc', 'circle', 'line', 'random', 'spiral', 'wave', 'diamond', 'heart', 'star', 'zigzag'];
        const formation = formations[Math.floor(Math.random() * formations.length)];
        
        for (let i = 0; i < demoCount; i++) {
            setTimeout(() => {
                const demoCreature = document.createElement('div');
                demoCreature.className = 'dinosaur';
                demoCreature.textContent = currentEmojis[i];
                
                let x, y;
                
                // Different formations for variety!
                switch (formation) {
                    case 'arc':
                        // Original arc formation but with random vertical offset
                        const arcWidth = Math.min(400, window.innerWidth * 0.6);
                        const startX = (window.innerWidth - arcWidth) / 2;
                        x = startX + (arcWidth / (demoCount - 1)) * i;
                        y = window.innerHeight / 2 + Math.sin((i / (demoCount - 1)) * Math.PI) * 50 + (Math.random() - 0.5) * 100;
                        break;
                        
                    case 'circle':
                        // Circular formation
                        const radius = 120;
                        const angle = (i / demoCount) * Math.PI * 2;
                        x = window.innerWidth / 2 + Math.cos(angle) * radius;
                        y = window.innerHeight / 2 + Math.sin(angle) * radius;
                        break;
                        
                    case 'line':
                        // Horizontal line with random vertical wobble
                        const lineWidth = Math.min(500, window.innerWidth * 0.8);
                        const lineStartX = (window.innerWidth - lineWidth) / 2;
                        x = lineStartX + (lineWidth / (demoCount - 1)) * i;
                        y = window.innerHeight / 2 + (Math.random() - 0.5) * 60;
                        break;
                        
                    case 'spiral':
                        // Spiral formation
                        const spiralAngle = (i / demoCount) * Math.PI * 3;
                        const spiralRadius = 40 + i * 20;
                        x = window.innerWidth / 2 + Math.cos(spiralAngle) * spiralRadius;
                        y = window.innerHeight / 2 + Math.sin(spiralAngle) * spiralRadius;
                        break;
                        
                    case 'wave':
                        // Sine wave formation
                        const waveWidth = Math.min(500, window.innerWidth * 0.8);
                        const waveStartX = (window.innerWidth - waveWidth) / 2;
                        x = waveStartX + (waveWidth / (demoCount - 1)) * i;
                        y = window.innerHeight / 2 + Math.sin((i / (demoCount - 1)) * Math.PI * 2) * 80;
                        break;
                        
                    case 'diamond':
                        // Diamond/rhombus formation
                        if (i < demoCount / 2) {
                            // Top half of diamond
                            x = window.innerWidth / 2 + (i - demoCount / 4) * 60;
                            y = window.innerHeight / 2 - (demoCount / 4 - Math.abs(i - demoCount / 4)) * 40;
                        } else {
                            // Bottom half of diamond
                            const bottomI = i - Math.floor(demoCount / 2);
                            x = window.innerWidth / 2 + (bottomI - demoCount / 4) * 60;
                            y = window.innerHeight / 2 + (demoCount / 4 - Math.abs(bottomI - demoCount / 4)) * 40;
                        }
                        break;
                        
                    case 'heart':
                        // Heart shape formation (simplified)
                        const heartT = (i / (demoCount - 1)) * Math.PI * 2;
                        const heartScale = 60;
                        x = window.innerWidth / 2 + heartScale * (16 * Math.sin(heartT) ** 3) / 16;
                        y = window.innerHeight / 2 - heartScale * (13 * Math.cos(heartT) - 5 * Math.cos(2 * heartT) - 2 * Math.cos(3 * heartT) - Math.cos(4 * heartT)) / 16;
                        break;
                        
                    case 'star':
                        // Star formation
                        const starRadius = 120;
                        const starAngle = (i / demoCount) * Math.PI * 2;
                        const isOuterPoint = i % 2 === 0;
                        const currentRadius = isOuterPoint ? starRadius : starRadius * 0.5;
                        x = window.innerWidth / 2 + Math.cos(starAngle) * currentRadius;
                        y = window.innerHeight / 2 + Math.sin(starAngle) * currentRadius;
                        break;
                        
                    case 'zigzag':
                        // Zigzag formation
                        const zigzagWidth = Math.min(400, window.innerWidth * 0.6);
                        const zigzagStartX = (window.innerWidth - zigzagWidth) / 2;
                        x = zigzagStartX + (zigzagWidth / (demoCount - 1)) * i;
                        y = window.innerHeight / 2 + (i % 2 === 0 ? -60 : 60) + (Math.random() - 0.5) * 30;
                        break;
                        
                    default: // 'random'
                        // Completely random positions in the center area
                        x = window.innerWidth * 0.2 + Math.random() * window.innerWidth * 0.6;
                        y = window.innerHeight * 0.3 + Math.random() * window.innerHeight * 0.4;
                        break;
                }
                
                demoCreature.style.left = x + 'px';
                demoCreature.style.top = y + 'px';
                demoCreature.style.fontSize = '80px';
                demoCreature.style.zIndex = '500';
                demoCreature.style.animation = 'dance 0.8s infinite alternate ease-in-out';
                
                document.body.appendChild(demoCreature);
                
                // Remove after a graceful demonstration
                setTimeout(() => {
                    demoCreature.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
                    demoCreature.style.opacity = '0';
                    demoCreature.style.transform = 'scale(0.5)';
                    setTimeout(() => {
                        demoCreature.remove();
                    }, 1000);
                }, 2000);
                
            }, i * 150); // Stagger the appearance
        }
        
        console.log(`🎪 Dance party formation: ${formation}! Each one is a surprise!`);
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

        // Add keyboard shortcuts for fun!
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'c':
                    this.clearAllDinosaurs();
                    break;
                case 'r':
                    this.randomDinosaurParty();
                    break;
                case 'n':
                    this.evolveToNextSet();
                    break;
                case 's':
                    this.showCurrentSetInfo();
                    break;
            }
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
        this.backgroundHue = 200;
        this.evolveBackground();
        
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
        // Make the title dance occasionally (every 15 creatures)
        if (this.dancerCount % 15 === 0 && this.dancerCount > 0) {
            const title = document.querySelector('.title');
            if (title) {
                title.classList.add('dancing');
                setTimeout(() => {
                    title.classList.remove('dancing');
                }, 500);
            }
        }
    }

    private setupVoiceRecognition(): void {
        // Check for browser compatibility
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('🎤 Speech recognition not supported in this browser.');
            return;
        }
        
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true; // Keep listening!
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = 'en-US';
        
        // Define the commands and their corresponding actions
        // Order matters! Longer phrases should come first to avoid partial matches
        const commands: { [key: string]: () => void } = {
            'dance party': () => {
                console.log('🎤 Voice command: Dance party demonstration!');
                this.showCurrentSetInfo();
            },
            'stop listening': () => {
                console.log('🎤 Voice command: Stop listening!');
                this.stopListening();
            },
            'start listening': () => {
                console.log('🎤 Voice command: Start listening!');
                this.startListening();
            },
            'clear': () => {
                console.log('🎤 Voice command: Clear all!');
                this.clearAllDinosaurs();
            },
            'party': () => {
                console.log('🎤 Voice command: Party time!');
                this.randomDinosaurParty();
            },
            'next': () => {
                console.log('🎤 Voice command: Next set!');
                this.evolveToNextSet();
            }
        };
        
        this.recognition.onresult = (event: any) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            console.log('🎤 Voice input:', transcript);
            
            // Check if the transcript matches any command
            for (const command in commands) {
                if (transcript.includes(command)) {
                    commands[command]();
                    break;
                }
            }
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceIndicator(false);
            console.log('🎤 Voice recognition stopped.');
            // Auto-restart unless explicitly stopped
            setTimeout(() => {
                if (!this.isListening) {
                    this.startListening();
                }
            }, 1000);
        };
        
        this.recognition.onerror = (event: any) => {
            console.warn('🎤 Voice recognition error:', event.error);
            this.updateVoiceIndicator(false);
            if (event.error === 'not-allowed') {
                console.warn('🎤 Microphone access denied. Voice commands disabled.');
                return;
            }
            // Try to restart on other errors
            setTimeout(() => {
                if (!this.isListening) {
                    this.startListening();
                }
            }, 2000);
        };
        
        // Start listening for voice commands
        console.log('🎤 Setting up voice recognition...');
        this.startListening();
    }

    private startListening(): void {
        if (this.recognition && !this.isListening) {
            try {
                this.isListening = true;
                this.recognition.start();
                console.log('🎤 Voice recognition started! Try saying: "clear", "party", "next", or "dance party"');
                this.updateVoiceIndicator(true);
            } catch (error) {
                console.warn('🎤 Failed to start voice recognition:', error);
                this.isListening = false;
                this.updateVoiceIndicator(false);
            }
        }
    }

    private stopListening(): void {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            console.log('🎤 Voice recognition stopped by user command.');
            this.updateVoiceIndicator(false);
        }
    }

    private updateVoiceIndicator(listening: boolean): void {
        const indicator = document.getElementById('voice-indicator');
        if (indicator) {
            if (listening) {
                indicator.classList.add('listening');
            } else {
                indicator.classList.remove('listening');
            }
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DinosaurDanceGame();
    
    // Add some helpful instructions
    console.log('🎨 Welcome to Dinosaur Dance Evolution - Painting Edition!');
    console.log('• Move your mouse to see the cursor creature');
    console.log('• Left click to place a single dancing creature');
    console.log('• Hold and drag to paint continuous brush strokes!');
    console.log('• Right click for an instant party (5 random creatures)!');
    console.log('• Watch the background subtly evolve with your artwork');
    console.log('• Press "C" to clear all creatures and reset canvas');
    console.log('• Press "R" for a random creature party!');
    console.log('• Press "N" to evolve to the next thematic set');
    console.log('• Press "S" to see current set info');
    console.log('• Sets auto-evolve organically (6-12 plantings) for natural surprises!');
});
