import { describe, it, expect } from 'vitest';
import { calculateCompensation } from './ec261.js';

describe('EC 261/2004 calculator', () => {
  it('clear-cut short haul: 252 min delay, 1180 km -> €250', () => {
    const r = calculateCompensation(252, 1180);
    expect(r.eligible).toBe(true);
    expect(r.amount).toBe(250);
    expect(r.tier).toBe('short');
  });

  it('long-haul marginally eligible: 240 min, 3800 km -> €600', () => {
    const r = calculateCompensation(240, 3800);
    expect(r.eligible).toBe(true);
    expect(r.amount).toBe(600);
    expect(r.tier).toBe('long');
  });

  it('short delay not eligible: 90 min, 900 km', () => {
    const r = calculateCompensation(90, 900);
    expect(r.eligible).toBe(false);
    expect(r.amount).toBe(0);
  });

  it('medium haul: 180 min, 2000 km -> €400', () => {
    const r = calculateCompensation(180, 2000);
    expect(r.eligible).toBe(true);
    expect(r.amount).toBe(400);
  });

  it('boundary: 119 min short haul not eligible', () => {
    const r = calculateCompensation(119, 1000);
    expect(r.eligible).toBe(false);
  });

  it('boundary: 120 min short haul eligible', () => {
    const r = calculateCompensation(120, 1000);
    expect(r.eligible).toBe(true);
    expect(r.amount).toBe(250);
  });
});
