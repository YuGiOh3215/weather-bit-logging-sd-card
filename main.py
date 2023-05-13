import weatherbit
import microbit
from microbit import *

#from math import *
#from serial import *

from tkinter import *
#from threaded import *
from time import *
from logging import *

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

def showWindLevel():
    global iLevel
        
    if (iLevel == 0):
        serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE9600)

        basic.show_leds("""
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            # # # # #
            """)
    elif (iLevel == 1):
#        serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE28800)

        basic.show_leds("""
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            """)
    elif (iLevel == 2):
#        serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE38400)
        basic.show_leds("""
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            """)
    elif (iLevel == 3):
 #       serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE57600)
        basic.show_leds("""
            . . . . .
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            """)
    elif (iLevel == 4):
  #      serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE14400)
        basic.show_leds("""
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            """)
    elif (iLevel == 5):
#        serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE115200)
        basic.show_leds("""
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            """)
    


def on_button_pressed_a():
    global TurnLoggingOnOff
    TurnLoggingOnOff = not (TurnLoggingOnOff)
    if (TurnLoggingOnOff == True):
        showWindLevel()

input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    global minWindSpeed, listWindSpeed, iLevel
    
    if iLevel == len(listWindSpeed)-1:
        iLevel = 0
    else:
        iLevel = iLevel + 1

    minWindSpeed = listWindSpeed[iLevel]
input.on_button_pressed(Button.B, on_button_pressed_b)

                                           
listWindSpeed = [5, 10, 20, 30, 40, 50]
iLevel = 0
current_WindDirection_List = ""
current_WindSpeed = 0
tempC = 0
TurnLoggingOnOff = True
szLine = ""
doLog = False
iCount = 0
idefaultLogInterv = 5000
iHighLogInterv = 1000
minWindSpeed = listWindSpeed[iLevel]

iLogInterval = idefaultLogInterv
#serial.redirect_to_usb()

serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE9600)
weatherbit.start_wind_monitoring()
weatherbit.start_weather_monitoring()
TurnLoggingOnOff = False
"""

Note: If "???" is displayed, direction is unknown!

"""


def on_forever():
    global current_WindSpeed, current_WindDirection_List, minWindSpeed
    global tempC, szLine, iLogInterval, iHighLogInterv, idefaultLogInterv

    # -------- wind --------
    current_WindSpeed = weatherbit.wind_speed() * 3600 / 1000

    if (current_WindSpeed > minWindSpeed):
        doLog = True
        iLogInterval = iHighLogInterv
    elif (iCount < 20):
        iCount = iCount + 1
    else:
        doLog = False
        iLogInterval = idefaultLogInterv
    
    if TurnLoggingOnOff == True:
        doLog = False
        iLogInterval = idefaultLogInterv
     
    if doLog:
    
        showLoggingLED()
        current_WindDirection_List = weatherbit.wind_direction()

        # -------- temperature --------
        tempC = (weatherbit.temperature()/ 100)
        # -------- humidity --------

        humid = (weatherbit.humidity()/ 1024)
        # -------- pressure --------
        pressure = (weatherbit.pressure()/ 25600)
            
        szLine = current_WindSpeed + ',' + \
            current_WindSpeed + ',' + \
            current_WindDirection_List + ',' + \
            tempC + ',' + \
            humid + ',' + \
            pressure

        serial.write_line(szLine)
        
    else:
        showNotLoggingLED()
        
        
    basic.pause(iLogInterval)

serial.redirect_to_usb()
#serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BAUD_RATE9600)
   
while True:
#    on_forever()
    temperatureC = 0
    temperatureC = (weatherbit.temperature()/ 100)
    pressure = (weatherbit.pressure()/ 25600)
    szLine = temperatureC + ','+ pressure
    serial.write_line(szLine)
    #control.wait_micros(1000)
    basic.pause(1000)
    #display.scroll(x_strength)
