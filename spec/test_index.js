// This is to load all specs into one bundle
var testsContext = require.context('./', true, /.spec.jsx?$/);
testsContext.keys().forEach(testsContext);
