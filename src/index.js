import React from 'react';
import ReactDOM from 'react-dom/client';
import { CalendarApp } from './CalendarApp';

console.log(process.env)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CalendarApp />
);
