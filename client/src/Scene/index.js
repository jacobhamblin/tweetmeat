import React, { Component } from 'react';
import * as THREE from 'three/build/three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TextSprite from '@seregpie/three.text-sprite';

import './Scene.css';

class Scene extends Component {
  counters = {
    a: 0,
    b: 0,
    time: Date.now() * 0.001,
    altTime: Date.now() * 0.000025,
  };
  lights = [];
  mouse = new THREE.Vector2();
  objects = {
    particlesParameters: [
      [[0.8, 1, 0.5], 1.25],
      [[0.75, 1, 0.5], 1],
      [[0.7, 1, 0.5], 0.75],
      [[0.65, 1, 0.5], 0.5],
      [[0.6, 1, 0.5], 0.25],
    ],
    tweets: [],
  };
  raycaster = {
    raycaster: new THREE.Raycaster(),
    intersection: false,
  };
  componentDidMount() {
    this.sceneSetup();
    this.startAnimationLoop();
    window.addEventListener('resize', this.handleWindowResize);
    window.addEventListener('mousemove', this.handleMouseMove, false);
    window.addEventListener('click', this.maybeOpenLink, false);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tweets !== this.props.tweets)
      this.prepTweets(this.props.tweets);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('click', this.maybeOpenLink, false);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  prepTweets = tweets => {
    for (let i = 0; i < this.objects.tweets.length; i++) {
      const tweet = this.objects.tweets[i];
      this.scene.remove(tweet);
    }
    this.objects.tweets = [];
    for (let i = 0; i < tweets.length; i++) {
      const text = tweets[i].text.match(/.{1,50}/g).join('\n');
      const url = `https://twitter.com/${tweets[i].user.screen_name}/status/${
        tweets[i].id_str
      }`;
      const tweet = new TextSprite({
        text,
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 8,
        fillColor: '#ffbbff',
        position: (20, 0, 50),
      });
      tweet.position.x = Math.random() * 1000 - 500;
      tweet.position.y = Math.random() * 1000 - 500;
      tweet.position.z = Math.random() * 1000 - 500;
      tweet.sway = { x: Math.random(), y: Math.random(), z: Math.random() };
      tweet.url = url;
      tweet.userData.url = url;
      tweet.material.opacity = 0;
      this.scene.add(tweet);
      this.objects.tweets.push(tweet);
    }
  };

  changeParticleOpacity = () => {
    for (let i = 0; i < this.objects.materials.length; i++) {
      this.objects.materials[i].opacity = Math.abs(
        Math.cos(i * 10 + this.counters.altTime),
      );
    }
  };

  isHovered = el => {
    return el.parentElement.querySelector(':hover') === el;
  };

  tweekTweets = () => {
    for (let i = 0; i < this.objects.tweets.length; i++) {
      const tweet = this.objects.tweets[i];
      tweet.position.x += Math.cos(this.counters.time * tweet.sway.x) / 50;
      tweet.position.y += Math.sin(this.counters.time * tweet.sway.y) / 50;
      if (tweet.material.opacity < 1) {
        if (i % 2) tweet.material.opacity += 0.0001;
        if (i % 5) tweet.material.opacity += 0.002;
        if (i % 7) tweet.material.opacity += 0.001;
      }
    }
  };

  handleIntersection = () => {
    this.raycaster.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.raycaster.intersectObjects(
      this.scene.children,
    );

    const loginModal = document.querySelector('.modal-bg');
    const rightCol = document.querySelector('.column.right');
    if (!intersects[0] || this.isHovered(loginModal) || this.isHovered(rightCol)) {
      this.raycaster.intersection = undefined;
      document.body.style.cursor = 'initial';
    } else {
      document.body.style.cursor = 'pointer';
    }
    let tempIntersection = intersects[0] && intersects[0].object;

    if (this.raycaster.intersection !== tempIntersection)
      this.raycaster.intersection = tempIntersection;
  };

  handleWindowResize = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  handleMouseMove = event => {
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  maybeOpenLink = event => {
    if (!this.raycaster.intersection) return;
    event.preventDefault();
    window.open(this.raycaster.intersection.url, '_blank');
  };

  incrementCounters = () => {
    this.counters.time = Date.now() * 0.001;
    this.counters.altTime = Date.now() * 0.000025;
    this.counters.a += 0.02;
  };

  prepLights = () => {
    const light = new THREE.PointLight(0xffffff, 1, 2000);
    light.position.set(0, 0, 900);
    this.lights.push(light);
    this.scene.add(light);
  };

  prepParticles = () => {
    const geometry = new THREE.Geometry();

    for (let i = 0; i < 10000; i++) {
      let vertex = new THREE.Vector3();
      vertex.x = Math.random() * 1500 - 750;
      vertex.y = Math.random() * 1500 - 750;
      vertex.z = Math.random() * 1500 - 750;
      geometry.vertices.push(vertex);
    }

    let particlesArr = [],
      materials = [];

    for (let i = 0; i < this.objects.particlesParameters.length; i++) {
      let color = this.objects.particlesParameters[i][0];
      let size = this.objects.particlesParameters[i][1];

      materials[i] = new THREE.PointsMaterial({
        size: size,
        transparent: true,
      });
      const particles = new THREE.Points(geometry, materials[i]);
      particles.rotation.x = Math.random() * 30;
      particles.rotation.y = Math.random() * 30;
      particles.rotation.z = Math.random() * 30;

      particlesArr.push(particles);
      this.scene.add(particles);
    }

    this.objects.particles1 = particlesArr;
    this.objects.materials = materials;
  };

  rotateParticles = () => {
    for (let i = 0; i < this.objects.particles1.length; i++) {
      let particle = this.objects.particles1[i];
      particle.rotation.x = this.counters.altTime * (i < 4 ? i + 1 : -(i + 1));
    }
  };

  sceneSetup = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      650,
    );
    this.camera.position.set(0, 0, 50);
    this.camera.lookAt(0, 0, 0);
    this.controls = new OrbitControls(this.camera, this.el);

    // set some distance from a cube that is located at z = 0
    // this.camera.position.z = 5;

    this.prepLights();
    this.prepParticles();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x222222);
    this.el.appendChild(this.renderer.domElement); // mount using React ref
  };

  startAnimationLoop = () => {
    this.incrementCounters();
    this.handleIntersection();
    this.rotateParticles();
    this.changeParticleOpacity();
    this.tweekTweets();

    this.renderer.render(this.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  render() {
    return <div className="scene" ref={ref => (this.el = ref)} />;
  }
}

export default Scene;
