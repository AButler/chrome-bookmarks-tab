import { Injectable } from '@angular/core';

const SIMPLEFLAKE_EPOCH = 946684800000; // Date.UTC(2000, 0, 1) == epoch ms, since 1 Jan 2000 00:00
const UNSIGNED_23BIT_MAX = 8388607; // (Math.pow(2, 23) - 1) >> 0
const SIMPLEFLAKE_RANDOM_LENGTH = BigInt(23);

@Injectable({
  providedIn: 'root'
})
export class SimpleflakeService {
  constructor() {}

  generate(): string {
    const timestamp = Date.now();
    let flakeBigInt =
      (BigInt(timestamp - SIMPLEFLAKE_EPOCH) << SIMPLEFLAKE_RANDOM_LENGTH) +
      BigInt(Math.round(Math.random() * UNSIGNED_23BIT_MAX));

    const base58Digits =
      '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const carry = BigInt(base58Digits.length);
    const remainder = [];
    while (flakeBigInt > 0) {
      remainder.unshift(base58Digits[Number(flakeBigInt % carry)]);
      flakeBigInt /= carry;
    }

    const flake58 = remainder.join('');
    const paddedFlake = flake58.padStart(12, base58Digits[0]);

    return paddedFlake;
  }
}
