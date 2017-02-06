#!/usr/bin/env node

var express = require('express');
var request = require('request');

var app = express();

app.use(express.static('.', {
	maxAge: 0
}));

app.listen(1337);
