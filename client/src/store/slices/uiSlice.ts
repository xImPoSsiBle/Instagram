import { createSlice } from "@reduxjs/toolkit"


interface UiState {
    createPostModal: boolean,
    showPostModal: boolean
}

const initialState: UiState = {
    createPostModal: false,
    showPostModal: false
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleCreatePostModal: (state) => {
            state.createPostModal = !state.createPostModal
        },
        toggleShowPostModal: (state) => {
            state.showPostModal = !state.showPostModal
        }
    }
})

export const { toggleCreatePostModal, toggleShowPostModal } = uiSlice.actions