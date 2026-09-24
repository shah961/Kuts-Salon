/**
 * Animation Module for Kuts & More Unisex Salon
 * Implements lightweight WebGL ambient canvas (Three.js) and GSAP scroll reveals.
 * Respects prefers-reduced-motion settings.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        initThreeJSBackground();
        initGSAPAnimations();
    }
});

/**
 * Lightweight, ambient WebGL Particle background using Three.js
 */
function initThreeJSBackground() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    } catch (e) {
        return; // Graceful fallback if WebGL fails
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Create subtle champagne particle grid
    const particlesCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 15;
        positions[i + 1] = (Math.random() - 0.5) * 15;
        positions[i + 2] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xcaba94,
        size: 0.04,
        transparent: true,
        opacity: 0.4
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    camera.position.z = 5;

    let animationFrameId;
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        particleSystem.rotation.y += 0.0008;
        particleSystem.rotation.x += 0.0004;
        renderer.render(scene, camera);
    }

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
}

/**
 * GSAP ScrollTrigger Entrance Animations
 */
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    const revealElements = document.querySelectorAll('.gs-reveal');

    revealElements.forEach((el) => {
        gsap.fromTo(el, 
            { 
                opacity: 0, 
                y: 30 
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}
