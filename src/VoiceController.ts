// Voice recognition controller for natural singing commands
export class VoiceController {
    private recognition: any = null;
    private isListening: boolean = false;
    private onCommandCallback: (command: string, transcript: string) => void;

    constructor(onCommand: (command: string, transcript: string) => void) {
        this.onCommandCallback = onCommand;
        this.setupVoiceRecognition();
    }

    private setupVoiceRecognition(): void {
        // Check for browser compatibility
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('🎤 Speech recognition not supported in this browser.');
            return;
        }
        
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = 'en-US';
        
        this.recognition.onresult = (event: any) => {
            const originalTranscript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            
            // Clean transcript by removing common articles and filler words
            const cleanedTranscript = originalTranscript
                .replace(/\b(the|a|an|please|can|you|could|would)\b/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            
            console.log('🎤 Voice input:', originalTranscript, '-> cleaned:', cleanedTranscript);
            
            // 🌟 ENHANCED: Parse multiple commands from a single transcript!
            this.parseAndExecuteMultipleCommands(originalTranscript, cleanedTranscript);
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
                console.log('🎤 Voice recognition started! Try singing: "dance party", "clear dance floor", or "restart the party"');
                this.updateVoiceIndicator(true);
            } catch (error) {
                console.warn('🎤 Failed to start voice recognition:', error);
                this.isListening = false;
                this.updateVoiceIndicator(false);
            }
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

    private parseAndExecuteMultipleCommands(originalTranscript: string, cleanedTranscript: string): void {
        // 🌟 MULTIPLE COMMAND PARSING: Handle rapid-fire voice commands!
        const commands = ['clear dance floor', 'dance party', 'restart the party'];
        const executedCommands: string[] = [];
        
        // 🎵 FIRST: Check for musical intensity (multiple "dance" + "party")
        const danceMatches = (originalTranscript.match(/dance/g) || []).length;
        const partyMatches = (originalTranscript.match(/party/g) || []).length;
        
        if (danceMatches >= 2 && partyMatches >= 1) {
            const intensity = Math.min(danceMatches, 5);
            console.log(`🎤 🎵 MUSICAL INTENSITY DETECTED! ${danceMatches} dances = ${intensity}x party!`);
            this.onCommandCallback('musical_dance_party', originalTranscript);
            executedCommands.push(`musical_dance_party (${intensity}x)`);
        }
        
        // 🔄 THEN: Look for multiple distinct commands in the transcript
        // Sort by length to match longer commands first (avoid partial matches)
        const sortedCommands = commands.sort((a, b) => b.length - a.length);
        
        for (const command of sortedCommands) {
            // Count how many times this command appears in the transcript
            const commandInstances = this.countCommandInstances(originalTranscript, cleanedTranscript, command);
            
            if (commandInstances > 0) {
                // Execute this command the number of times it was detected
                for (let i = 0; i < commandInstances; i++) {
                    setTimeout(() => {
                        this.onCommandCallback(command, originalTranscript);
                    }, i * 150); // Small delay between commands for natural execution
                }
                executedCommands.push(`${command} (${commandInstances}x)`);
            }
        }
        
        if (executedCommands.length > 0) {
            console.log(`🎤 ✨ MULTI-COMMAND EXECUTION: ${executedCommands.join(', ')}`);
        } else {
            console.log('🎤 No recognized commands found in transcript');
        }
    }

    private countCommandInstances(originalTranscript: string, cleanedTranscript: string, command: string): number {
        // Count explicit mentions of the command
        let count = 0;
        
        // Method 1: Count direct mentions in original transcript
        const originalMatches = (originalTranscript.match(new RegExp(command.replace(/\s+/g, '\\s+'), 'g')) || []).length;
        count += originalMatches;
        
        // Method 2: Count mentions in cleaned transcript (but don't double-count)
        const cleanedMatches = (cleanedTranscript.match(new RegExp(command.replace(/\s+/g, '\\s+'), 'g')) || []).length;
        if (cleanedMatches > originalMatches) {
            count += cleanedMatches - originalMatches;
        }
        
        // Method 3: Special handling for repeated keywords
        if (command === 'dance party') {
            // Count instances of "dance party", "party dance", or just repeated "dance" near "party"
            const danceCount = (originalTranscript.match(/\bdance\b/g) || []).length;
            const partyCount = (originalTranscript.match(/\bparty\b/g) || []).length;
            
            // If we have multiple dances and parties, that's multiple dance party commands
            if (danceCount > 1 && partyCount > 0) {
                count = Math.max(count, Math.min(danceCount, partyCount));
            }
        }
        
        return count;
    }

    public getDanceIntensity(transcript: string): number {
        const danceMatches = (transcript.match(/dance/g) || []).length;
        return Math.min(danceMatches, 5);
    }
}
