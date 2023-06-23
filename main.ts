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
        
        let szLine = this.Count + "\t" + this._refHours + ":" + this._refMinutes + ":" + this.Seconds
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
    
    public static __initLoggingParams() {
        LoggingParams.idefaultLogInterv = 2000
        LoggingParams._iLogInterval = 0
    }
    
    constructor() {
        this._iLogInterval = this.idefaultLogInterv
    }
    
    public getLogInterval(): number {
        return this._iLogInterval
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

class dataOutput {
    szLine: string
    constructor() {
        this.szLine = ""
    }
    
    public writeHeader() {
        this.szLine = "Time\tTiC\tHUM\tPRESS\tRAIN\tWSP\tCWD"
        serial.writeLine(this.szLine)
    }
    
    public writeData(TTime: any, TiC: number, HUM: number, PRESS: number, RAIN: number, WSP: number, CWD: string) {
        this.szLine = TTime + "\t" + TiC + "\t" + HUM + "\t" + PRESS + "\t" + RAIN + "\t" + WSP + "\t" + CWD
        serial.writeLine(this.szLine)
    }
    
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    LoggingIsOn = !LoggingIsOn
    if (LoggingIsOn == true) {
        showLoggingLED()
    } else {
        showNotLoggingLED()
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    showQMarkLED()
})
let p1 = new LoggingParams()
let dataLog = new dataOutput()
let td = new TimeAndDate()
let LoggingIsOn = false
weatherbit.startWindMonitoring()
weatherbit.startWeatherMonitoring()
// serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE9600)
serial.redirectToUSB()
/** Note: If "???" is displayed, direction is unknown! */
function on_forever() {
    let rain: number;
    let humid: number;
    let pressure: number;
    
    let tempC = 0
    let current_WindSpeed = 0.0
    let current_WindDirection_List = ""
    if (LoggingIsOn == true) {
        //  -------- wind --------
        current_WindSpeed = Math.roundWithPrecision(weatherbit.windSpeed() * 3600 / 1000, 2)
        current_WindDirection_List = weatherbit.windDirection()
        //         soilTemperature = Math.round_with_precision(weatherbit.soil_temperature(),1)
        //         soilHumid = Math.round_with_precision(weatherbit.soil_moisture(),1)
        //         altitude = Math.round_with_precision(weatherbit.altitude(),1)
        rain = Math.roundWithPrecision(weatherbit.rain(), 1)
        //  -------- temperature --------
        tempC = Math.roundWithPrecision(weatherbit.temperature() / 100, 0)
        //  -------- humidity --------
        humid = Math.roundWithPrecision(weatherbit.humidity() / 1024, 1)
        //  -------- pressure --------
        pressure = Math.roundWithPrecision(weatherbit.pressure() / 25600, 1)
        dataLog.writeData(td.getTime(), tempC, humid, pressure, rain, current_WindSpeed, current_WindDirection_List)
    } else {
        // , rain, altitude, soilHumid, soilTemperature)
        showNotLoggingLED()
    }
    
    basic.pause(p1.getLogInterval())
}

td.start()
dataLog.writeHeader()
while (true) {
    on_forever()
}
