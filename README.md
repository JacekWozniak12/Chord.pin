# Chord.pin

Application, that let's you create by using **custom** syntax. It lets an user create chords from a text formatted by custom syntax standards, which is written below. 

- [Chord.pin](#chordpin)
  - [Features](#features)
  - [How To Run](#how-to-run)
  - [How To Use](#how-to-use)
    - [Objects](#objects)
      - [Note](#note)
      - [Chord](#chord)
      - [Options](#options)
    - [Graphical Interface](#graphical-interface)
    - [Text prompt syntax](#text-prompt-syntax)
      - [Rules](#rules)
      - [Symbols](#symbols)
        - [Note](#note-1)
        - [Chord base](#chord-base)
        - [Note / default options](#note--default-options)
        - [Global options](#global-options)
      - [Examples](#examples)
  - [Used Software / Libraries](#used-software--libraries)
  - [Legal](#legal)

## Features

- Custom syntax for Chords
- Generated guitar chord diagram
- Frequency based on [equal-tempered scales](https://pages.mtu.edu/~suits/notefreqs.html)

## How To Run
Use *index.html* in *build* folder.

## How To Use

### Objects

#### Note

One sound, that have predefined name based on European letter notation. Sound have features like volume (in decibels), time of playing (in seconds) and delay (in seconds) before it is played.

* Name
* Volume
* Time of playing
* Delay

#### Chord

Sound that consists of multiple notes. 

* Name
* Description
* Notes

#### Options

Settings for 

* Volume 
* Instrument
* Duration
* Delay

### Graphical Interface

#### Changing settings

    <img src="https://img.icons8.com/windows/32/000000/help.png"/>

    <img src="https://img.icons8.com/windows/32/000000/send-letter.png"/>

    <img src="https://img.icons8.com/windows/32/000000/add-column.png"/>

    <img src="https://img.icons8.com/windows/32/000000/plus-math.png"/>

    <img src="https://img.icons8.com/windows/32/000000/minus-math.png"/>

    <img src="https://img.icons8.com/windows/32/000000/expand-arrow.png"/>

    <img src="https://img.icons8.com/windows/32/000000/opened-folder.png"/>

    <img src="https://img.icons8.com/windows/32/000000/settings.png"/>

### Text prompt syntax

#### Rules

* Case insensitive
* You can use:
  * Tab
  * Space
  * Soft enter
* Close brackets

#### Symbols

##### Note

* To specify a note, use a syntax **[A - G]** **[#/b] [0 - 9]**
* Examples 
  * `A4` 
    Note A4
  * `Ab4` 
    Note Ab4 / G#3
  * `G#4` 
    Note G#4 / Ab5 

  
##### Chord base

* `+` Add semitone amount
* `-` Subtract semitone amount
* `^` Add another note to chord
* `{` Start note group
* `}` End note group
* `>>` Save option / chord under name specified after symbol
* `<<` Find option / chord under name specified after symbol and apply it

##### Note / default options

* `(` Start option group
* `)` End option group
* `,` Next parameter
* `:` Set option value
* `t` Time of note (in seconds)
* `d` Delay of note (in seconds)
* `v` Volume of note (from 0 to 1)


#### Examples

`full content of text prompt`

##### Default option setting

* `(t: 1)`
Default time of note set to **1** second
* `(t: 1, d: 0.33)`
Default time of note set to **1** second and default delay to **0.33** s
* `(t: 1, d: 2, v: 1)`
Default time of note set to **1** second, default delay to **0.33** s and default volume set at **max**

##### Single note (default options)

* `A4` Note **A4**
* `A4 + 5` Note **D4**
* `A4 - 1` Note **Ab4 / G#4**


##### Single note with options

* `A4 (t: 1)` Note **A4** lasting **1** second
* `A5 (d: 1)` Note **A5** delayed **1** second
* `A6 (d: 1, t: 2)` Note **A6** delayed **1** second and lasting **2** seconds
* `A7 (t: 1, d: 2, v: 1)` Note **A7** delayed **2** seconds, lasting **1** second and played at **max volume**

##### Chord with notes (default options)

* `D4 ^ A4` Note **D4** and **A4**
* `{D5 ^ A5}` Note **D5** and **A5**
* `A4 + 5 ^ A4` Note **D4** and **A4**
* `A4 - 1 ^ A4 + 5 ^ A5` Note **Ab4** / **G#4**, **D4** and **A5**

##### Chord with notes and options

* `D4 (t: 1) ^ A4` 
  Note **D4** and **A4** played in same time, where **D4** is lasting **1** second and **A4** uses default settings
* `{D4 (t: 1) ^ A4} (t: 2)` 
  Note **D4** and **A4** played in same time, where **D4** is lasting **1** second and **A4** is lasting **2** seconds
* `{D4 ^ A4} (t: 2) ^ E4` 
  Note **D4**, **A4** and **E4** played in same time, where **D4** and **A4** is lasting **2** second and **E4** uses default settings

##### Save / read operations

* `<< C3 Minor`
  Find and apply chord / option called **C3 Minor**
* `A4 ^ D4 >> A4 Powerchord` 
  Save chord consisted of notes **A4** and **D4** as **A4 Powerchord**

## Used Software / Libraries

* App is written in [TypeScript](https://www.typescriptlang.org/) ?and [NativeScript](https://www.nativescript.org/). 
* Audio framework provided by [Tone.js](https://tonejs.github.io/)
* Bundler provided by [Webpack](https://webpack.js.org/)
* Visual Studio Code

## Legal

All rights of quoted sources in part *Used Software / Libraries* are in hold of their respective owners.

