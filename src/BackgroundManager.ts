// Background evolution and visual effects
export class BackgroundManager {
    private backgroundHue: number = 200; // Starting blue-green

    public evolve(dancerCount: number): void {
        // Much more gentle evolution - only shift every 10 placements for contemplative progression
        if (dancerCount % 10 === 0) {
            this.backgroundHue = (this.backgroundHue + 5) % 360;
        }
        
        // Very subtle saturation and lightness changes
        const saturation = 25 + Math.floor(dancerCount / 20); // Increases every 20 creatures
        const lightness = 88 - Math.floor(dancerCount / 30); // Decreases every 30 creatures
        
        // Smooth transition with CSS
        document.body.style.transition = 'background 2s ease';
        document.body.style.background = `linear-gradient(135deg, 
            hsl(${this.backgroundHue}, ${Math.min(saturation, 40)}%, ${Math.max(lightness, 75)}%), 
            hsl(${(this.backgroundHue + 25) % 360}, ${Math.min(saturation + 8, 45)}%, ${Math.max(lightness + 3, 78)}%))`;
    }

    public reset(): void {
        this.backgroundHue = 200;
        this.evolve(0);
    }

    public makeUIElementsDance(dancerCount: number): void {
        // Make the title dance occasionally (every 15 creatures)
        if (dancerCount % 15 === 0 && dancerCount > 0) {
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
