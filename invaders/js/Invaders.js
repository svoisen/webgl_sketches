// Generated by CoffeeScript 1.3.1
(function() {
  var Invader, Invaders, Util,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  this.WIDTH = 640;

  this.HEIGHT = 480;

  this.BACKGROUND_COLOR = 0x0000000;

  this.VIEW_ANGLE = 45;

  this.NEAR = 1;

  this.FAR = 10000;

  this.CAMERA_DISTANCE = 300;

  this.ASPECT = this.WIDTH / this.HEIGHT;

  this.INVADER_SIZE = 5;

  this.CUBE_SIZE = 20;

  Invaders = (function() {

    Invaders.name = 'Invaders';

    function Invaders(container) {
      this._animate = __bind(this._animate, this);
      this.container = container;
      this._init();
      this._animate();
    }

    Invaders.prototype._init = function() {
      this._createScene();
      return this._addRandomInvader();
    };

    Invaders.prototype._animate = function() {
      var timer;
      requestAnimationFrame(this._animate);
      timer = 0.001 * Date.now();
      this.camera.position.x = Math.sin(timer) * CAMERA_DISTANCE;
      this.camera.position.z = Math.cos(timer) * CAMERA_DISTANCE;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      return this.renderer.render(this.scene, this.camera);
    };

    Invaders.prototype._createScene = function() {
      var light3, light4;
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(WIDTH, HEIGHT);
      this.renderer.setClearColorHex(BACKGROUND_COLOR, 1.0);
      this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = CAMERA_DISTANCE;
      this.scene.add(this.camera);
      light3 = new THREE.PointLight(0xffffff);
      light3.position.set(WIDTH / 2, HEIGHT / 2, 400);
      this.scene.add(light3);
      light4 = new THREE.PointLight(0xffffff);
      light4.position.set(-WIDTH / 2, HEIGHT / 2, -400);
      this.scene.add(light4);
      return this.container.appendChild(this.renderer.domElement);
    };

    Invaders.prototype._addRandomInvader = function() {
      var invader;
      invader = new Invader(Math.random() * 32768);
      invader.position.set(0, 0, 0);
      return this.scene.add(invader);
    };

    return Invaders;

  })();

  Invader = (function(_super) {

    __extends(Invader, _super);

    Invader.name = 'Invader';

    function Invader(seed) {
      Invader.__super__.constructor.call(this);
      this.seed = seed;
      this._init();
    }

    Invader.prototype._init = function() {
      this._createMaterial();
      return this._build();
    };

    Invader.prototype._build = function() {
      var configuration, cube, i, offset, row, totalCubes, _i, _results;
      configuration = this._generateConfiguration(this.seed);
      totalCubes = configuration.length;
      row = 0;
      offset = INVADER_SIZE * CUBE_SIZE * 0.5;
      _results = [];
      for (i = _i = 0; 0 <= totalCubes ? _i <= totalCubes : _i >= totalCubes; i = 0 <= totalCubes ? ++_i : --_i) {
        if (i % INVADER_SIZE === 0 && i > 0) {
          row++;
        }
        if (configuration[i] === "1") {
          cube = this._generateCube(CUBE_SIZE);
          cube.position.x = (i % INVADER_SIZE) * CUBE_SIZE - offset;
          cube.position.y = row * CUBE_SIZE - offset;
          _results.push(this._addCube(cube));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Invader.prototype._addCube = function(cube) {
      this.cubes || (this.cubes = []);
      this.cubes.push(cube);
      return this.add(cube);
    };

    Invader.prototype._generateCube = function(size) {
      var cube;
      return cube = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), this.material);
    };

    Invader.prototype._generateConfiguration = function(seed) {
      var binarySeed, configuration, i, row, seedPosition, totalCubes, _i;
      configuration = [];
      binarySeed = Util.decimal2BinaryString(seed);
      totalCubes = INVADER_SIZE * INVADER_SIZE;
      seedPosition = 0;
      row = 0;
      for (i = _i = 0; 0 <= totalCubes ? _i <= totalCubes : _i >= totalCubes; i = 0 <= totalCubes ? ++_i : --_i) {
        if (i % INVADER_SIZE === 0 && i > 0) {
          row++;
        }
        if (i % INVADER_SIZE < Math.ceil(INVADER_SIZE / 2)) {
          configuration[i] = binarySeed[seedPosition++];
        } else {
          configuration[i] = configuration[(row * INVADER_SIZE) + (INVADER_SIZE - 1 - i % INVADER_SIZE)];
        }
      }
      return configuration;
    };

    Invader.prototype._createMaterial = function() {
      return this.material = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
        shininess: 100.0,
        specular: 0xFFFFFF
      });
    };

    return Invader;

  })(THREE.Object3D);

  Util = (function() {

    Util.name = 'Util';

    function Util() {}

    Util.decimal2BinaryString = function(number, precision) {
      var out;
      out = "";
      while (number > 0) {
        out = number % 2 > 0 ? "1" + out : "0" + out;
        number = Math.floor(number / 2);
      }
      while (out.length < precision - 1) {
        out = "0" + out;
      }
      return out;
    };

    return Util;

  })();

  this.startInvaders = function() {
    var container;
    container = document.createElement('div');
    document.body.appendChild(container);
    return new Invaders(container);
  };

}).call(this);
