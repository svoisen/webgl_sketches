(function() {
  var Ball, Bounce,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.VIEW_ANGLE = 45;

  this.WIDTH = 800;

  this.HEIGHT = 600;

  this.NEAR = 0.1;

  this.FAR = 1000;

  this.ASPECT = this.WIDTH / this.HEIGHT;

  this.GRAVITY = -0.5;

  Bounce = (function() {

    function Bounce(container) {
      this.animate = __bind(this.animate, this);      this.createScene(container);
      this.createLights();
      this.ball = this.addBallToScene(new Ball(50));
      this.animate();
    }

    Bounce.prototype.createScene = function(container) {
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setSize(WIDTH, HEIGHT);
      this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
      this.camera.position.z = 800;
      this.scene.add(this.camera);
      container.appendChild(this.renderer.domElement);
      this.renderer.setClearColorHex(0x000000, 1.0);
      return this.scene;
    };

    Bounce.prototype.createLights = function() {
      var pointLight, pointLight2;
      pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.x = 0;
      pointLight.position.y = 0;
      pointLight.position.z = 130;
      this.scene.add(pointLight);
      pointLight2 = new THREE.PointLight(0xffffff);
      pointLight2.position.x = WIDTH / 2;
      pointLight2.position.y = HEIGHT / 2;
      return pointLight2.position.z = 130;
    };

    Bounce.prototype.addBallToScene = function(ball) {
      this.scene.add(ball.mesh);
      return ball;
    };

    Bounce.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      this.ball.update();
      return this.renderer.render(this.scene, this.camera);
    };

    return Bounce;

  })();

  Ball = (function() {

    function Ball(radius) {
      this.radius = radius;
      this._init();
    }

    Ball.prototype.update = function() {
      var pos;
      pos = this.mesh.position;
      pos.addSelf(this.velocity);
      if (pos.x + this.radius > WIDTH / 2) {
        pos.set(WIDTH / 2 - this.radius, pos.y, pos.z);
        this.velocity.set(this.velocity.x * -0.8, this.velocity.y, this.velocity.z);
      } else if (pos.x - this.radius < -WIDTH / 2) {
        pos.set(-WIDTH / 2 + this.radius, pos.y, pos.z);
        this.velocity.set(this.velocity.x * -0.8, this.velocity.y, this.velocity.z);
      }
      if (pos.y + this.radius > HEIGHT / 2) {
        pos.set(pos.x, HEIGHT / 2 - this.radius, pos.z);
        this.velocity.set(this.velocity.x, this.velocity.y * -0.95, this.velocity.z);
      } else if (pos.y - this.radius < -HEIGHT / 2) {
        pos.set(pos.x, -HEIGHT / 2 + this.radius, pos.z);
        this.velocity.set(this.velocity.x, this.velocity.y * -0.95, this.velocity.z);
      }
      return this.velocity.set(this.velocity.x, this.velocity.y + GRAVITY, this.velocity.z);
    };

    Ball.prototype._init = function() {
      this._createMaterial();
      this._createMesh();
      return this.velocity = new THREE.Vector3(5, 5, 0);
    };

    Ball.prototype._createMaterial = function() {
      return this.material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shininess: 100
      });
    };

    Ball.prototype._createMesh = function() {
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
