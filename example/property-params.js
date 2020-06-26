const specPropParamsCode = `
new Axi({
    target: '.spec-prop-params' + box,
    translateX: {
        value: 250,
        duration: 800
    },
    rotate: {
        value: 360,
        duration: 1800,
        easing: 'easeInOutSine'
    },
    scale: {
        value: 2,
        duration: 1600,
        delay: 800,
        easing: 'easeInOutQuart'
    },
    delay: 250
})
`

addDemos(
    { id: 'targets', title: 'TARGETS', color: 'yellow' },
    [
        { id: 'specPropParams', code: specPropParamsCode, cls: 'spec-prop-params', title: 'SPECIFIC PROPERTY PARAMETERS', count: 1 }
    ]
)

var box = ' .box:not(.shadow)'
eval(specPropParamsCode)