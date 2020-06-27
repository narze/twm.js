# Twm.js (Trolling Window Manager)

## What's that?

A window manager which you can use to organize windows with your keyboard, sounds productive huh?

## What about Trolling?

Oh, it will visually blocks your screen and sometimes move your windows around when you move your mouse cursor too much. :trollface: :trollface:

## Installation

Only macOS is supported for now, and maybe forever.

- Download and install [Phoenix](https://github.com/kasper/phoenix)

- Clone config & copy to home directory

  ```shell
    git clone git@github.com:narze/twm.js.git /tmp/twm.js
    cp /tmp/twm.js/phoenix.js ~/.phoenix.js
  ```

- Launch Phoenix application, or restart if already launched

## Basic controls

You can customize by editing phoenix.js file, it's easy since it uses [Javascript](https://github.com/kasper/phoenix/blob/master/docs/API.md)

### Window resizing

- `⌥ + ⇧ + F` : Full size
- `⌥ + ⇧ + H` : Half left
- `⌥ + ⇧ + l` : Half right
- `⌃ + ⇧ + 1` : One third left
- `⌃ + ⇧ + 2` : One third center
- `⌃ + ⇧ + 3` : One third right
- `⌃ + ⇧ + 4` : Two thirds left
- `⌃ + ⇧ + 5` : Two thirds right

### Window focusing

- `⌥ + H` : Focus window on the left (west) of current window
- `⌥ + L` : Focus window on the right (east) of current window
