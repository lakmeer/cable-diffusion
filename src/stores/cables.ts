
import type { Cable, Point } from "$types";

import { pluck } from "$utils";
import { writable } from 'svelte/store';


// Data

const cables:Array<Cable> = [];

const store = writable(cables);

const { update } = store;


// Mutators

export default store;

export const addCable = (cable:Cable) =>
  update(cables => [ cable, ...cables ])

export const updateCable = (cable:Cable) =>
  update(cables =>
    cables.map(storedCable =>
      (storedCable.id === cable.id) ? cable : storedCable))

