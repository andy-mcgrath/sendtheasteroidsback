# js13k-test

https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations

https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

https://www.w3schools.com/tags/ref_canvas.asp

### Conventions

- A = [xA, yA] is a point on the 2D plane. Same for B, C, ...
- lengths are in any unit (ex: pixels)
- code snippets are in JavaScript

### Degrees to radians

angleRad = angleDeg * Math.PI / 180;

### Radians to degrees

angleDeg = angleRad * 180 / Math.PI;

### Unit circle

![unit circle](http://www-math.mit.edu/~djk/calculus_beginners/chapter07/images/trigo_functions.gif)

## 2D

### Distance between two points (Pythagore)

- dist = function(A,B){ return Math.sqrt((xB - xA)\*(xB - xA) + (yB - yA)\*(yB - yA)) } // ES5
- dist = (A, B) => Math.hypot(xB - xA, yB - yA) // ES6

### Line passing through 2 points

- line equation: y = ax + b
- a = (yB - yA) / (xB - xA) = tan θ
- θ = angle between line and x axis
- b = yA - a * xA (because yA = a * xA + b)

### Intersection of 2 secant lines

- line 1: y = a * x + b
- line 2: y' = a' * x + b'
- intersection point P:
    - xP = (a - a')/(b' - b);
    - yP = a * xP + b;
- Ex with y = 5 \* x + 1 and y' = 2 \* x + 8:
    - xP = 7/3;
    - yP = 12.666;

### Angle in radians between the x axis at the origin and a point on the plane

angle = Math.atan2(Ax, Ay)

### Angle in radians between two points and the origin

angle = Math.atan2(By - Ay, Bx - Ax);

### Rotate a point of the plane around the origin (angle in radians)

- Anew_x = Ax * Math.cos(angle) - Ay * Math.sin(angle)
- Anew_y = Ax * Math.sin(angle) + Ay * Math.cos(angle)
- It's the same as applying the following rotation matrix:
````
vec2 (
    +cos(a), -sin(a)
    +sin(a), +cos(a)
)
````


### Normalize a vector
### a.k.a Project any point of the plane on the trigonometric circle (center: origin, radius: 1)

ES5:

````
Anew_x = Math.cos(atan2(Ax, Ay));
Anew_y = Math.sin(atan2(Ax, Ay));
````

ES6:
 	
````
tmp = Math.hypot(Ax, Ay);
Ax = Ax / tmp;
Ay = Ay / tmp;
````

### Intersections between a line and the grid (a.k.a 2D raycasting)

- http://www.cse.yorku.ca/~amana/research/grid.pdf
- http://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
- Demo by xem: http://codepen.io/xem/pen/RRxPNG?editors=1010

### Projection of a plane on a sphere

- new_y = Math.sin(-y * Math.PI/2);
- new_x = Math.sin(x * Math.PI) * Math.cos(y * Math.PI / 2);
- if Math.abs(x) < .5, the projected point is hidden "behind" the sphere.
- Prototype by subzey: http://codepen.io/subzey/pen/rVoXQx
- Demo by xem (on a 2D canvas): http://xem.github.io/articles/demos/js13k15/globe2.html

### 2D jumps / gravity (ex: for side-view platform games)

- let x, y the position of the object (ex: 0, 0)
- let vx, vy the horizontal and vertical speed of the object (ex: 0, 0)
- let g, the gravity (which is a downwards acceleration, ex: -10)
- during the frame at the start of the jump: set vy to a high value, ex: 50
- during all the frames of the jump:
    - Add g to vy (ex: 40, 30, 20, 10, 0, -10, ...)
    - Add vy to y (ex: 40, 70, 90, 100, 100, 90, ...)
    - place the object at [x,y]

Also applicable to all kind of accelerations in x or y directions.

### Framerate-independant 2D jumps

Use time instead of frames to make the animation.
Demo: https://jsfiddle.net/subzey/p1ftrar0/

### Minimal distance between a point and a line
 
- line: a * x + b * y + c = 0
- point: xA, yA
- distance: d = Math.abs(a * xA + b * yA + c) / Math.sqrt(a * a + b * b)

### Lerp (Blend / shortest path between two angles)

````
lerpDeg = function(start,end,amt){
	ver dif=end-start;
	dif = dif%360;
	if(dif>180.0)	{
		dif-=360.0;
	}
	else if (dif<-180.0)	{
		dif+=360.0;
	}
	return start+dif*amt;
}
````
## 3D

### 3D rotations


In order to create a 3d rotation, just take the idenity matrix:

````
vec3 (
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
)
````

And fill in the sines and cosines:

````
vec3 (
    +cos(a), -sin(a), 0,
    +sin(a), +cos(a), 0,
     0     ,  0     , 1
) // Rotation in XY plane

vec3 (
    +cos(a), 0, -sin(a),
     0     , 1, 0      ,
    +sin(a), 0, +cos(a)
) // Rotation in XZ plane

vec3 (
    1,  0     ,  0     ,
    0, +cos(a), -sin(a),
    0, +sin(a), +cos(a)
) // Rotation in YZ plane
````

### Rotation along X:
````
y' = y*cos(a) - z*sin(a)
z' = y*sin(a) + z*cos(a)
x' = x
````

### Rotation along Y:
````
z' = z*cos(a) - x*sin(a)
x' = z*sin(a) + x*cos(a)
y' = y
````

### Rotation along Z:
````
x' = x*cos(a) - y*sin(a)
y' = x*sin(a) + y*cos(a)
z' = z
````

### 3D Perspective Projection (draw a 3D point on a 2D canvas)
````
x' = x * fov / (z + viewer_distance) + half_screen_width
y' = -y * fov / (z + viewer_distance) + half_screen_height
(no z) 
````
### Sphere trigonometry

http://bit.ly/bm1ftU

### Great videos about linear algebra and matrices:

https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab

### comp.graphics.algorithms's FAQ

ftp://rtfm.mit.edu/pub/usenet-by-group/news.answers/graphics/algorithms-faq

### Easing functions

(from https://gist.github.com/gre/1650294)

```
/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}
```

### 2D Vector helpers

(from https://twitter.com/MaximeEuziere/status/1047545802669875200 )

```
V=(x,y)=>({x,y})            // Vec2D constructor
l=v=>d(v,v)**.5             // length(v)
a=(v,w)=>V(v.x+w.x,v.y+w.y) // add(v, w) 
s=(v,w)=>a(v,m(w,-1))       // sub(v, w)
m=(v,n)=>V(v.x*n,v.y*n)     // scale(v, n)
t=(v,w)=>l(s(v,w))          // distance(v, w)
d=(v,w)=>v.x*w.x+v.y*w.y    // dot_product(v, w)
c=(v,w)=>v.x*w.y-v.y*w.x    // cross_product(v, w)
r=(v,o,t)=>a(o,V(c(f=s(v,o),g=V(Math.sin(t),Math.cos(t))),d(f,g))) // rotate(v, origin, theta_angle)
n=v=>m(v,1/(l(v)||1))       // normalize(v)
```

