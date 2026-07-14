# C~
## Semi-Colons
For semi-colon usage, use it identically to C#.
## Variables
### Declaration
To declare a variable in C~ just do:
```cs
var x = 5;
```
You do not need to specify its type. The variables are like in Javascript where you can have `x = "hi"` then `x = 5`

### Change value
To change the value of a varaible just do:
```cs
x = 9;
```

## IF statements
To create an IF statement, just do:
```cs
if(x > 5){
    var output = "x > 5";
}
```
You can write the IF statements like in any other language hopefully, like the examples below:
```cs
// Super compact
if(1>0){var output = "1>0";}

// C#-Like
if (1 > 0)
{
    var output = "1>0";
}

// C++-Like?
if (1 > 0){
    var output = "1>0";
}

// Honestly, I'd be very suprised if you can somehow break the IF statement without trying to. Even this weirdness works:

if              (            6           >         2                )

                {
            var        output              =           "1>0"       ;
    }

// One known bug/error is when 0 is used in variables or conditions. I think its something to do with the Equate() method and boolean,
// its because 0 is quite weird in Javascript so yeah. It might be fixed..
```
