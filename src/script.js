import { Boid } from './boid.js';
import { config, themes } from './config.js';

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Create boids
let boids = [];
function initBoids() {
    boids = [];
    for (let i = 0; i < config.numBoids; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        boids.push(new Boid(x, y));
    }
}
initBoids();

// UI Controls
const separationSlider = document.getElementById('separation');
const alignmentSlider = document.getElementById('alignment');
const cohesionSlider = document.getElementById('cohesion');
const speedSlider = document.getElementById('speed');
const trailLengthSlider = document.getElementById('trailLength');
const numBoidsSlider = document.getElementById('numBoids');
const themeSelector = document.getElementById('theme');
const separationValue = document.getElementById('separationValue');
const alignmentValue = document.getElementById('alignmentValue');
const cohesionValue = document.getElementById('cohesionValue');
const speedValue = document.getElementById('speedValue');
const trailLengthValue = document.getElementById('trailLengthValue');
const numBoidsValue = document.getElementById('numBoidsValue');
const controls = document.querySelector('.controls');
const toggleControls = document.querySelector('.toggle-controls');

// Apply current theme
function applyTheme(themeName) {
    const theme = themes[themeName];
    config.boidColor = theme.boidColor;
    config.trailColor = theme.trailColor;
    config.backgroundColor = theme.backgroundColor;
    
    document.body.style.backgroundColor = theme.backgroundColor;
    controls.style.backgroundColor = theme.controlsBg;
    
    // Recreate boids to apply new colors
    initBoids();
}

// Initialize UI values
separationSlider.value = config.separationForce;
alignmentSlider.value = config.alignmentForce;
cohesionSlider.value = config.cohesionForce;
speedSlider.value = config.maxSpeed;
trailLengthSlider.value = config.trailLength;
numBoidsSlider.value = config.numBoids;
themeSelector.value = config.currentTheme;

separationValue.textContent = config.separationForce.toFixed(1);
alignmentValue.textContent = config.alignmentForce.toFixed(1);
cohesionValue.textContent = config.cohesionForce.toFixed(1);
speedValue.textContent = config.maxSpeed.toFixed(1);
trailLengthValue.textContent = config.trailLength;
numBoidsValue.textContent = config.numBoids;

// Setup event listeners
separationSlider.addEventListener('input', () => {
    config.separationForce = parseFloat(separationSlider.value);
    separationValue.textContent = parseFloat(separationSlider.value).toFixed(1);
});

document.getElementById('flockingHeader').addEventListener('click', function() {
    const content = document.getElementById('flockingContent');
    content.classList.toggle('open');
    this.querySelector('.collapsible-icon').classList.toggle('open');
});

alignmentSlider.addEventListener('input', () => {
    config.alignmentForce = parseFloat(alignmentSlider.value);
    alignmentValue.textContent = parseFloat(alignmentSlider.value).toFixed(1);
});

cohesionSlider.addEventListener('input', () => {
    config.cohesionForce = parseFloat(cohesionSlider.value);
    cohesionValue.textContent = parseFloat(cohesionSlider.value).toFixed(1);
});

speedSlider.addEventListener('input', () => {
    config.maxSpeed = parseFloat(speedSlider.value);
    config.minSpeed = config.maxSpeed * 0.5;
    speedValue.textContent = parseFloat(speedSlider.value).toFixed(1);
});

trailLengthSlider.addEventListener('input', () => {
    config.trailLength = parseInt(trailLengthSlider.value);
    trailLengthValue.textContent = trailLengthSlider.value;
    
    // Update trail length on boids
    boids.forEach(boid => {
        boid.maxHistoryLength = config.trailLength;
        // Trim history if needed
        if (boid.history.length > config.trailLength) {
            boid.history = boid.history.slice(boid.history.length - config.trailLength);
        }
    });
});

numBoidsSlider.addEventListener('input', () => {
    config.numBoids = parseInt(numBoidsSlider.value);
    numBoidsValue.textContent = numBoidsSlider.value;
    
    // Add or remove boids as needed
    const currentCount = boids.length;
    if (currentCount < config.numBoids) {
        for (let i = 0; i < config.numBoids - currentCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            boids.push(new Boid(x, y));
        }
    } else if (currentCount > config.numBoids) {
        boids = boids.slice(0, config.numBoids);
    }
});

themeSelector.addEventListener('change', () => {
    const selectedTheme = themeSelector.value;
    config.currentTheme = selectedTheme;
    applyTheme(selectedTheme);
});

toggleControls.addEventListener('click', () => {
    controls.classList.toggle('hidden');
    const isHidden = controls.classList.contains('hidden');
    toggleControls.innerHTML = isHidden ? 
        '<svg class="toggle-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97L21.54,14.63C21.73,14.78 21.78,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.03 19.05,18.95L16.56,17.94C16.04,18.34 15.5,18.67 14.87,18.91L14.5,21.58C14.46,21.82 14.25,22 14,22H10C9.75,22 9.54,21.82 9.5,21.58L9.13,18.91C8.5,18.67 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.09L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.09C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.78,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,12.97Z" /></svg>' :
        '<svg class="toggle-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>';
});

// Apply initial theme
applyTheme(config.currentTheme);

// Animation loop
function animate() {
    // Clear canvas with theme background color and configurable opacity
    ctx.fillStyle = config.backgroundColor.replace(')', `, ${config.fadeAlpha})`).replace('rgb', 'rgba').replace('RGB', 'RGBA');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw each boid
    for (const boid of boids) {
        boid.update(canvas.width, canvas.height, boids);
        boid.draw(ctx);
    }
    
    requestAnimationFrame(animate);
}

animate();