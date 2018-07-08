# automat

Define a graph with questions as nodes and answers as vertices and walk through it in a browser.


## Configuration

`data/data.json` contains your states. Each state is identified by its key. The start state is always called `start`.

Let's say we want to define three states: `start`, `middle`, and `end`. Then our `data.json` would start like this:

```
{
    "start": {},
    "middle": {},
    "end": {}
}
```

Each state has the following properties:

* `text` - a displayed text
* `question` - a text in a bigger font at the end
* `image` - the name of a file in the `images` folder, to be used as the background image
* `options` - an array that provides the connections to other states – we will deal with that in the next step

Let's add those properties to our three states. We will leave the options empty for now.

```
{
    "start": {
        "text": "This is the start state!",
        "question": "Let's start?",
        "options": [],
        "image": "hopscotch-1325854_640.jpg"
    },
    "middle": {
        "text": "We are in the middle!",
        "question": "O.O",
        "options": [],
        "image": "feet-1868670_640.jpg"
    },
    "end": {
        "text": "This is the end.",
        "question": "You know.",
        "options": [],
        "image": "lighthouse-1938740_640.jpg"
    }
}
```

Now we have to add the connections, or else we would have to stay in the `start` state forever!

For each connection, a button is added. The button has the following properties:

* `text` - the text displayed on the button
* `next` - the name of the state we will go to if this button is clicked
* `class` - the value of the button's `class` property. Currently, `red` and `blue` are supported by default, 
   yielding buttons with a blue or red tint, respectively.
* `score` - Did I mention that an overall score is kept? It starts at 0 and is increased by this value if the button is clicked.

We will add connections from `start` to `middle`, from `middle` to itself and to `end`, and from `end` back to `start`. Every time we stay in the `middle`, we also increase the score by 1.

```
{
    "start": {
        "text": "This is the start state!",
        "question": "Let's start?",
        "options": [
            {
                "text": "To the middle!",
                "next": "middle",
                "class": "",
                "score": 0
            }
        ],
        "image": "hopscotch-1325854_640.jpg"
    },
    "middle": {
        "text": "We are in the middle!",
        "question": "O.O",
        "options": [
            {
                "text": "Stay!",
                "next": "middle",
                "class": "",
                "score": 1
            },
            {
                "text": "To the end!",
                "next": "middle",
                "class": "",
                "score": 0
            }
        ],
        "image": "feet-1868670_640.jpg"
    },
    "end": {
        "text": "This is the end.",
        "question": "You know.",
        "options": [
            {
                "text": "Restart",
                "next": "start",
                "class": "",
                "score": 0
            }
        ],
        "image": "lighthouse-1938740_640.jpg"
    }
}
```

The whole setup is still a bit pointless, since we get to the same end result no matter how often we clicked "Stay!" in the `middle`.

Let's add a second end state `end_more_than_ten` which is reached after clicking "To the end!" with a score of more than 10.
In order to make that decision, we replace the `next` value with an array of objects. Which status is chosen depends on the current score: 
The last status of which the `min` and `max` values enclose the current score is picked. If none match, the first element in the list is picked.

Hence, we go to the state `end` if the current score lies between 0 and 10 (inclusive). Else, the next state will be `end_more_than_ten`.

```
{
    "start": {
        "text": "This is the start state!",
        "question": "Let's start?",
        "options": [
            {
                "text": "To the middle!",
                "next": "middle",
                "class": "",
                "score": 0
            }
        ],
        "image": "hopscotch-1325854_640.jpg"
    },
    "middle": {
        "text": "We are in the middle!",
        "question": "O.O",
        "options": [
            {
                "text": "Stay!",
                "next": "middle",
                "class": "blue",
                "score": 1
            },
            {
                "text": "To the end!",
                "next": [
                    {
                        "state": "end_more_than_ten"
                    },
                    {
                        "min": 0,
                        "max": 10,
                        "state": "end"
                    }
                ],
                "class": "red",
                "score": 0
            }
        ],
        "image": "feet-1868670_640.jpg"
    },
    "end": {
        "text": "This is the end.",
        "question": "You know.",
        "options": [
            {
                "text": "Restart",
                "next": "start",
                "class": "",
                "score": 0
            }
        ],
        "image": "lighthouse-1938740_640.jpg"
    },
    "end_more_than_ten": {
        "text": "You clicked more than ten times.",
        "question": "Good job!",
        "options": [
            {
                "text": "Restart",
                "next": "start",
                "class": "",
                "score": 0
            }
        ],
        "image": "lighthouse-1938740_640.jpg"
    }
}
```

One last thing to do: When we click "Restart", the score is not reset, so once we reach a score of >10, we will always be redirected to `end_more_than_ten`.

By changing the scores in the two `end` statuses to `reset`, the score will be reset to zero when those buttons are clicked, and we start counting from zero again.

```
{
    "start": {
        "text": "This is the start state!",
        "question": "Let's start?",
        "options": [
            {
                "text": "To the middle!",
                "next": "middle",
                "class": "",
                "score": 0
            }
        ],
        "image": "hopscotch-1325854_640.jpg"
    },
    "middle": {
        "text": "We are in the middle!",
        "question": "O.O",
        "options": [
            {
                "text": "Stay!",
                "next": "middle",
                "class": "blue",
                "score": 1
            },
            {
                "text": "To the end!",
                "next": [
                    {
                        "state": "end_more_than_ten"
                    },
                    {
                        "min": 0,
                        "max": 10,
                        "state": "end"
                    }
                ],
                "class": "red",
                "score": 0
            }
        ],
        "image": "feet-1868670_640.jpg"
    },
    "end": {
        "text": "This is the end.",
        "question": "You know.",
        "options": [
            {
                "text": "Restart",
                "next": "start",
                "class": "",
                "score": "reset"
            }
        ],
        "image": "lighthouse-1938740_640.jpg"
    },
    "end_more_than_ten": {
        "text": "You clicked more than ten times.",
        "question": "Good job!",
        "options": [
            {
                "text": "Restart",
                "next": "start",
                "class": "",
                "score": "reset"
            }
        ],
        "image": "lighthouse-1938740_640.jpg"
    }
}
```

And just like this, the graph is done!


## Images

All images are licensed CC0. They have been modified by applying GIMP's «Oil Painting» filter.

* [hopscotch-1325854_640.jpg](https://pixabay.com/de/hopscotch-witz-kind-boden-1325854/)
* [hip-hop-1209499_640.jpg](https://pixabay.com/de/hip-hop-t%C3%A4nzerin-silhouette-mann-1209499/)
* [feet-1868670_640.jpg](https://pixabay.com/de/f%C3%BC%C3%9Fe-schuhe-lustig-drinnen-1868670/)
* [lighthouse-1938740_640.jpg](https://pixabay.com/de/leuchtturm-delaware-1938740/)
