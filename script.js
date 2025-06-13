const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.5, 3000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 100, 350);
camera.lookAt(0, 0, 0);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 60;
controls.maxDistance = 400;


const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1.5, 300);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);


const starGeometry = new THREE.BufferGeometry();
const starCount = 1000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 3000;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);


const planets = [
    { name: 'Sun', path: './models/a_sun/scene.gltf', radius: 0, speed: 1, object: null, initialAngle: 0, description: 'The Sun is the star at the center of our solar system.' },
    { name: 'Mercury', path: './models/planets/b_mercury/scene.gltf', radius: 65, speed: 4.1, object: null, initialAngle: 0, description: 'Mercury is the smallest planet and closest to the Sun.' },
    { name: 'Venus', path: './models/planets/c_venus/scene.gltf', radius: 80, speed: 1, object: null, initialAngle: 45, description: 'Venus is known for its thick, toxic atmosphere.' },
    { name: 'Earth', path: './models/planets/d_earth/scene.gltf', radius: 110, speed: 1, object: null, initialAngle: 90, description: 'Earth is the only planet known to support life.' },
    { name: 'Mars', path: './models/planets/e_mars/scene.gltf', radius: 140, speed: 0.8, object: null, initialAngle: 135, description: 'Mars is called the Red Planet due to its color.' },
    { name: 'Jupiter', path: './models/planets/f_jupiter/scene.gltf', radius: 200, speed: 1, object: null, initialAngle: 180, description: 'Jupiter is the largest planet in our solar system.' },
    { name: 'Saturn', path: './models/planets/g_saturn/scene.gltf', radius: 230, speed: 1, object: null, initialAngle: 225, description: 'Saturn is famous for its stunning ring system.' },
    { name: 'Uranus', path: './models/planets/h_uranus/scene.gltf', radius: 280, speed: 1, object: null, initialAngle: 270, description: 'Uranus has a unique tilt, making it appear to roll.' },
    { name: 'Neptune', path: './models/planets/i_neptune/scene.gltf', radius: 330, speed: 1, object: null, initialAngle: 315, description: 'Neptune is known for its deep blue color.' }
];


const loader = new THREE.GLTFLoader();


function loadModel(path) {
    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (gltf) => {
                console.log(`Successfully loaded ${path}`);
                resolve(gltf);
            },
            (progress) => {
                console.log(`Loading ${path}: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
            },
            (error) => {
                console.error(`Error loading ${path}:`, error);
                reject(error);
            }
        );
    });
}


function createFallbackPlanet(name, radius) {
    const colors = {
        sun: 0xFDB813,
        mercury: 0x8C7853,
        venus: 0xFFC649,
        earth: 0x6B93D6,
        mars: 0xCD5C5C,
        jupiter: 0xDEB887,
        saturn: 0xF4C542,
        uranus: 0xB2E2E2,
        neptune: 0x4169E1
    };

    const planetSizes = {
        sun: 20,
        mercury: 3.5,
        venus: 4,
        earth: 3,
        mars: 4,
        jupiter: 3.8,
        saturn: 3.2,
        uranus: 2.8,
        neptune: 12
    };

    let size;
    try {
        size = planetSizes[name.toLowerCase()] || 3;
    } catch (error) {
        console.error(`Error accessing size for ${name}:`, error);
        size = 3;
    }

    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: colors[name.toLowerCase()] || 0xffffff,
        emissive: name.toLowerCase() === 'sun' ? colors.sun : 0x000000,
        shininess: 25
    });

    return new THREE.Mesh(geometry, material);
}


function createDashedOrbit(radius) {
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta)));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({ color: 0x888888, dashSize: 2, gapSize: 1 });
    const orbit = new THREE.Line(geometry, material);
    orbit.computeLineDistances();
    return orbit;
}


async function loadModels() {
    try {
        
        const sunData = planets[0];
        try {
            const sunGltf = await loadModel(sunData.path);
            sunData.object = sunGltf.scene;
            sunData.object.scale.set(4, 4, 4);
        } catch (error) {
            console.warn(`Failed to load Sun model, creating fallback`);
            sunData.object = createFallbackPlanet('Sun');
        }
        sunData.object.position.set(0, 0, 0);
        scene.add(sunData.object);
        console.log('Sun added to scene');

        
        for (let i = 1; i < planets.length; i++) {
            const planet = planets[i];

            if (planet.name === 'Mercury' || planet.name === 'Mars') {
                console.log(`Creating default sphere for ${planet.name}`);
                planet.object = createFallbackPlanet(planet.name);
            } else {
                try {
                    const gltf = await loadModel(planet.path);
                    planet.object = gltf.scene;
                    if (planet.name === 'Neptune') {
                        planet.object.scale.set(0.6, 0.6, 0.6);
                    } else if (planet.name === 'Jupiter' || planet.name === 'Saturn' || planet.name === 'Uranus') {
                        planet.object.scale.set(0.05, 0.05, 0.05);
                    } else {
                        planet.object.scale.set(0.1, 0.1, 0.1);
                    }
                } catch (error) {
                    console.warn(`Failed to load ${planet.name} model, creating fallback`);
                    try {
                        planet.object = createFallbackPlanet(planet.name);
                    } catch (fallbackError) {
                        console.error(`Failed to create fallback for ${planet.name}:`, fallbackError);
                        planet.object = new THREE.Mesh(
                            new THREE.SphereGeometry(3, 32, 32),
                            new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 25 })
                        );
                    }
                }
            }

            if (planet.object) {
                scene.add(planet.object);
                console.log(`${planet.name} added to scene`);


                if (planet.name === 'Mercury') {

                    const orbitGeometry = new THREE.RingGeometry(
                        planet.radius - 0.5, 
                        planet.radius + 0.5,
                        64 
                    );
                    const orbitMaterial = new THREE.MeshBasicMaterial({ 
                        color: 0x888888, 
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.5
                    });
                    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                    orbit.rotation.x = Math.PI / 2;
                    scene.add(orbit);
                    console.log(`${planet.name} orbit added at radius ${planet.radius}`);
                } else {
                    const innerRadius = planet.radius - 0.2;
                    const outerRadius = planet.radius + 0.2;
                    const orbitGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
                    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
                    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                    orbit.rotation.x = Math.PI / 2;
                    scene.add(orbit);
                    console.log(`${planet.name} orbit added at radius ${planet.radius}`);
                }

                const angle = planet.initialAngle * (Math.PI / 180);
                planet.object.position.x = planet.radius * Math.cos(angle);
                planet.object.position.y = 0;
                planet.object.position.z = planet.radius * Math.sin(angle);

                console.log(`${planet.name} initial position: x=${planet.object.position.x.toFixed(2)}, y=${planet.object.position.y.toFixed(2)}, z=${planet.object.position.z.toFixed(2)}`);
            } else {
                console.error(`${planet.name} object is null, not added to scene`);
            }
        }
    } catch (error) {
        console.error("Error in loadModels:", error);
    }
}

loadModels();

let isPaused = false;
const clock = new THREE.Clock();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.object).filter(obj => obj !== null));

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const planet = planets.find(p => p.object === intersected);
        if (planet) {
            
            const targetPosition = intersected.position.clone();
            const distance = 50;
            const direction = targetPosition.clone().sub(camera.position).normalize();
            const newPosition = targetPosition.clone().sub(direction.multiplyScalar(distance));
            camera.position.lerp(newPosition, 0.1);
            camera.lookAt(targetPosition);
            controls.target.copy(targetPosition);
            tooltip.style.display = 'block';
            tooltip.innerHTML = `<strong>${planet.name}</strong><br>${planet.description}`;
            tooltip.style.left = `${event.clientX + 10}px`;
            tooltip.style.top = `${event.clientY - 20}px`;
        }
    } else {
        tooltip.style.display = 'none';
    }
});

const defaultSpeeds = {
    sun: 0.002,
    mercury: 4.1,
    venus: 1.6,
    earth: 1.0,
    mars: 0.8,
    jupiter: 0.4,
    saturn: 0.3,
    uranus: 0.2,
    neptune: 0.1
};

document.addEventListener('DOMContentLoaded', () => {
    planets.forEach(planet => {
        const slider = document.getElementById(`${planet.name.toLowerCase()}Speed`);
        const speedValue = document.getElementById(`${planet.name.toLowerCase()}SpeedValue`);
        
        if (slider) {
            planet.speed = defaultSpeeds[planet.name.toLowerCase()];
            
            slider.addEventListener('input', (e) => {
                const percentage = parseInt(e.target.value);
                planet.speed = defaultSpeeds[planet.name.toLowerCase()] * (percentage / 100);
                speedValue.textContent = `${percentage}%`;
            });
        } else {
            console.warn(`Slider for ${planet.name} not found.`);
        }
    });

    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        });
    } else {
        console.warn('Pause button not found.');
    }

    const speedBtn = document.getElementById('speedBtn');
    const sliders = document.getElementById('sliders');
    if (speedBtn && sliders) {
        speedBtn.addEventListener('click', () => {
            sliders.style.display = sliders.style.display === 'none' || sliders.style.display === '' ? 'flex' : 'none';
            speedBtn.textContent = sliders.style.display === 'flex' ? 'Hide Speed Controls' : 'Show Speed Controls';
        });
    }
});

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.object).filter(obj => obj !== null));

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const planet = planets.find(p => p.object === intersected);
        if (planet) {
            tooltip.style.display = 'block';
            tooltip.innerHTML = `
                <strong>${planet.name}</strong>
                <p>${planet.description}</p>
                <p>Current Speed: ${(planet.speed / defaultSpeeds[planet.name.toLowerCase()] * 100).toFixed(0)}%</p>
            `;
            tooltip.style.left = `${event.clientX + 10}px`;
            tooltip.style.top = `${event.clientY - 20}px`;
        }
    } else {
        tooltip.style.display = 'none';
    }
});

function animate() {
    requestAnimationFrame(animate);

    if (!isPaused) {
        const time = clock.getElapsedTime();

        planets.forEach(planet => {
            if (planet.object && planet.radius > 0) {
                const angle = (time * planet.speed) + (planet.initialAngle * (Math.PI / 180));
                planet.object.position.x = planet.radius * Math.cos(angle);
                planet.object.position.y = 0;
                planet.object.position.z = planet.radius * Math.sin(angle);
                planet.object.rotation.y += planet.speed * 0.01;
            } else if (planet.object) {
                planet.object.rotation.y += defaultSpeeds.sun;
            }
        });
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});