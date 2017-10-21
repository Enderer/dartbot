import { createBoard } from '../models';

const ringData = [
    { r: 6.35, m: 2, p: 25 },  // Double Bull
    { r: 16, p: 25 },          // Single Bull
    { r: 99 },                 // Skinny Single
    { r: 107, m: 3 },          // Treble
    { r: 162 },                // Fat Single
    { r: 170, m: 2 }           // Double and edge of score-able area
];

const sectors = [
    20, 5, 12, 9, 14, 
    11, 8, 16, 7, 19, 
    3, 17, 2, 15, 10, 
    6, 13, 4, 18, 1
];

const boardRadius = 225;

// Standard dartboard
export const board = createBoard(sectors, ringData, boardRadius);
