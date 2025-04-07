import { config } from './config.js';

export class Boid {
    constructor(x, y) {
        this.position = { x, y };
        this.velocity = {
            x: Math.random() * 4 - 2,
            y: Math.random() * 4 - 2
        };
        this.acceleration = { x: 0, y: 0 };
        this.maxForce = 0.2;
        this.history = [];
        this.maxHistoryLength = config.trailLength;
        this.color = this.generateVariation(config.boidColor);
    }

    generateVariation(baseColor) {
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);

        const variation = 15; 
        const newR = Math.min(255, Math.max(0, r + (Math.random() * variation*2 - variation)));
        const newG = Math.min(255, Math.max(0, g + (Math.random() * variation*2 - variation)));
        const newB = Math.min(255, Math.max(0, b + (Math.random() * variation*2 - variation)));

        return `rgb(${Math.floor(newR)}, ${Math.floor(newG)}, ${Math.floor(newB)})`;
    }

    update(width, height, boids) {
        this.flock(boids);

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > config.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * config.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * config.maxSpeed;
        } else if (speed < config.minSpeed) {
            this.velocity.x = (this.velocity.x / speed) * config.minSpeed;
            this.velocity.y = (this.velocity.y / speed) * config.minSpeed;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (config.edgeBehavior === 'wrap') {
            this.position.x = (this.position.x + width) % width;
            this.position.y = (this.position.y + height) % height;
        } else {
            if (this.position.x < 0 || this.position.x > width) {
                this.velocity.x *= -1;
                this.position.x = Math.max(0, Math.min(width, this.position.x));
            }
            if (this.position.y < 0 || this.position.y > height) {
                this.velocity.y *= -1;
                this.position.y = Math.max(0, Math.min(height, this.position.y));
            }
        }

        this.history.push({ x: this.position.x, y: this.position.y });
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }

        this.acceleration = { x: 0, y: 0 };
    }

    flock(boids) {
        const separation = this.separate(boids);
        const alignment = this.align(boids);
        const cohesion = this.cohesion(boids);

        separation.x *= config.separationForce;
        separation.y *= config.separationForce;
        alignment.x *= config.alignmentForce;
        alignment.y *= config.alignmentForce;
        cohesion.x *= config.cohesionForce;
        cohesion.y *= config.cohesionForce;

        this.acceleration.x += separation.x + alignment.x + cohesion.x;
        this.acceleration.y += separation.y + alignment.y + cohesion.y;
    }

    separate(boids) {
        const desiredSeparation = config.visionRadius * 0.5;
        const steer = { x: 0, y: 0 };
        let count = 0;

        for (const other of boids) {
            if (other === this) continue;

            const dx = this.position.x - other.position.x;
            const dy = this.position.y - other.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0 && distance < desiredSeparation) {
                steer.x += dx / distance;
                steer.y += dy / distance;
                count++;
            }
        }

        if (count > 0) {
            steer.x /= count;
            steer.y /= count;

            const mag = Math.sqrt(steer.x ** 2 + steer.y ** 2);
            if (mag > 0) {
                steer.x = (steer.x / mag) * config.maxSpeed;
                steer.y = (steer.y / mag) * config.maxSpeed;

                const steerMag = Math.sqrt(steer.x ** 2 + steer.y ** 2);
                if (steerMag > this.maxForce) {
                    steer.x = (steer.x / steerMag) * this.maxForce;
                    steer.y = (steer.y / steerMag) * this.maxForce;
                }
            }
        }

        return steer;
    }

    align(boids) {
        const neighborDist = config.visionRadius;
        const sum = { x: 0, y: 0 };
        let count = 0;

        for (const other of boids) {
            if (other === this) continue;

            const dx = this.position.x - other.position.x;
            const dy = this.position.y - other.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0 && distance < neighborDist) {
                sum.x += other.velocity.x;
                sum.y += other.velocity.y;
                count++;
            }
        }

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;

            const mag = Math.sqrt(sum.x ** 2 + sum.y ** 2);
            if (mag > 0) {
                sum.x = (sum.x / mag) * config.maxSpeed;
                sum.y = (sum.y / mag) * config.maxSpeed;

                const steer = {
                    x: sum.x - this.velocity.x,
                    y: sum.y - this.velocity.y
                };

                const steerMag = Math.sqrt(steer.x ** 2 + steer.y ** 2);
                if (steerMag > this.maxForce) {
                    steer.x = (steer.x / steerMag) * this.maxForce;
                    steer.y = (steer.y / steerMag) * this.maxForce;
                }

                return steer;
            }
        }

        return { x: 0, y: 0 };
    }

    cohesion(boids) {
        const neighborDist = config.visionRadius;
        const sum = { x: 0, y: 0 };
        let count = 0;

        for (const other of boids) {
            if (other === this) continue;

            const dx = this.position.x - other.position.x;
            const dy = this.position.y - other.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0 && distance < neighborDist) {
                sum.x += other.position.x;
                sum.y += other.position.y;
                count++;
            }
        }

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;

            const desired = {
                x: sum.x - this.position.x,
                y: sum.y - this.position.y
            };

            const mag = Math.sqrt(desired.x ** 2 + desired.y ** 2);
            if (mag > 0) {
                desired.x = (desired.x / mag) * config.maxSpeed;
                desired.y = (desired.y / mag) * config.maxSpeed;

                const steer = {
                    x: desired.x - this.velocity.x,
                    y: desired.y - this.velocity.y
                };

                const steerMag = Math.sqrt(steer.x ** 2 + steer.y ** 2);
                if (steerMag > this.maxForce) {
                    steer.x = (steer.x / steerMag) * this.maxForce;
                    steer.y = (steer.y / steerMag) * this.maxForce;
                }

                return steer;
            }
        }

        return { x: 0, y: 0 };
    }

    draw(ctx) {
        if (this.history.length > 1) {
            ctx.strokeStyle = config.trailColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.history[0].x, this.history[0].y);

            for (let i = 1; i < this.history.length; i++) {
                const alpha = i / this.history.length; 
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }

            ctx.stroke();
        }

        const angle = Math.atan2(this.velocity.y, this.velocity.x);

        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angle);

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.moveTo(config.boidSize * 2, 0);
        ctx.lineTo(-config.boidSize, config.boidSize);
        ctx.lineTo(-config.boidSize, -config.boidSize);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}