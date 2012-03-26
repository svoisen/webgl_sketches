@VIEW_ANGLE = 45
@WIDTH = 800
@HEIGHT = 600
@NEAR = 0.1
@FAR = 1000
@ASPECT = @WIDTH/@HEIGHT
@GRAVITY = -0.5

class Bounce
  constructor: (container) ->
    @createScene(container)
    @createLights()
    @ball = @addBallToScene(new Ball(50))
    @animate()
    
  createScene: (container) ->
    @scene = new THREE.Scene()
    @renderer = new THREE.WebGLRenderer(
      antialias: true
    )
    @renderer.setSize(WIDTH, HEIGHT)
    @camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
    @camera.position.z = 800
    @scene.add(@camera)
    container.appendChild(@renderer.domElement)
    @renderer.setClearColorHex(0x000000, 1.0)
    @scene

  createLights: ->
    pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.x = 0
    pointLight.position.y = 0
    pointLight.position.z = 130
    @scene.add(pointLight)

    pointLight2 = new THREE.PointLight(0xffffff)
    pointLight2.position.x = WIDTH/2
    pointLight2.position.y = HEIGHT/2
    pointLight2.position.z = 130
    #@scene.add(pointLight2)

  addBallToScene: (ball) ->
    @scene.add(ball.mesh)
    ball

  animate: =>
    requestAnimationFrame(@animate)
    @ball.update()
    @renderer.render(@scene, @camera)

class Ball
  constructor: (radius) ->
    @radius = radius
    @_init()

  update: ->
    pos = @mesh.position
    pos.addSelf(@velocity)
    if pos.x + @radius > WIDTH/2
      pos.set(WIDTH/2 - @radius, pos.y, pos.z)
      @velocity.set(@velocity.x * -0.8, @velocity.y, @velocity.z)
    else if pos.x - @radius < -WIDTH/2
      pos.set(-WIDTH/2 + @radius, pos.y, pos.z)
      @velocity.set(@velocity.x * -0.8, @velocity.y, @velocity.z)

    if pos.y + @radius > HEIGHT/2
      pos.set(pos.x, HEIGHT/2 - @radius, pos.z)
      @velocity.set(@velocity.x, @velocity.y * -0.95, @velocity.z)
    else if pos.y - @radius < -HEIGHT/2 
      pos.set(pos.x, -HEIGHT/2 + @radius, pos.z)
      @velocity.set(@velocity.x, @velocity.y * -0.95, @velocity.z)

    @velocity.set(@velocity.x, @velocity.y + GRAVITY, @velocity.z)

  _init: ->
    @_createMaterial()
    @_createMesh()
    @velocity = new THREE.Vector3(5, 5, 0)

  _createMaterial: ->
    @material = new THREE.MeshPhongMaterial(
      color: 0xff0000
      shininess: 100
    )

  _createMesh: ->
    @mesh = new THREE.Mesh(
      new THREE.SphereGeometry(@radius, 16, 16),
      @material
    )

@startBounce = ->
  container = document.createElement('div')
  document.body.appendChild(container)
  new Bounce(container)
