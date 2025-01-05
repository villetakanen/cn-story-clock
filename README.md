# Cyan Story Clock

A form component that implements a Story Clock - a visual tracking tool originating from tabletop RPGs like Apocalypse World and Blades in the Dark. Story Clocks display progress as segments in a pie chart, filling in wedges as events or actions advance toward completion.

## Installation

We currently only provide the source code for this component. To use it in your project, either copy the source code into your project or import it as a git submodule.

## Examle Usage

The following example demonstrates how to use the `<cn-story-clock>` component to create a simple story clock with three ticks. Each tick is represented by a `<cn-tick>` component, which takes a `label` and a `value` prop. The `value` prop should be a number, representing the progress of the tick.

```html
<cn-story-clock
  name="Example clock"
  value="1">

  <cn-tick label="Start of the threat" value="0"></cn-tick>
  <cn-tick label="Mid point of the threat" value="1"></cn-tick>
  <cn-tick label="End of the threat" value="2"></cn-tick>

</cn-story-clock>
```