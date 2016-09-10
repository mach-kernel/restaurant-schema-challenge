var React = window.React = global.React = require('react');
var ReactDOM = window.ReactDOM = global.ReactDOM = require('react-dom');
window.$ = window.jQuery = require('jquery');
require('jquery-ujs');

const app = window.app = global.app = {};

app.ReactBootstrap = require('react-bootstrap');

app.getUrl = function(location, resource, path) {
  path = (typeof path === 'undefined') ? '/v1/' : '/' + path + '/';
  return location.origin + path + resource;
}

//= require_tree ./components