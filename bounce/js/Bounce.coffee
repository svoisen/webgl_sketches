@BACKGROUND_COLOR = 0xffffff
@DEFAULT_BALL_RADIUS = 50
@DEFAULT_GRAVITY = 0.5
@DEFAULT_ELASTICITY = 0.95
@VIEW_ANGLE = 45
@WIDTH = 800
@HEIGHT = 600
@NEAR = 0.1
@FAR = 10000
@ASPECT = @WIDTH/@HEIGHT

class Bounce
  constructor: (container) ->
    @container = container
    @balls = []
    @_init()

  addBall: (radius) ->
    ball = new Ball(radius, new THREE.Vector3(WIDTH/2, HEIGHT/2, 0))
    @balls.push(ball)
    @scene.add(ball.mesh)

  _init: ->
    @_createScene()
    @_createLights()
    @addBall(DEFAULT_BALL_RADIUS)
    @_animate()

  _createScene: ->
    @scene = new THREE.Scene()
    @renderer = new THREE.WebGLRenderer(
      antialias: true
    )
    @renderer.setSize(WIDTH, HEIGHT)
    @renderer.setClearColorHex(BACKGROUND_COLOR, 1.0)
    @renderer.shadowMapEnabled = true
    @renderer.shadowMapSoft = false
    @camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
    @camera.position.x = WIDTH/2
    @camera.position.y = HEIGHT/2
    @camera.position.z = 1000
    @scene.add(@camera)
    @container.appendChild(@renderer.domElement)

    wallGeometry = new THREE.PlaneGeometry(WIDTH, WIDTH, 1, 1)
    wallMaterial = new THREE.MeshPhongMaterial(
      color: 0xffffff
    )
    floor = new THREE.Mesh(wallGeometry, wallMaterial)
    floor.rotation.x = -90 * Math.PI / 180
    floor.position.set(WIDTH/2, 0, 0)
    floor.receiveShadow = true
    @scene.add(floor)

    leftWall = new THREE.Mesh(wallGeometry, wallMaterial)
    leftWall.rotation.y = 90 * Math.PI / 180
    leftWall.position.set(0, WIDTH/2, 0)
    leftWall.receiveShadow = true
    @scene.add(leftWall)

    backGeometry = new THREE.PlaneGeometry(WIDTH, WIDTH, 16, 16)
    backMaterial = new THREE.MeshBasicMaterial(
      color: 0xd0d0d0
      wireframe: true
    )
    backWall = new THREE.Mesh(backGeometry, backMaterial)
    backWall.position.set(WIDTH/2, WIDTH/2, -WIDTH/2)
    backWall.receiveShadow = false
    @scene.add(backWall)

  _createLights: ->
    spot = new THREE.SpotLight(0xffffff, 1.0)
    spot.position.set(WIDTH/1.5, HEIGHT + HEIGHT/2, 0)
    spot.target.position.set(WIDTH/2, 0, 0)
    spot.castShadow = true
    #spot.shadowCameraVisible = true
    @scene.add(spot)
    @scene.add(spot.target)

  _animate: =>
    requestAnimationFrame(@_animate)

    for ball in @balls
      ball.update()

    @renderer.render(@scene, @camera)

class Wall
  constructor: ->
    @_init()

  _init: ->

class Ball
  constructor: (radius, position) ->
    @radius = radius
    @elasticity = DEFAULT_ELASTICITY
    @gravity = DEFAULT_GRAVITY
    @_init(position)

  update: ->
    pos = @mesh.position
    rad = @radius
    vel = @velocity

    pos.addSelf(vel)

    if pos.x + rad > WIDTH
      pos.set(WIDTH - rad, pos.y, pos.z)
      @_bounceX()
    else if pos.x - rad < 0
      pos.set(rad, pos.y, pos.z)
      @_bounceX()

    if pos.y + rad > HEIGHT
      pos.set(pos.x, HEIGHT - rad, pos.z)
      @_bounceY()
    else if pos.y - rad < 0
      pos.set(pos.x, rad, pos.z)
      @_bounceY()

    vel.set(vel.x, vel.y - @gravity, vel.z)

  _bounceX: ->
    vel = @velocity
    vel.set(vel.x * -1 * @elasticity, vel.y, vel.z)

  _bounceY: ->
    vel = @velocity
    vel.set(vel.x, vel.y * -1 * @elasticity, vel.z)

  _init: (position) ->
    @_createMaterial()
    @_createMesh()
    @mesh.position = position
    @velocity = new THREE.Vector3(5, 5, 0)

  _createMaterial: ->
    @material = new THREE.MeshPhongMaterial(
      color: 0xcc0000
      shininess: 80
    )

  _createMesh: ->
    @mesh = new THREE.Mesh(
      new THREE.SphereGeometry(@radius, 16, 16),
      @material
    )
    @mesh.castShadow = true

@startBounce = ->
  container = document.createElement('div')
  document.body.appendChild(container)
  new Bounce(container)
