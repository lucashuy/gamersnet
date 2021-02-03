# Contributing
This document outlines basic coding and repository standards for this project.

## Naming Standards
* Use lowerCamelCase when naming functions and variables
    * `let myVariable` instead of `let my_variable`
    * `function myFunction` instead of `function MyFunctionName`
* Use UpperCamelCase when naming classes and interfaces
    * `class MyClass` instead of `class myClass`

## Coding Standards
* “blocked” statements have the bracket on the same line
```javascript
if (condition) {
    ...
}

function myFunction() {
    ...
}
```

* Have spaces between operators and parameters
```javascript
let myVariable = 123;
myVariable += 111;

for (let i = 0; i < 10; i++) {...}

myFunction(a, b, c);
```

* Place your comments on newlines, not inline
```javascript
// comments go here
let myVariable = 123;

let myVariable = 312; // not here
```
## Branch Standards
* Develop features and user stories on their own branches
* `master` is a protected branch, all updates to that branch must be approved in a merge/pull request
    * Merge/pull requests can be reviewed by any other member
    * The reviewee should make sure that their local branch is even with `master` before submitting their request
    * Any coding style changes that are required should be made by the reviewer

