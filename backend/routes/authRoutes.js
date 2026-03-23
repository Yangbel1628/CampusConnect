const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const user = require('../models/user')