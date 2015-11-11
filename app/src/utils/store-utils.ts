export function makeAuthenticatedMethod(auth, method) {
  return function() {
    let methodArgs = arguments;
    return auth.isAuthenticated()
      .then(() => method.apply(this, methodArgs));
  };
}
