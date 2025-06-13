# 3d-Solar-System-Simulation
Solar System Simulation
This is a Three.js 3D solar system simulation that features the Sun and eight planets (Mercury to Neptune) with actual orbits, interactive speed controls.

Features:
3D perspective of the solar system with planets orbiting around the Sun.
Interactive speed sliders to change the revolution and rotation speeds of each planet.
Pause/resume functionality to govern the animation.

Prerequisites:
A contemporary web browser (e.g., Firefox, Chrome).
A local server to execute the project (e.g., VS Code Live Server extension, Node.js http-server).
Internet access to download Three.js dependencies through CDN.

Project Structure
solar-simulation/
├── index.html       
├── script.js        
├── style.css        
├── README.md        
└── models/          
├── a_sun/
│   └── scene.gltf
└── planets/
├── b_mercury/
│   └── scene.gltf
├── c_venus/
│   └── scene.gltf
├── d_earth/
│   └── scene.gltf
├── e_mars/
│   └── scene.gltf
├── f_jupiter/
│   └── scene.gltf
├── g_saturn/
│   └── scene.gltf
├── h_uranus/
│   └── scene.gltf
── i_neptune/
└── scene.gltf

Steps to Run
Clone or Download the Project:
Copy the project directory (solar-simulation/) to your local machine.
Check the Folder Structure:
Check that all the mentioned files and directories in the "Project Structure" section above are present.
The models/ directory should have the 3D model files (scene.gltf) for the planets and the Sun. Note: Mercury and Mars have fallback spheres, so you don't need their models.

Set Up a Local Server:
Three.js requires a local server to load the 3D models due to browser security restrictions.
Option 1: Using VS Code Live Server (Recommended):
Open the project directory in VS Code.
Install the "Live Server" extension if you have not done so.
Right-click on index.html and choose "Open with Live Server".

Option 2: Using Node.js http-server:
Install http-server globally if you have not already:npm install -g http-server
Within the project directory, run:http-server
Open your browser and go to http://localhost:8080.

Participate in the Simulation:

The simulation will automatically load in your browser.
Rotate the camera using the mouse (OrbitControls).
Select a planet to zoom in and see a tooltip with the name and description.
Use the controls at the bottom:
Pause/Resume: Pause or resume the animation.
Show Speed Controls: Alternate between showing speed sliders for all planets.
Theme Toggle: Change between light and dark themes.
Adjust the revolution and rotation speed of each planet using the speed sliders.

Dependencies:
Three.js
OrbitControls
GLTFLoader Loaded from CDN 

Technical Information:
Animation Loop -
The project uses requestAnimationFrame to create a smooth and efficient cycle of animation:
What It Does: requestAnimationFrame is a browser API that invokes the animate() function on the next frame, typically around 60 FPS. This maintains the animation in step with the browser's refresh rate and pauses when the tab is inactive, saving resources.
How It's Used: In script.js, the animate() function invokes requestAnimationFrame(animate) in order to update the scene continuously, draw the planets' positions, and process user input such as camera controls.

Time Management using THREE.Clock -
The project employs THREE.Clock to control time-based animations for the movement of the planets: What It Does: THREE.Clock is a Three.js utility that computes time since creation and keeps animations in sync irrespective of the frame rate. How It's Used: In script.js, a new THREE.Clock object is created with const clock = new THREE.Clock(). The elapsed time (clock.getElapsedTime()) is employed to decide the position of each planet in orbit (time * planet.speed * 0.015) and the rotation speed, making the animation smooth and not device performance-based. 

Notes :
If the 3D models are not loadable, the simulation will use fallback spheres of suitable colors.
Ensure that you have an internet connection to download the Three.js dependencies. 
The simulation is also optimized for desktop browsers and is not completely responsive on mobile devices. 
