@WIDTH = 640
@HEIGHT = 480
@BACKGROUND_COLOR = 0x0000000
@VIEW_ANGLE = 45
@NEAR = 1
@FAR = 10000
@CAMERA_DISTANCE = 300
@ASPECT = @WIDTH/@HEIGHT
@INVADER_SIZE = 5
@CUBE_SIZE = 20
@GRAVITY = -0.5

class Invaders
  constructor: (container) ->
    @container = container
    @_init()
    @_animate()

    return this

  _init: ->
    @_createScene()
    @_addLights()
    @_addRandomInvader()
    @_setupEvents()

  _setupEvents: ->
    window.addEventListener("keydown", @_keyDownHandler)

  _animate: =>
    requestAnimationFrame(@_animate)
    timer = 0.001 * Date.now()
    @_updateCameraAnimation(timer)
    @_updateInvadersAnimations(timer)

  _updateCameraAnimation: (timer) ->
    return unless @camera?
    @camera.position.x = Math.sin(timer)*CAMERA_DISTANCE
    @camera.position.z = Math.cos(timer)*CAMERA_DISTANCE
    @camera.lookAt(new THREE.Vector3(0, 0, 0))
    @renderer.render(@scene, @camera)

  _updateInvadersAnimations: (timer) ->
    return unless @invaders?
    invader.updateAnimation(timer) for invader in @invaders

  _createScene: ->
    @scene = new THREE.Scene()
    @renderer = new THREE.WebGLRenderer()
    @renderer.setSize(WIDTH, HEIGHT)
    @renderer.setClearColorHex(BACKGROUND_COLOR, 1.0)
    @camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
    @camera.position.x = 0
    @camera.position.y = 0
    @camera.position.z = CAMERA_DISTANCE
    @scene.add(@camera)

  _addLights: ->
    # light1 = new THREE.DirectionalLight(0xffffff)
    # light1.position.set(1, 1, 1).normalize()
    # @scene.add(light1)

    # light2 = new THREE.DirectionalLight(0xffffff)
    # light2.position.set(-1, -1, -1).normalize()
    # @scene.add(light2)

    light3 = new THREE.PointLight(0xffffff)
    light3.position.set(WIDTH/2, HEIGHT/2, 400)
    @scene.add(light3)

    light4 = new THREE.PointLight(0xffffff)
    light4.position.set(-WIDTH/2, HEIGHT/2, -400)
    @scene.add(light4)
    @container.appendChild(@renderer.domElement)

  _addRandomInvader: ->
    @invaders ||= []
    invader = new Invader(Math.random()*32768)
    invader.position.set(0, 0, 0)
    @scene.add(invader)
    @invaders.push(invader)

  _destroyInvaders: ->
    return unless @invaders?
    console.log @invaders.length
    invader.destroy() for invader in @invaders

  _keyDownHandler: (event) =>
    @_destroyInvaders() if event.keyCode == 32

class Invader extends THREE.Object3D
  constructor: (seed) ->
    super()
    @seed = seed
    @_init()

    return this

  updateAnimation: (timer) ->
    for cube in @cubes
      cube.vy += cube.gravity
      cube.position.x += cube.vx
      cube.position.y += cube.vy
      cube.position.z += cube.vz

  destroy: ->
    for cube in @cubes
      cube.vx = Math.random()*20 - 10
      cube.vy = Math.random()*20
      cube.vz = Math.random()*20 - 10
      cube.gravity = GRAVITY

  _init: ->
    @_createMaterial()
    @_build()

  _build: ->
    configuration = @_generateConfiguration(@seed)
    totalCubes = configuration.length
    row = 0
    offset = INVADER_SIZE * CUBE_SIZE * 0.5

    for i in [0..totalCubes]
      row++ if i % INVADER_SIZE == 0 and i > 0
      if configuration[i] == "1"
        cube = @_generateCube(CUBE_SIZE)
        cube.position.x = (i % INVADER_SIZE) * CUBE_SIZE - offset
        cube.position.y = row * CUBE_SIZE - offset
        cube.vx = cube.vy = cube.vz = 0
        cube.gravity = 0
        @_addCube(cube)

  _addCube: (cube) ->
    @cubes ||= []
    @cubes.push(cube)
    @add(cube)

  _generateCube: (size) ->
    cube = new THREE.Mesh(
      new THREE.CubeGeometry(size, size, size),
      @material
    )

  _generateConfiguration: (seed) ->
    configuration = []
    binarySeed = Util.decimal2BinaryString(seed)
    totalCubes = INVADER_SIZE * INVADER_SIZE
    seedPosition = 0
    row = 0

    # Generate a vertically symmetrical configuration
    for i in [0..totalCubes]
      row++ if i % INVADER_SIZE == 0 and i > 0

      if i % INVADER_SIZE < Math.ceil(INVADER_SIZE/2)
        configuration[i] = binarySeed[seedPosition++]
      else
        configuration[i] = configuration[(row*INVADER_SIZE) + (INVADER_SIZE - 1 - i%INVADER_SIZE)]

    return configuration

  _createMaterial: ->
    @material = new THREE.MeshPhongMaterial(
      color: 0xFF0000
      shininess: 100.0
      specular: 0xFFFFFF
    )

class Util 
  @decimal2BinaryString: (number, precision) ->
    out = ""

    while number > 0
      out = if number % 2 > 0 then "1" + out else "0" + out
      number = Math.floor(number / 2)

    out = "0" + out while out.length < precision - 1
    
    return out

@startInvaders = ->
  container = document.createElement('div')
  document.body.appendChild(container)
  new Invaders(container)
