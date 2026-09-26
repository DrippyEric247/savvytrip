/**
 * Smoke checks for SavvyTrip Core client helpers (no live API required).
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const adapterSrc = readFileSync(join(root, 'src/lib/savvyCore/savvyTripCoreAdapter.ts'), 'utf8')
assert.match(adapterSrc, /fetchSavvyTripCoreAccount/)
assert.match(adapterSrc, /SAVVYTRIP/i)

const clientSrc = readFileSync(join(root, 'src/lib/savvyCore/client.ts'), 'utf8')
assert.match(clientSrc, /savvytrip-core-proof/)
assert.match(clientSrc, /SAVVYTRIP_SOURCE_APP/)

console.log('savvy-core-parity-smoke: PASS')
