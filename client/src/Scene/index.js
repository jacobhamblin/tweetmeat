import React, { Component } from 'react';
import * as THREE from 'three/build/three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './Scene.css';

class Scene extends Component {
  counters = {
    a: 0,
    b: 0,
    time: Date.now() * 0.001,
    altTime: Date.now() * 0.000025,
  };
  lights = [];
  objects = {
    particlesParameters: [
      [ [0.80, 1, 0.5], 1.25 ],
      [ [0.75, 1, 0.5], 1 ],
      [ [0.70, 1, 0.5], 0.75 ],
      [ [0.65, 1, 0.5], 0.5 ],
      [ [0.60, 1, 0.5], 0.25 ],
    ],
  };
  componentDidMount() {
    this.sceneSetup();
    this.startAnimationLoop();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  changeParticleColors = () => {
    for (let i = 0; i < this.objects.materials.length; i++) {
      let mats = this.objects.materials;
      let material = this.objects.materials[i];

      let params = this.objects.particlesParameters;
      let grayscale = [params[i][0][0], 0, params[i][0][2]];
      let modifier = 1;

      // let color = [
        // params[i][0][0],
        // modifier * params[i][0][1],
        // params[i][0][2]
      // ];

      // let h = ( 360 * ( color[0] + this.counters.altTime ) % 360 ) / 360;
      material.opacity = Math.abs(Math.cos((i * 10) + this.counters.altTime));
      // material.color.setHSL( h, color[1], color[2] );
    }
  }

  handleWindowResize = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  incrementCounters = () => {
    this.counters.time = Date.now() * 0.001;
    this.counters.altTime = Date.now() * 0.000025;
    this.counters.a += 0.02;
  };

  prepLights = () => {
    const light = new THREE.PointLight(0xffffff, 1, 2000);
    light.position.set(0, 0, 900);
    this.lights.push(light)
    this.scene.add(light);
  }

  prepParticles = () => {
    const geometry = new THREE.Geometry();

    for ( let i = 0; i < 10000; i++ ) {
      let vertex = new THREE.Vector3();
      vertex.x = Math.random() * 1500 - 750;
      vertex.y = Math.random() * 1500 - 750;
      vertex.z = Math.random() * 1500 - 750;
      geometry.vertices.push(vertex);
    }

    let particlesArr = [], materials = [];

    for ( let i = 0; i < this.objects.particlesParameters.length; i++ ) {
      let color = this.objects.particlesParameters[i][0];
      let size  = this.objects.particlesParameters[i][1];

      materials[i] = new THREE.PointsMaterial({ size: size, transparent: true });
      const particles = new THREE.Points( geometry, materials[i] );
      particles.rotation.x = Math.random() * 30;
      particles.rotation.y = Math.random() * 30;
      particles.rotation.z = Math.random() * 30;

      particlesArr.push(particles);
      this.scene.add( particles );
    }

    this.objects.particles1 = particlesArr;
    this.objects.materials = materials;
  }

  rotateParticles = () => {
    for (let i = 0; i < this.objects.particles1.length; i++) {
      let particle = this.objects.particles1[i];
      particle.rotation.x = this.counters.altTime * (i < 4 ? i + 1 : -(i + 1))
    }
  }

  // rotateMaterialOpacity = () => {
    // for (let i = 0; i < this.objects.materials.length; i++) {
      // let material = this.objects.materials[i];
      // material.opacity 
    // }
  // }

  sceneSetup = () => {
    // get container dimensions and use them for scene sizing
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      400,
    );
    this.camera.position.set(0, 0, 50);
    this.camera.lookAt(0, 0, 0);
    this.controls = new OrbitControls(this.camera, this.el);

    // set some distance from a cube that is located at z = 0
    this.camera.position.z = 5;

    this.prepLights();
    this.prepParticles();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.el.appendChild(this.renderer.domElement); // mount using React ref
  };

  startAnimationLoop = () => {
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;

    this.incrementCounters();
    this.rotateParticles();
    this.changeParticleColors();

    this.renderer.render(this.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  render() {
    return <div className="scene" ref={ref => (this.el = ref)} />;
  }
}

export default Scene;
