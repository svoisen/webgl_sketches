(function() {
  var Ball, Bounce;

  this.VIEW_ANGLE = 45;

  this.WIDTH = 800;

  this.HEIGHT = 600;

  this.NEAR = 0.1;

  this.FAR = 10000;

  this.ASPECT = this.WIDTH / this.HEIGHT;

  Bounce = (function() {

    function Bounce(container) {
      this.createScene(container);
      this.createLights();
      this.addBallToScene(new Ball(50));
      this.render();
    }

    Bounce.prototype.createScene = function(container) {
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setSize(WIDTH, HEIGHT);
      this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
      this.camera.position.z = 300;
      this.scene.add(this.camera);
      container.appendChild(this.renderer.domElement);
      this.renderer.setClearColorHex(0x000000, 1.0);
      return this.scene;
    };

    Bounce.prototype.createLights = function() {
      var pointLight;
      pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.x = 10;
      pointLight.position.y = 50;
      pointLight.position.z = 130;
      return this.scene.add(pointLight);
    };

    Bounce.prototype.addBallToScene = function(ball) {
      return this.scene.add(ball.mesh);
    };

    Bounce.prototype.render = function() {
      return this.renderer.render(this.scene, this.camera);
    };

    return Bounce;

  })();

  Ball = (function() {

    function Ball(radius) {
      this.radius = radius;
      this.createMaterial();
      this.createMesh();
    }

    Ball.prototype.createMaterial = function() {
      return this.material = new THREE.MeshPhongMaterial({
        color: 0xcc0000
      });
    };

    Ball.prototype.createMesh = function() {
      return this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 16, 16), this.material);
    };

    return Ball;

  })();

  this.startBounce = function() {
    var container;
    container = document.createElement('div');
    document.body.appendChild(container);
    return new Bounce(container);
  };

}).call(this);
