import weatherbit
import microbit
from microbit import *
from logging import *

class TimeAndDate:
#    Year = 2023
#    Month = 5
#    Day = 20
    _refHours = 0
    _refMinutes = 0
    _refSeconds = 0
#    Hours = 21
#    Minutes = 20
    Seconds = 0
    _referenceCount = 0

    def __init__(self):
        self.Count = 0  
        self._referenceCount = 0

    def start(self):
        self._referenceCount = input.running_time()
        self.Count = 0 
 
    def getTime(self):
        self.Count = (input.running_time() - self._referenceCount)/1000
        compare = self.Count - ((self._refHours * 3600) + \
        (self._refMinutes * 60))

        if (compare >= 60):
            self.Seconds = Math.round_with_precision((compare - 60),0)
            self._refMinutes = self._refMinutes + 1
        else:
            self.Seconds = Math.round_with_precision(compare,0)
            

        if (self._refMinutes >= 60):
            self._refMinutes = self._refMinutes - 60
            self._refHours = self._refHours + 1

        if (self._refHours >= 24):
            self._refHours = self._refHours - 24

        szLine = self.Count + " | "+ self._refHours + \
         ':' + self._refMinutes + ':' + self.Seconds 
        return szLine


class LoggingParams:
    listWindSpeed = [0, 5, 10, 20, 40, 50]
    idefaultLogInterv = 5000
    iHighLogInterv = 1000
    _iLogInterval = 0
    _iCount = 0

    def __init__(self):

        self._iLevel = 0
        self._iLogInterval = self.idefaultLogInterv

    def getiLevel(self):
        return self._iLevel

    def getLogInterval(self):
        return (self._iLogInterval)

    def setLogIntervalToHigh(self):
        self._iLogInterval = self.iHighLogInterv
 
    def setLogIntervalToStd(self):
         self._iLogInterval = self.idefaultLogInterv

    def getWindSpeedThreshold(self):
        return (self.listWindSpeed[self._iLevel])

    def increaseLevel(self):
        
        if self._iLevel == (len(self.listWindSpeed)-1):
            self._iLevel = 0
        else:
            self._iLevel = self._iLevel + 1

    def continueLogging(self):
        if (self._iCount < 20):
            self._iCount = self._iCount + 1
            return True
        else:
            return False
        

def showLoggingLED():
    basic.show_leds("""
        . . . . .
        . . . . #
        . . . # .
        # . # . .
        . # . . .
    """)


def showNotLoggingLED():
    basic.show_leds("""
        # . . . #
        . # . # .
        . . # . .
        . # . # .
        # . . . #
    """)

def showQMarkLED():
    basic.show_leds("""
        . # # # .
        . # # #.
        . . # . .
        . . . . .
        . . # . .
    """)

def show3DotsLED():
    basic.show_leds("""
        . . . . .
        . . . . .
        # . # . #
        . . . . .
        . . . . .
    """)
    basic.show_leds("""
        . . . . .
        . . . . .
        . # . # .
        . . . . .
        . . . . .
    """)

def showWindLevel():
    global p1
        
    if (p1.getiLevel() == 0):
        basic.show_leds("""
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            # # # # #
            """)
    elif (p1.getiLevel() == 1):
        basic.show_leds("""
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            """)
    elif (p1.getiLevel() == 2):
        basic.show_leds("""
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            """)
    elif (p1.getiLevel() == 3):
        basic.show_leds("""
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            """)
    elif (p1.getiLevel() == 4):
        basic.show_leds("""
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            """)
    elif (p1.getiLevel() == 5):
        basic.show_leds("""
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            """)
    
class dataOutput:
    def __init__(self):
        self.szLine = ""

    def writeHeader(self):
        szLine = 'Time,WSP,CWD,TiC,HUM,PRESS'
        serial.write_line(szLine)

    def writeData(self,TTime, WSP, CWD, TiC, HUM, PRESS):
        szLine = TTime + ',' + \
            WSP + ',' + \
            CWD + ',' + \
            TiC + ',' + \
            HUM + ',' + \
            PRESS

        serial.write_line(szLine)


def on_button_pressed_a():
    global LoggingIsOn
    LoggingIsOn = not (LoggingIsOn)
    
    if (LoggingIsOn == True):
        showWindLevel()
        basic.pause(2000)
        showLoggingLED()
    else:
        showNotLoggingLED()
        
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    global p1
    
    if LoggingIsOn == False:
        p1.increaseLevel()
        
        minWindSpeed = p1.getWindSpeedThreshold()

        szLine = '--------- limit ' + minWindSpeed + ' ---------'
        serial.write_line(szLine)    

        showWindLevel()
        basic.pause(2000)
        showNotLoggingLED()
    else:
        showQMarkLED()
        basic.pause(2000)
        showLoggingLED()
        
input.on_button_pressed(Button.B, on_button_pressed_b)



p1 = LoggingParams()    
dataLog = dataOutput() 
td = TimeAndDate() 

LoggingIsOn = False
doLog = False

weatherbit.start_wind_monitoring()
weatherbit.start_weather_monitoring()

#serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE9600)
serial.redirect_to_usb()

"""

Note: If "???" is displayed, direction is unknown!

"""


def on_forever():
    global p1, dataLog, td
     
    tempC = 0
    current_WindSpeed = 0.0
    current_WindDirection_List = ""

    if LoggingIsOn == True:
        # -------- wind --------
#        temperatureC = (weatherbit.temperature()/ 100)
#        if (temperatureC > p1.getWindSpeedThreshold()):
        current_WindSpeed = Math.round_with_precision(weatherbit.wind_speed() * 3600 / 1000,1)
        
        if (current_WindSpeed > p1.getWindSpeedThreshold()) or (True):
            doLog = True
            p1.setLogIntervalToHigh()
        elif (p1.continueLogging() == False):
            doLog = False
            p1.setLogIntervalToStd()

        if doLog:

            showLoggingLED()
            current_WindDirection_List = weatherbit.wind_direction()

            # -------- temperature --------
            tempC = Math.round_with_precision((weatherbit.temperature()/ 100),0)
            # -------- humidity --------

            humid = Math.round_with_precision((weatherbit.humidity()/ 1024),1)
            # -------- pressure --------
            pressure = Math.round_with_precision(weatherbit.pressure()/ 25600,1)

            #dataLog.writeData(current_WindSpeed, current_WindDirection_List,
            #    tempC, humid, pressure)    
            dataLog.writeData(td.getTime(),current_WindSpeed, current_WindDirection_List,
                            tempC, humid, pressure)
        else:
            show3DotsLED()
    else:
        showNotLoggingLED()
        
    basic.pause(p1.getLogInterval())

td.start()
dataLog.writeHeader()
while True:
    on_forever()

