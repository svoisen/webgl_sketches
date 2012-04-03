@BACKGROUND_COLOR = 0x000000
@WIDTH = 800
@HEIGHT = 600
@VIEW_ANGLE = 45
@NEAR = 0.1
@FAR = 10000
@ASPECT = @WIDTH/@HEIGHT

class ThreeDCellularAutomata
  constructor: (container, wolframNumber, gridSize) ->
    @container = container
    @wolframNumber = wolframNumber
    @gridSize = gridSize
    @_init()

  _init: ->
    @_buildGrid() 
    @_createScene()
    @_buildAutomata()

  _buildGrid: ->
    rule = _toBinaryArray(@wolframNumber)
    @grid[i][0] = 0 for i in [0..@gridSize]
    @grid[Math.round(@gridSize*0.5)][0] = 1
    @grid[i][j] = @_calculateRule(rule, i, j) for j in [0..@gridSize] for i in [0..@gridSize]

  _calculateRule: (rule, i, j) ->
    val = @grid[i-1][j-1]*4 + @grid[i][j-1]*2 + @grid[i+1][j-1]
    rule[val]

  _toBinaryArray: (number) ->
    ret[i] = number >> i & 0x01 for i in [0..7]

  _createScene: ->
    @scene = new THREE.Scene()
    @renderer = new THREE.WebGLRenderer(
      antialias: true
    )
    @renderer.setSize(WIDTH, HEIGHT)
    @renderer.setClearColorHex(BACKGROUND_COLOR, 1.0)
    @camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
    @camera.setPosition(WIDTH/2, HEIGHT/2, 1000)
    @scene.add(@camera)
    @container.appendChild(@renderer.domElement)

  _buildAutomata: ->
    @_buildCube(i, j) for j in [0..@gridSize] for i in [0..@gridSize]

  _buildCube: (i, j) ->
    return unless @grid[i][j] is 1

    material = new THREE.MeshPhongMaterial(
      color: 0xcc0000
      shininess: 80
    )

    cube = new THREE.Mesh(
      new THREE.CubeGeometry()
    )

@start3DCA = ->
  container = document.createElement('div')
  document.body.appendChild(container)
  new ThreeDCellularAutomata(container, 154, 100)
