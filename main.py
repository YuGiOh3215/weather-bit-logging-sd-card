import weatherbit
import microbit
from microbit import *

#from math import *
#from serial import *

from tkinter import *
#from threaded import *
from time import *
from logging import *

class LoggingParams:
    listWindSpeed = [0, 5, 10, 20, 40, 50]
    idefaultLogInterv = 5000
    iHighLogInterv = 1000
    iLogInterval = 0

    def __init__(self, iLevel, iCount):

        self.iLevel = iLevel
        self.iCount = iCount
        self.iLogInterval = self.idefaultLogInterv

    def getLogInterval(self):
        return (self.iLogInterval)

    def setLogIntervalToHigh(self):
        self.iLogInterval = self.iHighLogInterv
 
    def setLogIntervalToStd(self):
         self.iLogInterval = self.idefaultLogInterv

    def getWindSpeedThreshold(self):
        return (self.listWindSpeed[self.iLevel])

    def increaseLevel(self):
        
        if self.iLevel == (len(self.listWindSpeed)-1):
            self.iLevel = 0
        else:
            self.iLevel = self.iLevel + 1

    def continueLogging(self):
        if (self.iCount < 20):
            self.iCount = self.iCount + 1
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
        
    if (p1.iLevel == 0):
        basic.show_leds("""
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            # # # # #
            """)
    elif (p1.iLevel == 1):
        basic.show_leds("""
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            """)
    elif (p1.iLevel == 2):
        basic.show_leds("""
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            """)
    elif (p1.iLevel == 3):
        basic.show_leds("""
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            """)
    elif (p1.iLevel == 4):
        basic.show_leds("""
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            """)
    elif (p1.iLevel == 5):
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
        szLine = 'WSP,CWD,TiC,HUM,PRESS'
        serial.write_line(szLine)

    def writeData(self,WSP, CWD, TiC, HUM, PRESS):
        szLine = WSP + ',' + \
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

        szLine = '--------- limit ' + minWindSpeed + '---------'
        serial.write_line(szLine)    

        showWindLevel()
        basic.pause(2000)
        showNotLoggingLED()
    else:
        showQMarkLED()
        basic.pause(2000)
        showLoggingLED()
        
input.on_button_pressed(Button.B, on_button_pressed_b)



p1 = LoggingParams(0,0)    
dataLog = dataOutput()  

LoggingIsOn = False
doLog = False

weatherbit.start_wind_monitoring()
weatherbit.start_weather_monitoring()

serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE9600)
#serial.redirect_to_usb()

"""

Note: If "???" is displayed, direction is unknown!

"""


def on_forever():
    global p1, dataLog

    tempC = 0
    current_WindSpeed = 0.0
    current_WindDirection_List = ""

    if LoggingIsOn == True:
        # -------- wind --------
#        temperatureC = (weatherbit.temperature()/ 100)
#        if (temperatureC > p1.getWindSpeedThreshold()):
        current_WindSpeed = weatherbit.wind_speed() * 3600 / 1000
        if (current_WindSpeed > p1.getWindSpeedThreshold()):
            doLog = True
            p1.setLogIntervalToHigh()
        elif (p1.continueLogging() == False):
            doLog = False
            p1.setLogIntervalToStd()

        if doLog:

            showLoggingLED()
            current_WindDirection_List = weatherbit.wind_direction()

            # -------- temperature --------
            tempC = (weatherbit.temperature()/ 100)
            # -------- humidity --------

            humid = (weatherbit.humidity()/ 1024)
            # -------- pressure --------
            pressure = (weatherbit.pressure()/ 25600)

            dataLog.writeData(current_WindSpeed, current_WindDirection_List,
                tempC, humid, pressure)    

        else:
            show3DotsLED()
    else:
        showNotLoggingLED()
        
    basic.pause(p1.getLogInterval())

dataLog.writeHeader()
while True:
    on_forever()

