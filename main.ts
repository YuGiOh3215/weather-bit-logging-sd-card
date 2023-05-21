class TimeAndDate {
    private static _referenceCount: number
    private ____referenceCount_is_set: boolean
    private ____referenceCount: number
    get _referenceCount(): number {
        return this.____referenceCount_is_set ? this.____referenceCount : TimeAndDate._referenceCount
    }
    set _referenceCount(value: number) {
        this.____referenceCount_is_set = true
        this.____referenceCount = value
    }
    
    private static _refHours: number
    private ____refHours_is_set: boolean
    private ____refHours: number
    get _refHours(): number {
        return this.____refHours_is_set ? this.____refHours : TimeAndDate._refHours
    }
    set _refHours(value: number) {
        this.____refHours_is_set = true
        this.____refHours = value
    }
    
    private static _refMinutes: number
    private ____refMinutes_is_set: boolean
    private ____refMinutes: number
    get _refMinutes(): number {
        return this.____refMinutes_is_set ? this.____refMinutes : TimeAndDate._refMinutes
    }
    set _refMinutes(value: number) {
        this.____refMinutes_is_set = true
        this.____refMinutes = value
    }
    
    static Seconds: number
    private ___Seconds_is_set: boolean
    private ___Seconds: number
    get Seconds(): number {
        return this.___Seconds_is_set ? this.___Seconds : TimeAndDate.Seconds
    }
    set Seconds(value: number) {
        this.___Seconds_is_set = true
        this.___Seconds = value
    }
    
    private static _refSeconds: number
    private ____refSeconds_is_set: boolean
    private ____refSeconds: number
    get _refSeconds(): number {
        return this.____refSeconds_is_set ? this.____refSeconds : TimeAndDate._refSeconds
    }
    set _refSeconds(value: number) {
        this.____refSeconds_is_set = true
        this.____refSeconds = value
    }
    
    Count: number
    public static __initTimeAndDate() {
        //     Year = 2023
        //     Month = 5
        //     Day = 20
        TimeAndDate._refHours = 0
        TimeAndDate._refMinutes = 0
        TimeAndDate._refSeconds = 0
        //     Hours = 21
        //     Minutes = 20
        TimeAndDate.Seconds = 0
        TimeAndDate._referenceCount = 0
    }
    
    constructor() {
        this.Count = 0
        this._referenceCount = 0
    }
    
    public start() {
        this._referenceCount = input.runningTime()
        this.Count = 0
    }
    
    public getTime() {
        this.Count = (input.runningTime() - this._referenceCount) / 1000
        let compare = this.Count - (this._refHours * 3600 + this._refMinutes * 60)
        if (compare >= 60) {
            this.Seconds = Math.roundWithPrecision(compare - 60, 0)
            this._refMinutes = this._refMinutes + 1
        } else {
            this.Seconds = Math.roundWithPrecision(compare, 0)
        }
        
        if (this._refMinutes >= 60) {
            this._refMinutes = this._refMinutes - 60
            this._refHours = this._refHours + 1
        }
        
        if (this._refHours >= 24) {
            this._refHours = this._refHours - 24
        }
        
        let szLine = this.Count + " | " + this._refHours + ":" + this._refMinutes + ":" + this.Seconds
        return szLine
    }
    
}

TimeAndDate.__initTimeAndDate()

class LoggingParams {
    private static _iLogInterval: number
    private ____iLogInterval_is_set: boolean
    private ____iLogInterval: number
    get _iLogInterval(): number {
        return this.____iLogInterval_is_set ? this.____iLogInterval : LoggingParams._iLogInterval
    }
    set _iLogInterval(value: number) {
        this.____iLogInterval_is_set = true
        this.____iLogInterval = value
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
    
    private static _iCount: number
    private ____iCount_is_set: boolean
    private ____iCount: number
    get _iCount(): number {
        return this.____iCount_is_set ? this.____iCount : LoggingParams._iCount
    }
    set _iCount(value: number) {
        this.____iCount_is_set = true
        this.____iCount = value
    }
    
    private _iLevel: number
    public static __initLoggingParams() {
        LoggingParams.listWindSpeed = [0, 5, 10, 20, 40, 50]
        LoggingParams.idefaultLogInterv = 5000
        LoggingParams.iHighLogInterv = 1000
        LoggingParams._iLogInterval = 0
        LoggingParams._iCount = 0
    }
    
    constructor() {
        this._iLevel = 0
        this._iLogInterval = this.idefaultLogInterv
    }
    
    public getiLevel(): number {
        return this._iLevel
    }
    
    public getLogInterval(): number {
        return this._iLogInterval
    }
    
    public setLogIntervalToHigh() {
        this._iLogInterval = this.iHighLogInterv
    }
    
    public setLogIntervalToStd() {
        this._iLogInterval = this.idefaultLogInterv
    }
    
    public getWindSpeedThreshold(): number {
        return this.listWindSpeed[this._iLevel]
    }
    
    public increaseLevel() {
        if (this._iLevel == this.listWindSpeed.length - 1) {
            this._iLevel = 0
        } else {
            this._iLevel = this._iLevel + 1
        }
        
    }
    
    public continueLogging(): boolean {
        if (this._iCount < 20) {
            this._iCount = this._iCount + 1
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
    
    if (p1.getiLevel() == 0) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            # # # # #
            `)
    } else if (p1.getiLevel() == 1) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            `)
    } else if (p1.getiLevel() == 2) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            `)
    } else if (p1.getiLevel() == 3) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            `)
    } else if (p1.getiLevel() == 4) {
        basic.showLeds(`
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            `)
    } else if (p1.getiLevel() == 5) {
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
        let szLine = "Time,WSP,CWD,TiC,HUM,PRESS"
        serial.writeLine(szLine)
    }
    
    public writeData(TTime: any, WSP: number, CWD: string, TiC: number, HUM: number, PRESS: number) {
        let szLine = TTime + "," + WSP + "," + CWD + "," + TiC + "," + HUM + "," + PRESS
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
        szLine = "--------- limit " + minWindSpeed + " ---------"
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
let p1 = new LoggingParams()
let dataLog = new dataOutput()
let td = new TimeAndDate()
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
        current_WindSpeed = Math.roundWithPrecision(weatherbit.windSpeed() * 3600 / 1000, 1)
        if (current_WindSpeed > p1.getWindSpeedThreshold()) {
            //  or (True):
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
            tempC = Math.roundWithPrecision(weatherbit.temperature() / 100, 0)
            //  -------- humidity --------
            humid = Math.roundWithPrecision(weatherbit.humidity() / 1024, 1)
            //  -------- pressure --------
            pressure = Math.roundWithPrecision(weatherbit.pressure() / 25600, 1)
            // dataLog.writeData(current_WindSpeed, current_WindDirection_List,
            //     tempC, humid, pressure)    
            dataLog.writeData(td.getTime(), current_WindSpeed, current_WindDirection_List, tempC, humid, pressure)
        } else {
            show3DotsLED()
        }
        
    } else {
        showNotLoggingLED()
    }
    
    basic.pause(p1.getLogInterval())
}

td.start()
dataLog.writeHeader()
while (true) {
    on_forever()
}
