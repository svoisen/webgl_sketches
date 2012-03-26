@VIEW_ANGLE = 45
@WIDTH = 800
@HEIGHT = 600
@NEAR = 0.1
@FAR = 10000
@ASPECT = @WIDTH/@HEIGHT

class Bounce
  constructor: (container) ->
    @createScene(container)
    @createLights()
    @addBallToScene(new Ball(50))
    @render()
    
  createScene: (container) ->
    @scene = new THREE.Scene()
    @renderer = new THREE.WebGLRenderer(
      antialias: true
    )
    @renderer.setSize(WIDTH, HEIGHT)
    @camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
    @camera.position.z = 300
    @scene.add(@camera)
    container.appendChild(@renderer.domElement)
    @renderer.setClearColorHex(0x000000, 1.0)
    @scene

  createLights: ->
    pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.x = 10
    pointLight.position.y = 50
    pointLight.position.z = 130
    @scene.add(pointLight)

  addBallToScene: (ball) ->
    @scene.add(ball.mesh)

  render: ->
    @renderer.render(@scene, @camera)

class Ball
  constructor: (radius) ->
    @radius = radius
    @createMaterial()
    @createMesh()

  createMaterial: ->
    @material = new THREE.MeshPhongMaterial(
      color: 0xcc0000
    )

  createMesh: ->
    @mesh = new THREE.Mesh(
      new THREE.SphereGeometry(@radius, 16, 16),
      @material
    )

@startBounce = ->
  container = document.createElement('div')
  document.body.appendChild(container)
  new Bounce(container)
