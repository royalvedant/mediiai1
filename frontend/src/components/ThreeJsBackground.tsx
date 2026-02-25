import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeJsBackgroundProps {
  isLightMode?: boolean;
}

export default function ThreeJsBackground({ isLightMode = false }: ThreeJsBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Mouse tracking
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Neural network nodes
    const nodeCount = 60;
    const nodePositions: THREE.Vector3[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.15, 8, 8);

    const cyanColor = isLightMode ? 0x0088bb : 0x00d4ff;
    const purpleColor = isLightMode ? 0x6622cc : 0x7c3aed;
    const cyanBright = isLightMode ? 0x0099cc : 0x00fff0;

    const nodeMaterials = [
      new THREE.MeshBasicMaterial({ color: cyanColor }),
      new THREE.MeshBasicMaterial({ color: purpleColor }),
      new THREE.MeshBasicMaterial({ color: cyanBright }),
    ];

    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const mat = nodeMaterials[Math.floor(Math.random() * nodeMaterials.length)];
      const node = new THREE.Mesh(nodeGeometry, mat.clone());
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30
      );
      node.position.copy(pos);
      nodePositions.push(pos);
      nodes.push(node);
      scene.add(node);
    }

    // Connections between nearby nodes
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: cyanColor,
      transparent: true,
      opacity: 0.15,
    });

    const connections: THREE.Line[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 18 && connections.length < 120) {
          const points = [nodePositions[i], nodePositions[j]];
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geo, connectionMaterial.clone());
          connections.push(line);
          scene.add(line);
        }
      }
    }

    // Floating particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      velocities.push((Math.random() - 0.5) * 0.02, Math.random() * 0.03 + 0.01, (Math.random() - 0.5) * 0.01);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: cyanColor,
      size: 0.3,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Heartbeat waveform
    const wavePoints: THREE.Vector3[] = [];
    const waveSegments = 200;
    for (let i = 0; i < waveSegments; i++) {
      wavePoints.push(new THREE.Vector3((i / waveSegments) * 60 - 30, 0, -5));
    }
    const waveGeo = new THREE.BufferGeometry().setFromPoints(wavePoints);
    const waveMat = new THREE.LineBasicMaterial({
      color: cyanBright,
      transparent: true,
      opacity: 0.5,
    });
    const waveLine = new THREE.Line(waveGeo, waveMat);
    waveLine.position.y = -12;
    scene.add(waveLine);

    // Animation
    let time = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.01;

      // Smooth mouse follow
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Camera parallax
      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;

      // Animate nodes
      nodes.forEach((node, i) => {
        node.position.y += Math.sin(time + i * 0.5) * 0.005;
        node.position.x += Math.cos(time * 0.7 + i * 0.3) * 0.003;
        const mat = node.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.5 + Math.sin(time + i) * 0.3;
        mat.transparent = true;
      });

      // Animate particles
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3 + 2] += velocities[i * 3 + 2];

        // Wrap around
        if (pos[i * 3 + 1] > 30) pos[i * 3 + 1] = -30;
        if (pos[i * 3] > 50) pos[i * 3] = -50;
        if (pos[i * 3] < -50) pos[i * 3] = 50;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Animate heartbeat waveform
      const wavePositions = waveGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < waveSegments; i++) {
        const x = (i / waveSegments) * 60 - 30;
        const t = time * 2 - i * 0.1;
        let y = 0;

        // Heartbeat pattern
        const phase = ((t % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        if (phase < 0.3) y = phase * 10;
        else if (phase < 0.6) y = (0.6 - phase) * 20 - 3;
        else if (phase < 0.9) y = (phase - 0.6) * 30;
        else if (phase < 1.2) y = (1.2 - phase) * 10;
        else y = Math.sin(phase * 3) * 0.3;

        wavePositions[i * 3] = x;
        wavePositions[i * 3 + 1] = y * 0.8;
      }
      waveGeo.attributes.position.needsUpdate = true;

      // Animate connection opacity
      connections.forEach((line, i) => {
        const mat = line.material as THREE.LineBasicMaterial;
        mat.opacity = 0.05 + Math.sin(time * 0.5 + i * 0.2) * 0.1;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isLightMode]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: isLightMode ? 'linear-gradient(135deg, #e8f4ff 0%, #d0e8ff 50%, #e8f0ff 100%)' : 'linear-gradient(135deg, #020817 0%, #0a1628 50%, #050d1a 100%)' }}
    />
  );
}
