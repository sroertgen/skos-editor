import { writable } from "svelte/store"

export const ghData = writable({
    user: {},
    repos: [],
    treeData: {}
})

export const modalSelectedFile = writable(null)