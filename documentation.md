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
### Examples of IF statements
✅
```cs
if(1 < 2){
    var output = "1 < 2";
}
```
✅
```cs
if( 1 < 2 )      {
  var output = "1 < 2";

}
```

✅
```cs
if( 1 < 2 )               {
var output = "1 < 2";}
```

❌
```cs
if( 1 < 2 )
{
var output = "1 < 2";
}
```
❌
```cs
if( 1 < 2 )
{var output = "1 < 2";
}
```
