// ===== Particle Background Animation =====
class ParticleCanvas {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouseX = 0;
        this.mouseY = 0;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach((p, i) => {
            // Move particles
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
            this.ctx.fill();

            // Draw connections
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 150)})`;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===== Scroll Reveal Animation =====
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.project-card, .skill-category, .highlight-card');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// ===== Project Modal =====
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        this.modalBody = this.modal?.querySelector('.modal-body');
        this.closeBtn = this.modal?.querySelector('.modal-close');
        this.projectCards = document.querySelectorAll('.project-card');

        this.projectData = {
            fpso: {
                title: 'FPSO Dynamic Response Analysis',
                image: 'assets/fpso_motion.gif',
                description: 'Finite element analysis of a Floating Production, Storage and Offloading (FPSO) vessel using CalculiX open-source solver.',
                highlights: [
                    'Frequency domain analysis of hull motion response',
                    'Realistic mooring line dynamics with catenary behavior',
                    'Wave excitation and damping coefficient modeling',
                    'Export of animation showing 6-DOF vessel motion'
                ],
                tools: ['CalculiX', 'Python', 'ParaView', 'MATLAB']
            },
            reactor: {
                title: 'Nuclear Reactor Graphite Analysis',
                image: 'assets/stress_distribution.png',
                description: 'Coupled thermal-mechanical simulation of an HTTR-type hexagonal graphite moderator brick under operating conditions.',
                highlights: [
                    'Temperature distribution with 680.9 K peak temperature',
                    'Von Mises stress analysis showing 12.2 MPa maximum',
                    'Safety factor of 3.1x against flexural strength limit',
                    'Mesh independence study validating convergence',
                    'IG-110 nuclear graphite material properties'
                ],
                tools: ['CalculiX', 'Python', 'VTK', 'Matplotlib']
            },
            wing: {
                title: 'Wing Parameter Discovery',
                image: 'assets/wing_preview.png',
                description: 'Using symbolic regression (PySR) to discover the mathematical equations governing wing geometry from aerodynamic performance requirements.',
                highlights: [
                    '3D parametric wing generation with NACA profiles',
                    'Symbolic regression to reverse-engineer chord and twist distributions',
                    'Forward design: Geometry → Physics equations',
                    'Inverse design: Performance targets → Optimal geometry',
                    'Interactive Streamlit application for design exploration'
                ],
                tools: ['Python', 'PySR', 'Julia', 'Streamlit', 'Plotly']
            },
            vima: {
                title: 'VIMA - Visual Impairment Motion Assistant',
                image: 'assets/vima_project.png',
                description: 'Detachable handle equipped with ultrasonic sensors and vibratory actuators, delivering real-time haptic feedback to detect obstacles for visually impaired users.',
                highlights: [
                    '3D CAD models and detailed engineering drawings in SolidWorks',
                    'Arduino-based electrical infrastructure with multiple sensors',
                    'Rapid prototyping with 3D printing for fabrication',
                    '95% similarity to traditional white canes achieved',
                    'Secured £3700 grant from Sister, Manchester\'s Innovation District'
                ],
                tools: ['SolidWorks', 'Arduino', '3D Printing', 'Sensors', 'Abaqus']
            },
            knee_cpm: {
                title: 'Portable Knee CPM Device',
                image: 'assets/knee_cpm_project.png',
                description: 'Year 4 Group Design Project - A lightweight Continuous Passive Motion device for post-operative knee rehabilitation optimized for home use.',
                highlights: [
                    '120-degree range of motion flexion capability',
                    'Total system weight under 10kg for portability',
                    'Torque analysis for 99th percentile body weight (118kg)',
                    'Dual NEMA 23 servo motors with optical encoders',
                    'Aluminium 6061-T6 frame with 9.1 safety factor'
                ],
                tools: ['SolidWorks', 'Abaqus', 'MATLAB', 'Mechatronics']
            },
            tank_cfd: {
                title: 'Tank Mixture Dispersion CFD',
                image: 'assets/dnv_cfd_project.png',
                description: 'CFD analysis of gas mixture dispersion from maritime tank venting systems under steady light breeze conditions at DNV Maritime.',
                highlights: [
                    'Flow of gas mixture at air velocity of 1.5 m/s',
                    'Mass fraction tracking of methane dispersion',
                    'Symmetry boundary conditions for computational efficiency',
                    'ANSYS Fluent for transient simulation',
                    'Safety assessment for maritime regulatory compliance'
                ],
                tools: ['ANSYS Fluent', 'CFD', 'Maritime', 'DNV']
            },
            cii_dashboard: {
                title: 'CII Rating Dashboard',
                image: 'assets/cii_dashboard.png',
                description: 'Excel-based Carbon Intensity Indicator calculator developed at DNV for vessel emissions compliance assessment.',
                highlights: [
                    'Compact on-device tool for calculating carbon intensity',
                    'Used IMO documentation and formulas',
                    'Wide range of vessel and fuel types supported',
                    'Simplified workflow for all consultants',
                    'Enhanced client presentations for CII-related services'
                ],
                tools: ['Excel', 'IMO Standards', 'Maritime', 'DNV']
            },
            hose_device: {
                title: 'Firefighting Hose Device',
                image: 'assets/kerb_removal.png',
                description: 'Y3 Design Challenge - Two-part firefighting device integrating a kink removal system with a hose advancer to optimize hose management.',
                highlights: [
                    'Kink removal system combined with hose advancer',
                    'Rigorous selection matrix and iterative design',
                    'Guide and drive rollers with hinge mechanism',
                    'Rack-and-pinion steering system',
                    'Eco-friendly materials improving firefighter safety'
                ],
                tools: ['SolidWorks', 'CAD', 'Sheet Metal', 'Prototyping']
            },
            hyperloop: {
                title: 'Hyperloop Braking System',
                image: 'assets/hyperloop_braking.png',
                description: 'Braking systems engineering for Hyperloop Manchester - nonlinear FEA and thermal analysis of high-speed braking components.',
                highlights: [
                    'Nonlinear FEA on braking components for stress analysis',
                    'Temperature vs time analysis for front brakes',
                    'Brake pad volume wear prediction over time',
                    'Fatigue life and failure mode assessment',
                    'Physical testing validation of simulation results'
                ],
                tools: ['Abaqus', 'FEA', 'MATLAB', 'Thermal Analysis']
            }
        };

        this.init();
    }

    init() {
        if (!this.modal) return;

        this.projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.dataset.project;
                this.open(projectId);
            });
        });

        this.closeBtn?.addEventListener('click', () => this.close());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    }

    open(projectId) {
        const data = this.projectData[projectId];
        if (!data) return;

        this.modalBody.innerHTML = `
            <h2>${data.title}</h2>
            <img src="${data.image}" alt="${data.title}">
            <p>${data.description}</p>
            <h3 style="color: var(--accent-primary); margin: 24px 0 12px;">Key Highlights</h3>
            <ul>
                ${data.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
            <h3 style="color: var(--accent-primary); margin: 24px 0 12px;">Technologies Used</h3>
            <div class="project-tags">
                ${data.tools.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        `;

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== Smooth Scroll Navigation =====
class SmoothNav {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== Navbar Scroll Effect =====
class NavbarEffect {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.padding = '12px 0';
                this.navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            } else {
                this.navbar.style.padding = '20px 0';
                this.navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            }
        });
    }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    new ParticleCanvas();
    new ScrollReveal();
    new ProjectModal();
    new SmoothNav();
    new NavbarEffect();
});
