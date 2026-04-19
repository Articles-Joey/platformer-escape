import { create } from 'zustand'

function actionByKey(key) {
	const keyActionMap = {
		KeyW: 'moveForward',
		KeyS: 'moveBackward',
		KeyA: 'moveLeft',
		KeyD: 'moveRight',
		Space: 'jump',
		ShiftLeft: 'shift',
		KeyC: 'crouch',
		KeyV: 'cameraView',
		Digit1: 'dirt',
		Digit2: 'grass',
		Digit3: 'glass',
		Digit4: 'wood',
		Digit5: 'log',
	}
	return keyActionMap[key]
}

// Zustand store — use getState() in useFrame for zero-cost reads,
// or use as a hook for reactive subscriptions.
export const useKeyboardStore = create(() => ({
	moveForward: false,
	moveBackward: false,
	moveLeft: false,
	moveRight: false,
	jump: false,
	shift: false,
	crouch: false,
	cameraView: false,
	dirt: false,
	grass: false,
	glass: false,
	wood: false,
	log: false,
}))

if (typeof document !== 'undefined') {
	document.addEventListener('keydown', (e) => {
		const action = actionByKey(e.code)
		if (action) useKeyboardStore.setState({ [action]: true })
	})
	document.addEventListener('keyup', (e) => {
		const action = actionByKey(e.code)
		if (action) useKeyboardStore.setState({ [action]: false })
	})
}

// Backwards-compatible hook
export const useKeyboard = useKeyboardStore