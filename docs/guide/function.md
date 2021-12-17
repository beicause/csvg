# Function in svg

All functions are configurable by modifying `processors` in `Compiler`. The following will be handed to corresponding processors by default when `compile` a svg string matching the prefix( '@' by default ) and names.

## @random(min, max)

will be replaced with random number between two numbers, min and max can be omitted.  
alias:@ra

## @repeat(template, count)

will be replaced with the repeated templates.  
alias:@re

## @index(step, id, reset)

will be replaced with the increasing index by step. Only supports integer.    
alias:@i

## @set(value)/@get(index)

the former will be replaced with the template which will be saved in an array, the latter will be replaced with the array[index], supporting negative index, -1 by default.

## @calc(expression)

will be replaced with the result of the expression evaluation.

## exclamation postfix

 By default the functions within functions are executed firstly. With specific postfix( '!' by default ), functions will have a high priority and execute first, whose child functions will be treated as string template.