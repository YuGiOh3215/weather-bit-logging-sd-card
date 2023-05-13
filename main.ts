let temperatureC: number;
let pressure: number;
// from math import *
// from serial import *
// from threaded import *
function showLoggingLED() {
    basic.showLeds(`
        . . . . .
        . . . . #
        . . . # .
        # . # . .
        . # . . .
    `)
}

function showNotLoggingLED() {
    basic.showLeds(`
        # . . . #
        . # . # .
        . . # . .
        . # . # .
        # . . . #
    `)
}

function showWindLevel() {
    
    if (iLevel == 0) {
        serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BaudRate9600)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            # # # # #
            `)
    } else if (iLevel == 1) {
        //         serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE28800)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            `)
    } else if (iLevel == 2) {
        //         serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE38400)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            `)
    } else if (iLevel == 3) {
        //        serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE57600)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            `)
    } else if (iLevel == 4) {
        //       serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE14400)
        basic.showLeds(`
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            `)
    } else if (iLevel == 5) {
        //         serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE115200)
        basic.showLeds(`
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            `)
    }
    
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    TurnLoggingOnOff = !TurnLoggingOnOff
    if (TurnLoggingOnOff == true) {
        showWindLevel()
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (iLevel == listWindSpeed.length - 1) {
        iLevel = 0
    } else {
        iLevel = iLevel + 1
    }
    
    minWindSpeed = listWindSpeed[iLevel]
})
let listWindSpeed = [5, 10, 20, 30, 40, 50]
let iLevel = 0
let current_WindDirection_List = ""
let current_WindSpeed = 0
let tempC = 0
let TurnLoggingOnOff = true
let szLine = ""
let doLog = false
let iCount = 0
let idefaultLogInterv = 5000
let iHighLogInterv = 1000
let minWindSpeed = listWindSpeed[iLevel]
let iLogInterval = idefaultLogInterv
// serial.redirect_to_usb()
serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BaudRate9600)
weatherbit.startWindMonitoring()
weatherbit.startWeatherMonitoring()
TurnLoggingOnOff = false
/** Note: If "???" is displayed, direction is unknown! */
function on_forever() {
    let doLog: boolean;
    let iCount: number;
    let humid: number;
    let pressure: number;
    
    
    //  -------- wind --------
    current_WindSpeed = weatherbit.windSpeed() * 3600 / 1000
    if (current_WindSpeed > minWindSpeed) {
        doLog = true
        iLogInterval = iHighLogInterv
    } else if (iCount < 20) {
        iCount = iCount + 1
    } else {
        doLog = false
        iLogInterval = idefaultLogInterv
    }
    
    if (TurnLoggingOnOff == true) {
        doLog = false
        iLogInterval = idefaultLogInterv
    }
    
    if (doLog) {
        showLoggingLED()
        current_WindDirection_List = weatherbit.windDirection()
        //  -------- temperature --------
        tempC = weatherbit.temperature() / 100
        //  -------- humidity --------
        humid = weatherbit.humidity() / 1024
        //  -------- pressure --------
        pressure = weatherbit.pressure() / 25600
        szLine = current_WindSpeed + "," + current_WindSpeed + "," + current_WindDirection_List + "," + tempC + "," + humid + "," + pressure
        serial.writeLine(szLine)
    } else {
        showNotLoggingLED()
    }
    
    basic.pause(iLogInterval)
}

serial.redirectToUSB()
// serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE9600)
while (true) {
    //     on_forever()
    temperatureC = 0
    temperatureC = weatherbit.temperature() / 100
    pressure = weatherbit.pressure() / 25600
    szLine = temperatureC + "," + pressure
    serial.writeLine(szLine)
    // control.wait_micros(1000)
    basic.pause(1000)
}
