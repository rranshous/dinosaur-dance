// Dance party formation generator with organic, joyful celebrations
export class DancePartyManager {
    private emojiSets: any;
    private currentSet: string;
    private plantedDinosaurs: HTMLElement[];
    private updateDancerCountCallback: () => void;

    constructor(emojiSets: any, currentSet: string, plantedDinosaurs: HTMLElement[], updateDancerCountCallback: () => void) {
        this.emojiSets = emojiSets;
        this.currentSet = currentSet;
        this.plantedDinosaurs = plantedDinosaurs;
        this.updateDancerCountCallback = updateDancerCountCallback;
    }

    public createDanceParty(intensity: number = 1): void {
        if (intensity > 1) {
            this.createMusicalDanceParty(intensity);
        } else {
            this.createStandardDanceParty();
        }
    }

    private createStandardDanceParty(): void {
        const currentEmojis = this.emojiSets[this.currentSet as keyof typeof this.emojiSets];
        const demoCount = Math.min(5, currentEmojis.length);
        
        // Choose a random formation for variety!
        const formations = ['arc', 'circle', 'line', 'random', 'spiral', 'wave', 'diamond', 'heart', 'star', 'zigzag'];
        const formation = formations[Math.floor(Math.random() * formations.length)];
        
        this.spawnDancers(currentEmojis, demoCount, formation, 1);
        console.log(`🎪 Dance party formation: ${formation}! Each one is a surprise!`);
    }

    private createMusicalDanceParty(intensity: number): void {
        // 🎵 BIGGER, MORE JOYFUL PARTIES! Keep the organic feel but AMPLIFY it!
        const currentEmojis = this.emojiSets[this.currentSet as keyof typeof this.emojiSets];
        const baseCount = Math.min(5, currentEmojis.length);
        
        // More dancers, but keep them BIG and celebratory!
        const scaledCount = Math.min(baseCount + (intensity - 1) * 3, 12); // More modest scaling but still bigger
        
        console.log(`🎵🎪 MUSICAL DANCE PARTY! Intensity ${intensity}x = ${scaledCount} dancers!`);
        
        // Prefer the most celebratory formations for intense parties!
        const formations = ['arc', 'circle', 'line', 'random', 'spiral', 'wave', 'diamond', 'heart', 'star', 'zigzag'];
        const intensityFormations = intensity >= 4 ? ['heart', 'star', 'spiral', 'circle'] : 
                                   intensity >= 3 ? ['diamond', 'heart', 'star', 'wave', 'circle'] : formations;
        const formation = intensityFormations[Math.floor(Math.random() * intensityFormations.length)];
        
        // Keep dancers BIG and joyful - no tiny dancers for musical parties!
        this.spawnDancers(currentEmojis, scaledCount, formation, intensity, true);
    }

    private spawnDancers(emojis: string[], count: number, formation: string, intensity: number = 1, isMusical: boolean = false): void {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const demoCreature = document.createElement('div');
                demoCreature.className = 'dinosaur';
                demoCreature.textContent = emojis[i % emojis.length];
                
                const position = this.calculatePosition(i, count, formation, intensity);
                
                demoCreature.style.left = position.x + 'px';
                demoCreature.style.top = position.y + 'px';
                
                // Keep dancers BIG for musical parties! Even BIGGER for intensity!
                const fontSize = isMusical ? Math.min(80 + intensity * 10, 120) : 80;
                demoCreature.style.fontSize = fontSize + 'px';
                demoCreature.style.zIndex = '500';
                
                // More energetic animation for musical parties!
                const animationSpeed = isMusical ? Math.max(0.3, 0.8 - intensity * 0.1) : 0.8;
                demoCreature.style.animation = `dance ${animationSpeed}s infinite alternate ease-in-out`;
                
                document.body.appendChild(demoCreature);
                
                // Mark appropriately
                demoCreature.setAttribute('data-dance-party', 'true');
                if (isMusical) {
                    demoCreature.setAttribute('data-musical-intensity', intensity.toString());
                }
                
                this.plantedDinosaurs.push(demoCreature);
                this.updateDancerCountCallback();
                
            }, i * (isMusical ? Math.max(80, 200 - count * 10) : 150)); // Faster for musical parties
        }
    }

    private calculatePosition(index: number, totalCount: number, formation: string, intensity: number): {x: number, y: number} {
        let x, y;
        
        // Scale formations organically - bigger but not rigid!
        const formationScale = Math.min(1 + intensity * 0.2, 1.8); // More gentle scaling
        const jitter = 20 + intensity * 10; // More organic randomness for intense parties
        
        switch (formation) {
            case 'arc':
                const arcWidth = Math.min(400 * formationScale, window.innerWidth * 0.8);
                const startX = (window.innerWidth - arcWidth) / 2;
                x = startX + (arcWidth / (totalCount - 1)) * index;
                y = window.innerHeight / 2 + Math.sin((index / (totalCount - 1)) * Math.PI) * 60 * formationScale;
                // Add organic jitter
                x += (Math.random() - 0.5) * jitter;
                y += (Math.random() - 0.5) * jitter;
                break;
                
            case 'circle':
                const radius = 120 * formationScale;
                const angle = (index / totalCount) * Math.PI * 2;
                x = window.innerWidth / 2 + Math.cos(angle) * radius;
                y = window.innerHeight / 2 + Math.sin(angle) * radius;
                // Add organic jitter
                x += (Math.random() - 0.5) * jitter;
                y += (Math.random() - 0.5) * jitter;
                break;
                
            case 'spiral':
                const spiralAngle = (index / totalCount) * Math.PI * (3 + intensity); // More spirals for intensity
                const spiralRadius = 40 + index * (20 * formationScale);
                x = window.innerWidth / 2 + Math.cos(spiralAngle) * spiralRadius;
                y = window.innerHeight / 2 + Math.sin(spiralAngle) * spiralRadius;
                break;
                
            case 'heart':
                const heartT = (index / (totalCount - 1)) * Math.PI * 2;
                const heartScale = 70 * formationScale;
                x = window.innerWidth / 2 + heartScale * (16 * Math.sin(heartT) ** 3) / 16;
                y = window.innerHeight / 2 - heartScale * (13 * Math.cos(heartT) - 5 * Math.cos(2 * heartT) - 2 * Math.cos(3 * heartT) - Math.cos(4 * heartT)) / 16;
                // Add jitter to make it more organic
                x += (Math.random() - 0.5) * jitter;
                y += (Math.random() - 0.5) * jitter;
                break;
                
            case 'star':
                const starRadius = 130 * formationScale;
                const starAngle = (index / totalCount) * Math.PI * 2;
                const isOuterPoint = index % 2 === 0;
                const currentRadius = isOuterPoint ? starRadius : starRadius * 0.6;
                x = window.innerWidth / 2 + Math.cos(starAngle) * currentRadius;
                y = window.innerHeight / 2 + Math.sin(starAngle) * currentRadius;
                // Add jitter
                x += (Math.random() - 0.5) * jitter;
                y += (Math.random() - 0.5) * jitter;
                break;
                
            case 'wave':
                const waveWidth = Math.min(500 * formationScale, window.innerWidth * 0.8);
                const waveStartX = (window.innerWidth - waveWidth) / 2;
                x = waveStartX + (waveWidth / (totalCount - 1)) * index;
                y = window.innerHeight / 2 + Math.sin((index / (totalCount - 1)) * Math.PI * 2) * 80 * formationScale;
                // Add jitter
                x += (Math.random() - 0.5) * jitter;
                y += (Math.random() - 0.5) * jitter;
                break;
                
            default: // random, line, diamond, zigzag - keep them organic and spread out
                // Instead of rigid grid, use organic clustering
                const clusterRadius = 150 * formationScale;
                const clusterAngle = (index / totalCount) * Math.PI * 2 + Math.random() * 0.5;
                const clusterDistance = Math.random() * clusterRadius;
                x = window.innerWidth / 2 + Math.cos(clusterAngle) * clusterDistance;
                y = window.innerHeight / 2 + Math.sin(clusterAngle) * clusterDistance;
                // Extra jitter for random formation
                x += (Math.random() - 0.5) * jitter * 2;
                y += (Math.random() - 0.5) * jitter * 2;
                break;
        }
        
        // Ensure positions stay on screen
        x = Math.max(50, Math.min(x, window.innerWidth - 100));
        y = Math.max(50, Math.min(y, window.innerHeight - 100));
        
        return { x, y };
    }
}
