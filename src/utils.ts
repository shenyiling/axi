export function parseUnit(val: string | number | object) {
    if (isType(val, 'object')) return '' // TODO:
    const split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val + '');
    if (split) return split[1] || ''
}

export function getCssValue(ele: HTMLElement, prop: string) {
    if (prop in ele.style) {
        const cssProp = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
        const val = ele.style[prop as any] || getComputedStyle(ele).getPropertyValue(cssProp) || '0'
        return val
    }
    return '0'
}

export function updateObjectProps(o1: any, o2: any) {
    const cloneObj = { ...o1 }
    for (const k in o1) {
        cloneObj[ k ] = o2.hasOwnProperty(k) ? o2[k] : o1[k]
    }

    return cloneObj
}

export function minMax(a: number, b: number, c: number) { // math.max firstly, then math.min
    return Math.min(Math.max(a, b), c)
}

const validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d'];

export function getAttribute(el: Element, prop: string) {
    return el.getAttribute(prop);
}

export function arrayContains(ary: any[], item: any) {
    return ary.some(d => d === item)
}

export function getAnimationType(el: HTMLElement, prop: string) {
    if (isDom(el)) {
        if (arrayContains(validTransforms, prop)) return 'transform'
        if (prop !== 'transform' && getCssValue(el, prop)) return 'css'
        if (getAttribute(el, prop)) return 'attribute'
    }
    if ((el as any)[prop] !== null) return 'object'
}

export function getTransforms(el: HTMLElement) {
    if (!isDom(el)) return {}
    const transform = el.style.transform || ''
    const reg  = /(\w+)\(([^)]*)\)/g;
    const m = {} as any
    let execRet
    while (execRet = reg.exec(transform)) {
        m[execRet[1]] = execRet[2]
    }
    return m
}

function getTransformValue(el: HTMLElement, prop: string) {
    const defaultVal = stringContains(prop, 'scale') ? 1 : 0 + getTransformUnit(prop)
    return getTransforms(el)[prop] || defaultVal
}

export function getTargetOriValue(type: string, target: HTMLElement, prop: string) {
    switch (type) {
      case 'transform': return getTransformValue(target, prop)
      case 'css': return getCssValue(target, prop)
      case 'attribute': return getAttribute(target, prop)
      default: return (target as any)[prop] || 0;
    }
}

export const setProgressValue = { 
    css: (t: HTMLElement, p: string, v: any) => { (t.style as any)[p] = v },
    attribute: (t: HTMLElement, p: string, v: any) => { t.setAttribute(p, v) },
    object: (t: any, p: any, v: any) => { t[p] = v },
    transform: (t: any, p: any, v: any, transforms: any) => {
        transforms[p] = v
        let newVal = ''
        Object.keys(transforms).forEach(k => {
            newVal += `${ k }(${ transforms[k] }) `
        })
        t.style.transform = newVal
    }
}

export const isObj = (val: any) => stringContains(Object.prototype.toString.call(val), 'Object')
export const isSvg = (el: any): el is SVGElement => el instanceof SVGElement
export function isDom(ele: HTMLElement) {
    return ele.nodeType || isSvg(ele)
}
export const isHexCor = (str: string) => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(str)
export const isHslCor = (str: string) => /^hsl/.test(str)
export const isRgbCor = (str: string) => /^rgb/.test(str)
export const isCor = (str: string) => isHexCor(str) || isHslCor(str) || isRgbCor(str)

export const rgbaGen = (r: number, g: number, b: number, a: any) => `rgba(${ r }, ${ g }, ${ b }, ${ a })`

export const hex2rgba = (cor: string) => {
    const fullHexCor = cor.replace(/^#([A-F\d])([A-F\d])([A-F\d])$/i, (_, r, g, b) => r + r + g + g + b + b)
    const oxRgb = /^#?([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})$/i.exec(fullHexCor)
    const [_, r, g, b] = oxRgb
    return rgbaGen( parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), 1 )
}

export const hsl2rgba = (cor: string) => {
    const hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(cor) || 
        /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(cor)
    const h = parseInt(hsl[1], 10) / 360
    const s = parseInt(hsl[2], 10) / 100
    const l = parseInt(hsl[3], 10) / 100
    const a = hsl[4] || 1

    function hue2rgb(p: number, q: number, t: number) {
        if (t < 0) { t += 1; }
        if (t > 1) { t -= 1; }
        if (t < 1/6) { return p + (q - p) * 6 * t; }
        if (t < 1/2) { return q; }
        if (t < 2/3) { return p + (q - p) * (2/3 - t) * 6; }
        return p;
    }

    let r, g, b

    if (s == 0) {
        r = g = b = l
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
    }

    return rgbaGen( r * 255, g * 255, b * 255, a )
}

export const rgb2rgba = (cor: string) => {
    const rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(cor)
    return rgb ? 'rgba(' + rgb[1] + ', 1)' : cor
}

export const color2rgba = (cor: string) => {
    if (isHexCor(cor)) return hex2rgba(cor)
    if (isHslCor(cor)) return hsl2rgba(cor)
    if (isRgbCor(cor)) return rgb2rgba(cor)
    throw new Error('Please set the correct color(rgb, rgba, hex, hsl).')
}

function stringContains(str: string, text: string) {
    return str.indexOf(text) > -1
}

function getTransformUnit(prop: string) {
    if (stringContains(prop, 'translate') || prop === 'perspective') return 'px'
    if (stringContains(prop, 'rotate') || stringContains(prop, 'skew')) return 'deg'
}

function getCircleLength(el: SVGCircleElement) {
    return Math.PI * 2 * +getAttribute(el, 'r')
}

function getRectLength(el: SVGRectElement) {
    return 2 * ( +getAttribute(el, 'width') + (+getAttribute(el, 'height')))
}

function getLineLength(el: SVGLineElement) {
    const p1 = { x: +getAttribute(el, 'x1'), y: +getAttribute(el, 'y1') }
    const p2 = { x: +getAttribute(el, 'x2'), y: +getAttribute(el, 'y2') }
    return getDistance(p1 as SVGPoint, p2 as SVGPoint)
}

function getDistance(p1: SVGPoint, p2: SVGPoint) {
    const w = p1.x - p2.x
    const h = p1.x - p2.y
    return Math.sqrt( w * w + h * h )
}

function getPolylineLength(el: SVGPolylineElement) {
    const points = [ ...el.points as any ]
    const len = points.length
    return points.reduce((l, point, i) => {
        if (i === len - 1) return l + 0
        const next = points[i + 1]
        return l + getDistance(point, next)
    }, 0)
}

function getPolygonLength(el: SVGPolygonElement) {
    const points = [ ...el.points as any ]
    return getPolylineLength(el) + getDistance(points[0], points[ points.length - 1 ])
}

// get total length of path(path, cirlce, rect, line, polyline, polygon)
export function getTotalLength(el: any) {
    if (el.getTotalLength) return el.getTotalLength()

    const n = el.tagName.toLowerCase() 
    switch (n) {
        case 'circle': getCircleLength(el)
        case 'rect': getRectLength(el)
        case 'line': getLineLength(el)
        case 'polyline': getPolylineLength(el)
        case 'polygon': getPolygonLength(el)
    }
}

const motionPathNodeTypes = [ 'path', 'circle', 'rect', 'line', 'polyline', 'polygon' ]
const wrongMotionPathNode = 'The motion path node can only be one of (path, circle, rect, line, polyline, polygon).'

export function selectMotionPathNode(el: string | SVGElement) {
    if (isType(el, 'string')) {
        const nodes = document.querySelectorAll(el as string)
        for (const n of nodes as any) {
            if (isMotionPathNode(n)) {
                return n as SVGElement
            }
        }
        throw new Error(wrongMotionPathNode)
    } else {
        if (isMotionPathNode(el as SVGAElement)) {
            return el as SVGElement
        }
        throw new Error(wrongMotionPathNode)
    }
}

export function isMotionPathNode(el: Element) {
    const n = el.tagName.toLowerCase() 
    return (motionPathNodeTypes as any).includes(n)
}

export const requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).oRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame ||
    function (cb: any) {
        return window.setTimeout(cb, 1000 / 60);
    }

export const cancelRequestAnimFrame = window.cancelAnimationFrame ||
    (window as any).webkitCancelRequestAnimationFrame ||
    (window as any).mozCancelRequestAnimationFrame ||
    (window as any).oCancelRequestAnimationFrame ||
    (window as any).msCancelRequestAnimationFrame ||
    window.clearTimeout

export function isType(v: any, t: string) {
    return Object.prototype.toString.call(v).toLowerCase() === `[object ${ t }]`
}