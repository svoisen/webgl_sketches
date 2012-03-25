(function() {
  var PhiloBall;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  PhiloBall = (function() {
    function PhiloBall(canvas) {
      this.setupElement = __bind(this.setupElement, this);
      this.onLoad = __bind(this.onLoad, this);      this.sphere = new PhiloGL.O3D.Sphere({
        colors: [0.5, 0, 0.8, 1],
        nlat: 30,
        nlong: 30,
        radius: 1
      });
      PhiloGL(canvas, {
        onLoad: this.onLoad,
        camera: {
          position: {
            x: 0,
            y: 0,
            z: -7
          }
        }
      });
    }
    PhiloBall.prototype.onLoad = function(app) {
      var camera, canvas, gl, lights, program, scene;
      gl = app.gl;
      canvas = app.canvas;
      program = app.program;
      camera = app.camera;
      scene = app.scene;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clearDepth(1);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      scene.add(this.sphere);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      lights = scene.config.lights;
      lights.enable = true;
      lights.ambient = {
        r: 0.2,
        g: 0.2,
        b: 0.2
      };
      lights.directional = {
        color: {
          r: 0.8,
          g: 0.8,
          b: 0.8
        },
        direction: {
          x: -1.0,
          y: -1.0,
          z: -1.0
        }
      };
      return scene.render();
    };
    PhiloBall.prototype.setupElement = function(element, view, program, camera) {
      element.update();
      view.mulMat42(camera.view, element.matrix);
      program.setBuffers({
        'aVertexPosition': {
          value: element.vertices,
          size: 3
        },
        'aVertexColor': {
          value: element.colors,
          size: 4
        }
      });
      program.setUniform('uMVMatrix', view);
      return program.setUniform('uPMatrix', camera.projection);
    };
    return PhiloBall;
  })();
  this.start = function(canvas) {
    return new PhiloBall(canvas);
  };
}).call(this);
