(function() {
  var Ball, Bounce, Wall,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.BACKGROUND_COLOR = 0xffffff;

  this.DEFAULT_BALL_RADIUS = 50;

  this.DEFAULT_GRAVITY = 0.5;

  this.DEFAULT_ELASTICITY = 0.95;

  this.VIEW_ANGLE = 45;

  this.WIDTH = 800;

  this.HEIGHT = 600;

  this.NEAR = 0.1;

  this.FAR = 10000;

  this.ASPECT = this.WIDTH / this.HEIGHT;

  Bounce = (function() {

    function Bounce(container) {
      this._animate = __bind(this._animate, this);      this.container = container;
      this.balls = [];
      this._init();
    }

    Bounce.prototype.addBall = function(radius) {
      var ball;
      ball = new Ball(radius, new THREE.Vector3(WIDTH / 2, HEIGHT / 2, 0));
      this.balls.push(ball);
      return this.scene.add(ball.mesh);
    };

    Bounce.prototype._init = function() {
      this._createScene();
      this._createLights();
      this.addBall(DEFAULT_BALL_RADIUS);
      return this._animate();
    };

    Bounce.prototype._createScene = function() {
      var backGeometry, backMaterial, backWall, floor, leftWall, wallGeometry, wallMaterial;
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setSize(WIDTH, HEIGHT);
      this.renderer.setClearColorHex(BACKGROUND_COLOR, 1.0);
      this.renderer.shadowMapEnabled = true;
      this.renderer.shadowMapSoft = false;
      this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
      this.camera.position.x = WIDTH / 2;
      this.camera.position.y = HEIGHT / 2;
      this.camera.position.z = 1000;
      this.scene.add(this.camera);
      this.container.appendChild(this.renderer.domElement);
      wallGeometry = new THREE.PlaneGeometry(WIDTH, WIDTH, 1, 1);
      wallMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
      });
      floor = new THREE.Mesh(wallGeometry, wallMaterial);
      floor.rotation.x = -90 * Math.PI / 180;
      floor.position.set(WIDTH / 2, 0, 0);
      floor.receiveShadow = true;
      this.scene.add(floor);
      leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
      leftWall.rotation.y = 90 * Math.PI / 180;
      leftWall.position.set(0, WIDTH / 2, 0);
      leftWall.receiveShadow = true;
      this.scene.add(leftWall);
      backGeometry = new THREE.PlaneGeometry(WIDTH, WIDTH, 1, 1);
      backMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
      });
      backWall = new THREE.Mesh(backGeometry, backMaterial);
      backWall.position.set(WIDTH / 2, WIDTH / 2, -WIDTH / 2);
      backWall.receiveShadow = false;
      return this.scene.add(backWall);
    };

    Bounce.prototype._createLights = function() {
      var spot;
      spot = new THREE.SpotLight(0xffffff, 1.0);
      spot.position.set(WIDTH / 1.5, HEIGHT + HEIGHT / 2, 0);
      spot.target.position.set(WIDTH / 2, 0, 0);
      spot.castShadow = true;
      this.scene.add(spot);
      return this.scene.add(spot.target);
    };

    Bounce.prototype._animate = function() {
      var ball, _i, _len, _ref;
      requestAnimationFrame(this._animate);
      _ref = this.balls;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ball = _ref[_i];
        ball.update();
      }
      return this.renderer.render(this.scene, this.camera);
    };

    return Bounce;

  })();

  Wall = (function() {

    function Wall() {
      this._init();
    }

    Wall.prototype._init = function() {};

    return Wall;

  })();

  Ball = (function() {

    function Ball(radius, position) {
      this.radius = radius;
      this.elasticity = DEFAULT_ELASTICITY;
      this.gravity = DEFAULT_GRAVITY;
      this._init(position);
    }

    Ball.prototype.update = function() {
      var pos, rad, vel;
      pos = this.mesh.position;
      rad = this.radius;
      vel = this.velocity;
      pos.addSelf(vel);
      if (pos.x + rad > WIDTH) {
        pos.set(WIDTH - rad, pos.y, pos.z);
        this._bounceX();
      } else if (pos.x - rad < 0) {
        pos.set(rad, pos.y, pos.z);
        this._bounceX();
      }
      if (pos.y + rad > HEIGHT) {
        pos.set(pos.x, HEIGHT - rad, pos.z);
        this._bounceY();
      } else if (pos.y - rad < 0) {
        pos.set(pos.x, rad, pos.z);
        this._bounceY();
      }
      return vel.set(vel.x, vel.y - this.gravity, vel.z);
    };

    Ball.prototype._bounceX = function() {
      var vel;
      vel = this.velocity;
      return vel.set(vel.x * -1 * this.elasticity, vel.y, vel.z);
    };

    Ball.prototype._bounceY = function() {
      var vel;
      vel = this.velocity;
      return vel.set(vel.x, vel.y * -1 * this.elasticity, vel.z);
    };

    Ball.prototype._init = function(position) {
      this._createMaterial();
      this._createMesh();
      this.mesh.position = position;
      return this.velocity = new THREE.Vector3(5, 5, 0);
    };

    Ball.prototype._createMaterial = function() {
      return this.material = new THREE.MeshPhongMaterial({
        color: 0xcc0000,
        shininess: 80
      });
    };

    Ball.prototype._createMesh = function() {
      this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 16, 16), this.material);
      return this.mesh.castShadow = true;
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
