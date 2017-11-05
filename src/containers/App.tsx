import * as React from "react";
import * as THREE from "three";


export interface AppState {
}


export interface AppProps extends React.Props<App> {
}


export default class App extends React.Component<AppProps, AppState> {
    render() {
        return (
            <div>
                <canvas ref={this.handleCanvasRef}>
                </canvas>
        </div>
        )
    }

    private handleCanvasRef = (canvas: HTMLCanvasElement) => {
        if (canvas != null) {
            this.init(canvas);
        }
    }

    private init(canvas: HTMLCanvasElement) {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 55;

        const renderer = new THREE.WebGLRenderer({
            canvas,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dLight.position.y = 1;
        dLight.position.z = 0.1;
        scene.add(dLight);

        const dLight2 = new THREE.DirectionalLight(0xfdb438, 0.7);
        dLight2.position.y = -1;
        dLight2.position.x = -0.6;
        scene.add(dLight2);

        const aLight = new THREE.AmbientLight(0x222252);
        scene.add(aLight);

        const particles: Particle[] = [];

        for (let x = -50; x < 50; x += 3) {
            for(let y = -50; y < 50; y += 3) {
                for (let z = 0; z > -30; z -= 3) {
                    const mesh = createIcosahedron();
                    mesh.position.set(x, y, z);
                    scene.add(mesh);

                    const particle = {
                        x,
                        y,
                        z,
                        mesh,
                    };
                    particles.push(particle);
                }
            }
        }

        const callback = () => {
            var bufferLength = analyser.frequencyBinCount;
            const array = new Float32Array(bufferLength);
            analyser.getFloatFrequencyData(array);
            
            const highestAmplitude = Math.max(...array);

            const time = performance.now();

            particles.forEach((particle) => {
                computePosition(particle, time, highestAmplitude);
            });
            mat2.color.setHSL((time / 3000) % 1, 1, 0.5);
            renderer.render(scene, camera);
            requestAnimationFrame(callback);
        }
        callback();
    }
}

function map(value: number, ilow: number, ihigh: number, olow: number, ohigh: number) {
    const percentage = (value - ilow) / (ihigh - ilow);
    return percentage * (ohigh - olow) + olow;
}

function computePosition(particle: Particle, time: number, amplitude: number) {
    const mesh = particle.mesh;
    const x = particle.x + Math.sin(time / 1000 + particle.x / 10 + particle.z / 50) * 5;
    const y = particle.y + Math.sin(time / 1000 + particle.x / 10 + particle.y / 15 + particle.z / 100) * 5;
    const z = particle.z;
    const scale = map(amplitude, -90, -30, 0.25, 2.5); 
    mesh.rotation.x += 0.01 + particle.x / 10000;
    mesh.rotation.y += 0.001 + particle.y / 10000;
    mesh.position.set(
        x,
        y,
        z,
    );
    mesh.position.multiplyScalar(scale);
    mesh.scale.setScalar(scale);
}

function o1(position: THREE.Vector3, time: number) {
    return new THREE.Vector3(
        Math.sin(time / 1000 + position.x / 10),
        Math.sin(time / 1000 + position.x / 10 + position.y / 15),
        0,
    );
}

function o2(position: THREE.Vector3, time: number) {

}

interface Particle {
    x: number;
    y: number;
    z: number;
    mesh: THREE.Object3D;
}

const geometry = new THREE.IcosahedronGeometry(1, 0);

const mat1 = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.0
});

const mat2 = new THREE.MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    side: THREE.DoubleSide,
    flatShading: true
});

function createIcosahedron() {
    var mesh = new THREE.Object3D();

    const lineSegments = new THREE.LineSegments(
        geometry,
        mat1,
    );
    lineSegments.scale.multiply(new THREE.Vector3(1.1, 1.1, 1.1));

    const fill = new THREE.Mesh(
        geometry,
        mat2,
    );

    mesh.add(lineSegments);
    mesh.add(fill);
    mesh.scale.multiplyScalar(0.8);

    return mesh;
}

const context = new AudioContext();
const analyser = context.createAnalyser();
analyser.fftSize = 1024;

navigator.mediaDevices.getUserMedia({
    audio: true
}).then((mediaStream) => {
    const source = context.createMediaStreamSource(mediaStream);
    // Connect it to the destination.
    source.connect( analyser );
})