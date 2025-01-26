<script context="module" lang="ts">
	let onTop: HTMLDivElement | null = null; // Keeps track of the modal currently on top
	const modals: Record<
		string,
		{ open: (callback?: (retVal?: unknown) => void) => void; close: (retVal?: unknown) => void }
	> = {}; // Stores all modals with their APIs

	/**
	 * Returns an object for the modal specified by `id`, which contains the API functions (`open` and `close`).
	 * @param id - The ID of the modal.
	 * @returns The modal's API (open and close functions).
	 */
	export function getModal(id: string = '') {
		return modals[id];
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	let topDiv: HTMLDivElement | null = null;
	let visible = false;
	let prevOnTop: HTMLDivElement | null = null;
	let closeCallback: ((retVal?: unknown) => void) | undefined;

	export let id: string = '';

	function keyPress(ev: KeyboardEvent) {
		if (ev.key === 'Escape' && onTop === topDiv) close(); // ESC
	}

	function open(callback?: (retVal?: unknown) => void) {
		closeCallback = callback;
		if (visible) return;

		prevOnTop = onTop;
		onTop = topDiv;

		window.addEventListener('keydown', keyPress);
		document.body.style.overflow = 'hidden';

		visible = true;

		if (topDiv) {
			document.body.appendChild(topDiv);
		}
	}
	function close(retVal?: unknown) {
		if (!visible) return;

		window.removeEventListener('keydown', keyPress);
		onTop = prevOnTop;

		if (!onTop) {
			// Restore scrolling when no modals are open
			document.body.style.overflow = '';
		}

		visible = false;

		if (closeCallback) {
			closeCallback(retVal);
		}
	}

	modals[id] = { open, close };

	onDestroy(() => {
		delete modals[id];
		window.removeEventListener('keydown', keyPress);
	});
</script>

<div id="topModal" class:visible bind:this={topDiv} on:click={() => close()}>
	<div id="modal" on:click|stopPropagation={() => {}}>
		<svg id="close" on:click={() => close()} viewBox="0 0 12 12">
			<circle cx="6" cy="6" r="6" />
			<line x1="3" y1="3" x2="9" y2="9" />
			<line x1="9" y1="3" x2="3" y2="9" />
		</svg>
		<div id="modal-content">
			<slot></slot>
		</div>
	</div>
</div>

<style>
	#topModal {
		visibility: hidden;
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #4448;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#modal {
		position: relative;
		border-radius: 6px;
		background: white;
		border: 2px solid #000;
		filter: drop-shadow(5px 5px 5px #555);
		padding: 1em;
	}

	.visible {
		visibility: visible !important;
	}

	#close {
		position: absolute;
		top: -12px;
		right: -12px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		fill: #f44;
		transition: transform 0.3s;
	}

	#close:hover {
		transform: scale(2);
	}

	#close line {
		stroke: #fff;
		stroke-width: 2;
	}
	#modal-content {
		max-width: calc(100vw - 20px);
		max-height: calc(100vh - 20px);
		overflow: auto;
	}
</style>
