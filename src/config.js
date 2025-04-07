export const config = {
    // Boid settings
    numBoids: 150,
    boidSize: 5,
    maxSpeed: 4,
    minSpeed: 2,
    visionRadius: 75,
    
    // Forces
    separationForce: 2.0,
    alignmentForce: 1.0,
    cohesionForce: 1.0,
    
    // Appearance
    boidColor: '#4CAF50',
    trailColor: 'rgba(76, 175, 80, 0.1)',
    trailLength: 10,
    backgroundColor: '#121212',
    fadeAlpha: 0.3,
    
    // Environment
    edgeBehavior: 'wrap',
    
    // UI
    currentTheme: 'forest',
    
    // Performance
    useQuadtree: false 
};

export const themes = {
    forest: {
        boidColor: '#4CAF50',
        trailColor: 'rgba(76, 175, 80, 0.1)',
        backgroundColor: '#0a1910',
        controlsBg: 'rgba(0, 59, 0, 0.7)'
    },
    ocean: {
        boidColor: '#03A9F4',
        trailColor: 'rgba(3, 169, 244, 0.1)',
        backgroundColor: '#041b29',
        controlsBg: 'rgba(0, 34, 59, 0.7)'
    },
    sunset: {
        boidColor: '#FF5722',
        trailColor: 'rgba(255, 87, 34, 0.1)',
        backgroundColor: '#1a0d0d',
        controlsBg: 'rgba(59, 20, 0, 0.7)'
    },
    neon: {
        boidColor: '#FF00FF',
        trailColor: 'rgba(255, 0, 255, 0.1)',
        backgroundColor: '#0a0a1a',
        controlsBg: 'rgba(30, 0, 59, 0.7)'
    },
    black: {
        boidColor: '#FFFFFF',
        trailColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: '#000000',
        controlsBg: 'rgba(20, 20, 20, 0.7)'
    }
};