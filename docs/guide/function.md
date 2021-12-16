# Function

All functions are configurable, The following is enabled by default. Replacing sequence: repeat, random, index, set, get.

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