@WIDTH = 640
@HEIGHT = 480
@BACKGROUND_COLOR = 0x0000000
@VIEW_ANGLE = 45
@NEAR = 1
@FAR = 10000
@CAMERA_DISTANCE = 500
@ASPECT = @WIDTH/@HEIGHT

class Invaders
  constructor: (container) ->
    @container = container
    @_init()
    @_animate()

  _init: ->
    @_createScene()
    @_addRandomInvader()

  _animate: =>
    requestAnimationFrame(@_animate)
    @renderer.render(@scene, @camera)

  _createScene: ->
    @scene = new THREE.Scene()
    @renderer = new THREE.WebGLRenderer()
    @renderer.setSize(WIDTH, HEIGHT)
    @renderer.setClearColorHex(BACKGROUND_COLOR, 1.0)
    @camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
    @camera.position.x = WIDTH/2.0
    @camera.position.y = HEIGHT/2.0
    @camera.position.z = CAMERA_DISTANCE
    @scene.add(@camera)

    light1 = new THREE.DirectionalLight(0xffffff)
    light1.position.set(0, 0, 1).normalize()
    @scene.add(light1)

    @container.appendChild(@renderer.domElement)

  _addRandomInvader: ->
    invader = new Invader(100)
    invader.position.set(WIDTH/2, HEIGHT/2, 0)
    @scene.add(invader)

class Invader extends THREE.Object3D
  constructor: (seed) ->
    super()

    @seed = seed
    @_init()

  _init: ->
    @_createMaterial()
    @_build()

  _build: ->
    cube = new THREE.Mesh(
      new THREE.CubeGeometry(10, 10, 10),
      @material
    )
    @add(cube)

  _createMaterial: ->
    @material = new THREE.MeshPhongMaterial(
      color: 0xFF0000
      shininess: 100.0
      specular: 0xFFFFFF
    )

@startInvaders = ->
  container = document.createElement('div')
  document.body.appendChild(container)
  new Invaders(container)
