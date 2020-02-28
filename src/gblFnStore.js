
import { get, set } from '@t1m0thy_michael/u'

const GLOBAL = window || self || global
const STORE_KEY = '__P_FN_STORE__'

export const setPageFn = (name, fn) => set(GLOBAL, [STORE_KEY, name], fn)

export const getPageFn = (name) =>  get(GLOBAL, [STORE_KEY, name])

export default {
	setPageFn,
	getPageFn,
}