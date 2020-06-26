const axiStartEndCode = `new Axi({
    target: '.loop-start-end' + box,
    loop: true,
    direction: 'alternate',
    duration: 8000,
    translateX: 250,
    loopStart() {
        loopStartCount++
        document.querySelector('.loop-start-status').innerHTML = 'loop start: ' + loopStartCount
    },
    loopEnd() {
        loopEndCount++
        document.querySelector('.loop-end-status').innerHTML = 'loop end: ' + loopEndCount
    },
})
`

const loopStartEndCode = `new Axi({
    target: '.axi-start-end' + box,
    translateX: 250,
    axiStart() {
        console.log('start a new Axi.')
        document.querySelector('.start-hook-status').innerHTML = 'Axi start: true'
    },
    axiEnd() {
        console.log('Axi end.')
        document.querySelector('.end-hook-status').innerHTML = 'Axi end: true'
    },
})`

const updateStartEndCode = `new Axi({
    target: '.update-start-end' + box,
    translateX: 250,
    updateStart() {
        updateStartCount++
        document.querySelector('.update-start-status').innerHTML = 'update start: ' + updateStartCount
    },
    updateEnd() {
        updateEndCount++
        document.querySelector('.update-end-status').innerHTML = 'update end: ' + updateEndCount
    }
})`

addDemos(
    { id: 'targets', title: 'TARGETS', color: 'orange' },
    [
        { cls: 'axi-start-end', code: axiStartEndCode, title: 'AXI START/END', count: 1, extra: '<div class="start-hook-status">Axi start: false</div><div class="end-hook-status">Axi end: false</div>' },
        { cls: 'loop-start-end', code: loopStartEndCode, title: 'LOOP START/END', count: 1, extra: '<div class="loop-start-status">loop start: 0</div><div class="loop-end-status">loop end: 0</div>' },
        { cls: 'update-start-end', code: updateStartEndCode, title: 'UPDATE START/END', count: 1, extra: '<div class="update-start-status">update start: 0</div><div class="update-end-status">update end: 0</div>' },
    ]
)

var box = ' .box:not(.shadow)'

let loopStartCount = 0
let loopEndCount = 0
let updateStartCount = 0
let updateEndCount = 0

eval(axiStartEndCode)
eval(loopStartEndCode)
eval(updateStartEndCode)