@BACKGROUND_COLOR = 0x000000
@WIDTH = 620
@HEIGHT = 480
@VIEW_ANGLE = 45
@NEAR = 1
@FAR = 10000
@CAMERA_DISTANCE = 500
@ASPECT = @WIDTH/@HEIGHT
@WOLFRAM_NUMBER = 154
@GRID_SIZE = 100

class ThreeDCellularAutomata
  constructor: (container, wolframNumber, gridSize) ->
    @container = container
    @wolframNumber = wolframNumber
    @gridSize = gridSize
    @_init()
    @_animate()

  _init: ->
    @_buildGrid() 
    @_createScene()
    @_buildAutomata()

  _animate: =>
    requestAnimationFrame(@_animate)
    timer = 0.0002 * Date.now()
    @camera.position.x = Math.sin(timer)*300 + WIDTH/2
    @camera.position.z = Math.cos(timer)*CAMERA_DISTANCE
    @camera.position.y = Math.cos(timer)*300 + HEIGHT/2
    @camera.lookAt(new THREE.Vector3(400, 500, 0))
    @renderer.render(@scene, @camera)

  _buildGrid: ->
    rule = @_toBinaryArray(@wolframNumber)
    @grid = []
    @grid[i] = [] for i in [0..@gridSize-1]
    @grid[i][j] = 0 for j in [0..@gridSize-1] for i in [0..@gridSize-1]
    @grid[Math.round(@gridSize*0.5)][0] = 1
    @grid[i][j] = @_calculateRule(rule, i, j) for i in [1..@gridSize-2] for j in [1..@gridSize-2]

  _calculateRule: (rule, i, j) ->
    val = @grid[i-1][j-1]*4 + @grid[i][j-1]*2 + @grid[i+1][j-1]
    rule[val]

  _toBinaryArray: (number) ->
    number >> i & 0x01 for i in [0..7]

  _createScene: ->
    @scene = new THREE.Scene()
    @renderer = new THREE.WebGLRenderer()
    @renderer.setSize(WIDTH, HEIGHT)
    @renderer.setClearColorHex(BACKGROUND_COLOR, 1.0)
    @camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
    @camera.position.x = WIDTH/1.5
    @camera.position.y = HEIGHT/1.5
    @camera.position.z = CAMERA_DISTANCE
    @camera.rotation.x = -Math.PI/180 * 5
    @scene.add(@camera)

    light1 = new THREE.DirectionalLight(0xffffff)
    light1.position.set(1, 1, 1).normalize()
    @scene.add(light1)

    light2 = new THREE.DirectionalLight(0xffffff)
    light2.position.set(-1, -1, -1).normalize()
    @scene.add(light2)

    light3 = new THREE.PointLight(0xffffff)
    light3.position.set(WIDTH/2, HEIGHT/2, 400)
    @scene.add(light3)

    light4 = new THREE.PointLight(0xffffff)
    light4.position.set(WIDTH/2, HEIGHT/2, -400)
    @scene.add(light4)

    @container.appendChild(@renderer.domElement)

  _buildAutomata: ->
    @_buildCube(i, j) for j in [0..@gridSize-1] for i in [0..@gridSize-1]

  _buildCube: (i, j) ->
    return unless @grid[i][j] is 1
    material = new THREE.MeshPhongMaterial(
      color: (j%255 << 16) + (100 << 8) + 255
      shininess: 100.0
      specular: 0xffffff
    )
    cube = new THREE.Mesh(
      new THREE.CubeGeometry(10, 10, 10),
      material
    )
    cube.position.set(i*10, j*10, 0)
    @scene.add(cube)

@start3DCA = (container) ->
  unless container?
    container = document.createElement('div')
    document.body.appendChild(container)

  new ThreeDCellularAutomata(container, WOLFRAM_NUMBER, GRID_SIZE)
