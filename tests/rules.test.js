import test from 'node:test';
import assert from 'node:assert/strict';
import { checkQuantity, checkFulfilment, deliveryFee, conflictsWithAllergy } from '../src/rules/rules.js';

test('valid quantity is accepted', () => assert.equal(checkQuantity(3, 12).ok, true));
test('exactly the limit (6) is accepted', () => assert.equal(checkQuantity(6, 12).ok, true));
test('above the limit (7) is rejected with a specific message', () => {
  const r = checkQuantity(7, 12);
  assert.equal(r.ok, false);
  assert.match(r.message, /Maximum 6/);
});
test('stock below 6 lowers the limit', () => {
  const r = checkQuantity(4, 3);
  assert.equal(r.ok, false);
  assert.equal(r.limit, 3);
  assert.match(r.message, /Only 3 left/);
});
test('zero and non-integer quantities are rejected', () => {
  assert.equal(checkQuantity(0, 10).ok, false);
  assert.equal(checkQuantity(1.5, 10).ok, false);
});
test('delivery minimum: Rs 799 rejected, Rs 800 accepted', () => {
  assert.equal(checkFulfilment({ subtotal: 799, method: 'delivery', area: 'G-11' }).length, 1);
  assert.equal(checkFulfilment({ subtotal: 800, method: 'delivery', area: 'G-11' }).length, 0);
});
test('delivery outside service area is rejected; collection ignores area', () => {
  assert.equal(checkFulfilment({ subtotal: 900, method: 'delivery', area: 'I-8' }).length, 1);
  assert.equal(checkFulfilment({ subtotal: 100, method: 'collection', area: '' }).length, 0);
});
test('delivery fee: Rs 150 below 2000, free at exactly 2000', () => {
  assert.equal(deliveryFee(1999, 'delivery'), 150);
  assert.equal(deliveryFee(2000, 'delivery'), 0);
  assert.equal(deliveryFee(500, 'collection'), 0);
});
test('allergy conflict detection', () => {
  assert.equal(conflictsWithAllergy({ allergens: ['nuts'] }, 'nuts'), true);
  assert.equal(conflictsWithAllergy({ allergens: ['nuts'] }, 'none'), false);
});
