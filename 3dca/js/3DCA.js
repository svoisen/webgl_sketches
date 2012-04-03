(function() {
  var ThreeDCellularAutomata;

  this.BACKGROUND_COLOR = 0x000000;

  this.WIDTH = 800;

  this.HEIGHT = 600;

  this.VIEW_ANGLE = 45;

  this.NEAR = 0.1;

  this.FAR = 10000;

  this.ASPECT = this.WIDTH / this.HEIGHT;

  ThreeDCellularAutomata = (function() {

    function ThreeDCellularAutomata(container, wolframNumber, gridSize) {
      this.container = container;
      this.wolframNumber = wolframNumber;
      this.gridSize = gridSize;
      this._init();
    }

    ThreeDCellularAutomata.prototype._init = function() {
      this._buildGrid();
      this._createScene();
      return this._buildAutomata();
    };

    ThreeDCellularAutomata.prototype._buildGrid = function() {
      var i, j, rule, _ref, _ref2, _results;
      rule = _toBinaryArray(this.wolframNumber);
      for (i = 0, _ref = this.gridSize; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        this.grid[i][0] = 0;
      }
      this.grid[Math.round(this.gridSize * 0.5)][0] = 1;
      _results = [];
      for (i = 0, _ref2 = this.gridSize; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
        _results.push((function() {
          var _ref3, _results2;
          _results2 = [];
          for (j = 0, _ref3 = this.gridSize; 0 <= _ref3 ? j <= _ref3 : j >= _ref3; 0 <= _ref3 ? j++ : j--) {
            _results2.push(this.grid[i][j] = this._calculateRule(rule, i, j));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    ThreeDCellularAutomata.prototype._calculateRule = function(rule, i, j) {
      var val;
      val = this.grid[i - 1][j - 1] * 4 + this.grid[i][j - 1] * 2 + this.grid[i + 1][j - 1];
      return rule[val];
    };

    ThreeDCellularAutomata.prototype._toBinaryArray = function(number) {
      var i, _results;
      _results = [];
      for (i = 0; i <= 7; i++) {
        _results.push(ret[i] = number >> i & 0x01);
      }
      return _results;
    };

    ThreeDCellularAutomata.prototype._createScene = function() {
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setSize(WIDTH, HEIGHT);
      this.renderer.setClearColorHex(BACKGROUND_COLOR, 1.0);
      this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
      this.camera.setPosition(WIDTH / 2, HEIGHT / 2, 1000);
      this.scene.add(this.camera);
      return this.container.appendChild(this.renderer.domElement);
    };

    ThreeDCellularAutomata.prototype._buildAutomata = function() {
      var i, j, _ref, _results;
      _results = [];
      for (i = 0, _ref = this.gridSize; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (j = 0, _ref2 = this.gridSize; 0 <= _ref2 ? j <= _ref2 : j >= _ref2; 0 <= _ref2 ? j++ : j--) {
            _results2.push(this._buildCube(i, j));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    ThreeDCellularAutomata.prototype._buildCube = function(i, j) {
      if (this.grid[i][j] !== 1) {}
    };

    return ThreeDCellularAutomata;

  })();

  this.start3DCA = function() {
    var container;
    container = document.createElement('div');
    document.body.appendChild(container);
    return new ThreeDCellularAutomata(container, 154, 100);
  };

}).call(this);
