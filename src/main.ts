// The magnificent dancing dinosaur game!
// A delightful collaboration between Robby and GitHub Copilot

class DinosaurDanceGame {
    private cursorDinosaur: HTMLElement;
    private plantedDinosaurs: HTMLElement[] = [];
    
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
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 248, 255, 0.95));
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1.4em;
            color: #4A4A4A;
            z-index: 2000;
            pointer-events: none;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            border: 2px solid rgba(100, 150, 200, 0.3);
            animation: celebrateEvolution 3s ease-out;
        `;
        notification.textContent = `🎉 Now featuring: ${this.currentSet.charAt(0).toUpperCase() + this.currentSet.slice(1)}! 🎉`;
        
        // Add CSS animation for the celebration
        const style = document.createElement('style');
        style.textContent = `
            @keyframes celebrateEvolution {
                0% { transform: translateX(-50%) scale(0.5) rotate(-5deg); opacity: 0; }
                20% { transform: translateX(-50%) scale(1.1) rotate(2deg); opacity: 1; }
                40% { transform: translateX(-50%) scale(0.95) rotate(-1deg); }
                60% { transform: translateX(-50%) scale(1.05) rotate(1deg); }
                80% { transform: translateX(-50%) scale(1) rotate(0deg); }
                100% { transform: translateX(-50%) scale(1) rotate(0deg); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }
    
    private showCurrentSetInfo(): void {
        const currentEmojis = this.emojiSets[this.currentSet as keyof typeof this.emojiSets];
        const info = document.createElement('div');
        info.style.cssText = `
            position: fixed;
            top: 160px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 1.1em;
            color: #4A4A4A;
            z-index: 2000;
            pointer-events: none;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 300px;
        `;
        info.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">${this.currentSet.charAt(0).toUpperCase() + this.currentSet.slice(1)} Set</div>
            <div style="font-size: 1.5em; margin: 5px 0;">${currentEmojis.join(' ')}</div>
            <div style="font-size: 0.9em;">${this.plantingsInCurrentSet}/${this.plantingsBeforeSetChange} planted</div>
        `;
        document.body.appendChild(info);
        
        setTimeout(() => {
            info.remove();
        }, 3000);
    }

    private setupEventListeners(): void {
        // Follow the mouse cursor
        document.addEventListener('mousemove', (e) => {
            this.cursorDinosaur.style.left = `${e.clientX - 30}px`;
            this.cursorDinosaur.style.top = `${e.clientY - 30}px`;
        });

        // Plant dinosaur on click
        document.addEventListener('click', (e) => {
            this.plantDinosaur(e.clientX, e.clientY);
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
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DinosaurDanceGame();
    
    // Add some helpful instructions
    console.log('🦕 Welcome to Dinosaur Dance Evolution!');
    console.log('• Move your mouse to see the cursor creature');
    console.log('• Left click anywhere to plant a dancing creature (stickers stay forever!)');
    console.log('• Right click for an instant party (5 random creatures)!');
    console.log('• Press "C" to clear all creatures and start fresh');
    console.log('• Press "R" for a random creature party!');
    console.log('• Press "N" to evolve to the next thematic set');
    console.log('• Press "S" to see current set info');
    console.log('• Sets auto-evolve organically (6-12 plantings) for natural surprises!');
});
