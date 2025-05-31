// The magnificent dancing dinosaur game!
// A delightful collaboration between Robby and GitHub Copilot

class DinosaurDanceGame {
    private cursorDinosaur: HTMLElement;
    private plantedDinosaurs: HTMLElement[] = [];
    
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

    constructor() {
        this.plantingsBeforeSetChange = this.getRandomEvolutionCount();
        this.createCursorDinosaur();
        this.setupEventListeners();
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
    
    private spawnCelebrationCreatures(): void {
        const currentEmojis = this.emojiSets[this.currentSet as keyof typeof this.emojiSets];
        const celebrationCount = 8; // Burst of celebration creatures
        
        for (let i = 0; i < celebrationCount; i++) {
            setTimeout(() => {
                const creature = document.createElement('div');
                creature.className = 'dinosaur celebration-creature';
                creature.textContent = currentEmojis[Math.floor(Math.random() * currentEmojis.length)];
                
                // Spawn from random edges of the screen
                const edge = Math.floor(Math.random() * 4);
                let startX, startY, endX, endY;
                
                switch (edge) {
                    case 0: // Top
                        startX = Math.random() * window.innerWidth;
                        startY = -100;
                        endX = Math.random() * window.innerWidth;
                        endY = window.innerHeight / 2 + Math.random() * 200 - 100;
                        break;
                    case 1: // Right
                        startX = window.innerWidth + 100;
                        startY = Math.random() * window.innerHeight;
                        endX = window.innerWidth / 2 + Math.random() * 200 - 100;
                        endY = Math.random() * window.innerHeight;
                        break;
                    case 2: // Bottom
                        startX = Math.random() * window.innerWidth;
                        startY = window.innerHeight + 100;
                        endX = Math.random() * window.innerWidth;
                        endY = window.innerHeight / 2 + Math.random() * 200 - 100;
                        break;
                    default: // Left
                        startX = -100;
                        startY = Math.random() * window.innerHeight;
                        endX = window.innerWidth / 2 + Math.random() * 200 - 100;
                        endY = Math.random() * window.innerHeight;
                }
                
                creature.style.left = startX + 'px';
                creature.style.top = startY + 'px';
                document.body.appendChild(creature);
                
                // Animate movement across the canvas
                setTimeout(() => {
                    creature.style.transition = 'left 3s ease-out, top 3s ease-out';
                    creature.style.left = endX + 'px';
                    creature.style.top = endY + 'px';
                }, 50);
                
                // Remove after animation completes
                setTimeout(() => {
                    creature.remove();
                }, 4000);
                
            }, i * 200); // Stagger the spawning
        }
    }
    
    private showCurrentSetInfo(): void {
        // Show set info through dancing demonstration creatures!
        this.demonstrateCurrentSet();
    }
    
    private demonstrateCurrentSet(): void {
        const currentEmojis = this.emojiSets[this.currentSet as keyof typeof this.emojiSets];
        const demoCount = Math.min(5, currentEmojis.length); // Show up to 5 examples
        
        for (let i = 0; i < demoCount; i++) {
            setTimeout(() => {
                const demoCreature = document.createElement('div');
                demoCreature.className = 'dinosaur';
                demoCreature.textContent = currentEmojis[i];
                
                // Arrange in a gentle arc across the middle of the screen
                const arcWidth = Math.min(400, window.innerWidth * 0.6);
                const startX = (window.innerWidth - arcWidth) / 2;
                const x = startX + (arcWidth / (demoCount - 1)) * i;
                const y = window.innerHeight / 2 + Math.sin((i / (demoCount - 1)) * Math.PI) * 50;
                
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

    private removeDinosaur(dinosaur: HTMLElement): void {
        const index = this.plantedDinosaurs.indexOf(dinosaur);
        if (index > -1) {
            this.plantedDinosaurs.splice(index, 1);
            dinosaur.remove();
            this.dancerCount--;
            this.updateCounter();
        }
    }

    private clearAllDinosaurs(): void {
        this.plantedDinosaurs.forEach(dinosaur => dinosaur.remove());
        this.plantedDinosaurs = [];
        this.dancerCount = 0;
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
