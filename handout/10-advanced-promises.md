# Part 10: More Promises

Now that we've got our code better organized using services, we can look at
some of the more interesting things we can do with promises.

## Reusing Promises

```javascript
  ...
  export class TasksService {

    private taskPromise;
    static $inject = ['serverService'];
    constructor(private serverService) { }

    public getTasks () {

      this.taskPromise = this.taskPromise || 
        this.serverService.get('/api/v1/tasks');
      return taskPromise;
    };
  }
```

## Postponing the Requests

```javascript
  ...
  export class ServerService {

    private baseUrl = 'http://ngcourse.herokuapp.com';

    static $inject = ['$http', 'userService'];
    constructor(
      private $http,
      private userService) { }
      
    public get(path) {
      return this.userService.whenAuthenticated()
        .then(() => this.$http.get(API_BASE_URL + path))
        .then(response => response.data);
    }
  }
```

## A Brand New Promise

Suppose we have a function that uses callbacks. We have a few options for
turning it into a function that returns a promise.

The first approach is to use `$q.defer()`:

```javascript
  function getFooPromise(param) {
    let deferred = $q.defer();
    getFooWithCallbacks(param, (error, result) => {
      if (error) {
        deferred.reject(error);
      } else {
        deferred.resolve(result);
      }
    });
    return deferred.promise;
  }
```

An alternative is to use the ES6-style constructor:

```javascript
  function getFooPromise(name) {
    return $q((resolve, reject) => {
      getFooWithCallbacks(param, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
```


However, beware of a very common JavaScript anti-pattern that involves
unnecessary creation of new promises. This is often called the "Deferred
Anti-pattern", but it applies equally to the ES6-style promise constructor. In
most cases, you do not need to create new promises from scratch and resolve
them yourself. If you got a promise from another function, you should use that
promise's `.then()` method to create further promises. It is almost never a
good idea to create a manually resolve a promise inside of a promise callback.

Converting a callback-style function to one returning a promise is about the
only valid case for using a promise constructor. Even in this case, however,
the result can be better achieved using a dedicated conversion function. For
example, if you have a function that relies on Node-style callbacks as in the
example above above, you can convert it using
[angular-promisify](https://github.com/rangle/angular-promisify) like so:

```javascript
  let getFooPromise = denodeify(getFooWithCallbacks);
```

While manually resolving promises is rarely a good idea, `$q` offers two
promise-creation methods that often come in very handy. You can use
`$q.when(value)` to create a promise that resolves to `value` and
`$q.reject(error)` to create a promise that rejects with `error`. Use those
methods when you want to avoid calling a function that would have given you
a promise.

```javascript
  function get(path) {
    if (!networkInformation.isOnline) {
      return $q.reject('offline');
    } else {
      return userService.whenAuthenticated()
        .then(() => $http.get(API_BASE_URL + path))
        .then(response => response.data);
    }
  };
```

Or, better yet:

```javascript

  function waitForPreconditions() {
    if (!networkInformation.isOnline) {
      return $q.reject('offline');
    } else {
      return userService.whenAuthenticated();
    }
  }

  function get(path) {
    return waitForPreconditions()
      .then(() => $http.get(API_BASE_URL + path))
      .then(response => response.data);
    }
  };
```

## Promises from `$timeout()`

Angular's `$timeout()` service also returns a promise. The same is true for a
number of other AngularJS functions.

## Promises vs Events

While promises are nearly always better than Node- style callbacks, the choice
of when to use promises vs a publish-subscribe approach is a bit more complex. Here are the key differences between the two approaches:

| Promises                           | Events (aka “Publish – Subscribe”) |
|------------------------------------|------------------------------------|
| Things that happen ONCE            | Things that happen MANY TIMES      |
| Same treatment for past and future | Only care about the future*        |
| Easily matched with requests       | Detached from requests             |

Promises are often the best approach for handling responses to an explicit
request, such as an HTTP call. Publish-subscribe often works better for
handling actions initiated by the user (except with modals).

## Next Steps

We now know most of what we need to know about services. Before we write more code, however, we need to get setup for unit testing.
