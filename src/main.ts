// The magnificent dancing dinosaur game!
// A delightful collaboration between Robby and GitHub Copilot

class DinosaurDanceGame {
    private cursorDinosaur: HTMLElement;
    private plantedDinosaurs: HTMLElement[] = [];
    private dinosaurEmojis = [
        '🦕', '🦴', '🐊', '🐲', '🦖', '🐉', '🦎', '🐍', 
        '🐢', '🦂', '🕷️', '🦟', '🐛', '🦋', '🐜', '🐝',
        '🐞', '🦗', '🐨', '🐼', '🦘', '🦥', '🦦', '🦨',
        '🦔', '🐿️', '🐹', '🐭', '🐰', '🦊', '🐺', '🐻',
        '🐯', '🦁', '🐸', '🐙', '🦑', '🦐', '🦀', '🐡',
        '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐚', '⭐',
        '🌟', '✨', '💫', '🔥', '❄️', '☄️', '🌈', '🎪'
    ];
    private dancerCount = 0;

    constructor() {
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
        return this.dinosaurEmojis[Math.floor(Math.random() * this.dinosaurEmojis.length)];
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
        
        // Add click to remove functionality
        plantedDinosaur.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeDinosaur(plantedDinosaur);
        });

        document.body.appendChild(plantedDinosaur);
        this.plantedDinosaurs.push(plantedDinosaur);
        this.dancerCount++;
        this.updateCounter();

        // NOW change cursor dinosaur to a new random one for next planting
        this.cursorDinosaur.textContent = this.getRandomDinosaur();

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
    console.log('🦕 Welcome to Dinosaur Dance!');
    console.log('• Move your mouse to see the cursor creature');
    console.log('• Left click anywhere to plant a dancing creature');
    console.log('• Right click for an instant party (5 random creatures)!');
    console.log('• Click on planted creatures to remove them');
    console.log('• Press "C" to clear all creatures');
    console.log('• Press "R" for a random creature party!');
});
