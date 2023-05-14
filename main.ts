// from math import *
// from serial import *
// from threaded import *
class LoggingParams {
    static iLogInterval: number
    private ___iLogInterval_is_set: boolean
    private ___iLogInterval: number
    get iLogInterval(): number {
        return this.___iLogInterval_is_set ? this.___iLogInterval : LoggingParams.iLogInterval
    }
    set iLogInterval(value: number) {
        this.___iLogInterval_is_set = true
        this.___iLogInterval = value
    }
    
    static idefaultLogInterv: number
    private ___idefaultLogInterv_is_set: boolean
    private ___idefaultLogInterv: number
    get idefaultLogInterv(): number {
        return this.___idefaultLogInterv_is_set ? this.___idefaultLogInterv : LoggingParams.idefaultLogInterv
    }
    set idefaultLogInterv(value: number) {
        this.___idefaultLogInterv_is_set = true
        this.___idefaultLogInterv = value
    }
    
    static iHighLogInterv: number
    private ___iHighLogInterv_is_set: boolean
    private ___iHighLogInterv: number
    get iHighLogInterv(): number {
        return this.___iHighLogInterv_is_set ? this.___iHighLogInterv : LoggingParams.iHighLogInterv
    }
    set iHighLogInterv(value: number) {
        this.___iHighLogInterv_is_set = true
        this.___iHighLogInterv = value
    }
    
    static listWindSpeed: number[]
    private ___listWindSpeed_is_set: boolean
    private ___listWindSpeed: number[]
    get listWindSpeed(): number[] {
        return this.___listWindSpeed_is_set ? this.___listWindSpeed : LoggingParams.listWindSpeed
    }
    set listWindSpeed(value: number[]) {
        this.___listWindSpeed_is_set = true
        this.___listWindSpeed = value
    }
    
    iLevel: number
    iCount: number
    public static __initLoggingParams() {
        LoggingParams.listWindSpeed = [0, 5, 10, 20, 40, 50]
        LoggingParams.idefaultLogInterv = 5000
        LoggingParams.iHighLogInterv = 1000
        LoggingParams.iLogInterval = 0
    }
    
    constructor(iLevel: number, iCount: number) {
        this.iLevel = iLevel
        this.iCount = iCount
        this.iLogInterval = this.idefaultLogInterv
    }
    
    public getLogInterval(): number {
        return this.iLogInterval
    }
    
    public setLogIntervalToHigh() {
        this.iLogInterval = this.iHighLogInterv
    }
    
    public setLogIntervalToStd() {
        this.iLogInterval = this.idefaultLogInterv
    }
    
    public getWindSpeedThreshold(): number {
        return this.listWindSpeed[this.iLevel]
    }
    
    public increaseLevel() {
        if (this.iLevel == this.listWindSpeed.length - 1) {
            this.iLevel = 0
        } else {
            this.iLevel = this.iLevel + 1
        }
        
    }
    
    public continueLogging(): boolean {
        if (this.iCount < 20) {
            this.iCount = this.iCount + 1
            return true
        } else {
            return false
        }
        
    }
    
}

LoggingParams.__initLoggingParams()

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

function showQMarkLED() {
    basic.showLeds(`
        . # # # .
        . # # #.
        . . # . .
        . . . . .
        . . # . .
    `)
}

function show3DotsLED() {
    basic.showLeds(`
        . . . . .
        . . . . .
        # . # . #
        . . . . .
        . . . . .
    `)
    basic.showLeds(`
        . . . . .
        . . . . .
        . # . # .
        . . . . .
        . . . . .
    `)
}

function showWindLevel() {
    
    if (p1.iLevel == 0) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            # # # # #
            `)
    } else if (p1.iLevel == 1) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            `)
    } else if (p1.iLevel == 2) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            `)
    } else if (p1.iLevel == 3) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            `)
    } else if (p1.iLevel == 4) {
        basic.showLeds(`
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            `)
    } else if (p1.iLevel == 5) {
        basic.showLeds(`
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            `)
    }
    
}

class dataOutput {
    szLine: string
    constructor() {
        this.szLine = ""
    }
    
    public writeHeader() {
        let szLine = "WSP,CWD,TiC,HUM,PRESS"
        serial.writeLine(szLine)
    }
    
    public writeData(WSP: number, CWD: string, TiC: number, HUM: number, PRESS: number) {
        let szLine = WSP + "," + CWD + "," + TiC + "," + HUM + "," + PRESS
        serial.writeLine(szLine)
    }
    
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    LoggingIsOn = !LoggingIsOn
    if (LoggingIsOn == true) {
        showWindLevel()
        basic.pause(2000)
        showLoggingLED()
    } else {
        showNotLoggingLED()
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    let minWindSpeed: number;
    let szLine: string;
    
    if (LoggingIsOn == false) {
        p1.increaseLevel()
        minWindSpeed = p1.getWindSpeedThreshold()
        szLine = "--------- limit " + minWindSpeed + "---------"
        serial.writeLine(szLine)
        showWindLevel()
        basic.pause(2000)
        showNotLoggingLED()
    } else {
        showQMarkLED()
        basic.pause(2000)
        showLoggingLED()
    }
    
})
let p1 = new LoggingParams(0, 0)
let dataLog = new dataOutput()
let LoggingIsOn = false
let doLog = false
weatherbit.startWindMonitoring()
weatherbit.startWeatherMonitoring()
serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BaudRate9600)
// serial.redirect_to_usb()
/** Note: If "???" is displayed, direction is unknown! */
function on_forever() {
    let doLog: boolean;
    let humid: number;
    let pressure: number;
    
    let tempC = 0
    let current_WindSpeed = 0.0
    let current_WindDirection_List = ""
    if (LoggingIsOn == true) {
        //  -------- wind --------
        //         temperatureC = (weatherbit.temperature()/ 100)
        //         if (temperatureC > p1.getWindSpeedThreshold()):
        current_WindSpeed = weatherbit.windSpeed() * 3600 / 1000
        if (current_WindSpeed > p1.getWindSpeedThreshold()) {
            doLog = true
            p1.setLogIntervalToHigh()
        } else if (p1.continueLogging() == false) {
            doLog = false
            p1.setLogIntervalToStd()
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
            dataLog.writeData(current_WindSpeed, current_WindDirection_List, tempC, humid, pressure)
        } else {
            show3DotsLED()
        }
        
    } else {
        showNotLoggingLED()
    }
    
    basic.pause(p1.getLogInterval())
}

dataLog.writeHeader()
while (true) {
    on_forever()
}
