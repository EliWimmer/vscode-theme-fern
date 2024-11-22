<script
	lang="ts"
	context="module">
	type Props = {
		mode: 'user' | 'preset';
		origin?: 'options' | 'popup';
	};
</script>

<script lang="ts">
	import Button from '../ui/common/Button.svelte';

	import { ext } from 'src/app/services/extension.svelte';
	import { dropzone } from 'src/lib/actions/dropfile.svelte';
	import { slide } from 'svelte/transition';
	import { fUtils } from 'src/app/utils/utils.svelte';
	import { metaSession, uiSession } from 'src/app/core/session.svelte';
	import { fSync } from 'src/app/services/sync.svelte';

	let { mode, origin = 'popup' }: Props = $props();

	export const thisChildren = custom;
	export const thisMode = mode;

	let uploadSuccess = $state(false);
	let status:
		| { status: 'idle' }
		| { status: 'success' }
		| { status: 'error'; message: string } = $state({
		status: 'idle',
	});
	let dropZoneHover = $state(false);

	function importFlow(flowData: Flow) {}

	function UploadUserData(userData: ArrayBuffer) {
		fUtils.aesDecrypt(userData).then(async (data) => {
			const parsedResult = JSON.parse(data as string);
			await chrome.storage.local.set(parsedResult);
			status = {
				status: 'success',
			};
		});
	}

	function handleUploadButton() {
		// open system file picker
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.fly';
		input.onchange = () => {
			const file = input.files[0];
			handleFile(file);
		};
		input.click();
	}

	async function handleFile(file: File) {
		if (mode === 'user') {
			const asArrayBuffer = await file.arrayBuffer();
			UploadUserData(asArrayBuffer);
		} else {
			const asJson = await file.text().then((text) => JSON.parse(text));
			importFlow(asJson);
		}
	}

	function handleContinue() {}

	function restartCaption() {}
</script>

{#snippet custom()}
	<div class="modal-container">
		{#if !fSync?.session}
			<div class="message">
				Please login to your Flylighter account to download or restore
				your data.
			</div>
			<Button
				label="Login"
				size="sm"
				style="primary"
				fill
				onclick={() => {
					uiSession.modalInfo = null;
					uiSession.mainRoute = 'login';
				}} />
		{:else}
			{#if uploadSuccess || status.status === 'success'}
				<div class="success">
					<span style="color: var(--green); font-weight: 600;"
						>Restore successful!</span>
					You will need to refresh any pages that you have open to see
					the changes.
					<Button
						label={origin === 'popup' ? 'Reload Extension' : (
							'Close'
						)}
						size="md"
						style="secondary"
						onclick={() => {
							if (origin === 'options') {
								ext.tabs.reload(metaSession.tab.id);
							}
							if (origin === 'popup') {
								uiSession.restartPopup();
							}
							uiSession.modalInfo = null;
						}} />
				</div>
			{:else}
				<div
					class="dropzone"
					use:dropzone={{ accept: 'any' }}
					onfiledragover={() => (dropZoneHover = true)}
					onfiledragleave={() => (dropZoneHover = false)}
					onfiledrop={() => (dropZoneHover = false)}
					onfile={(e) => handleFile(e.detail)}
					onreject={(e) => {
						status = {
							status: 'error',
							message: 'An error occurred',
						};
					}}>
					<div
						class="dropzone-content"
						class:dropZoneHover>
						<div class="dropzone-content-text">
							<p>
								Drop your <code
									>{mode === 'user' ? 'userdata.fly' : (
										'flowpreset.fly'
									)}</code> file here
							</p>
							<p>or</p>
						</div>
						<div class="dropzone-content-button">
							<Button
								label="Select File"
								size="sm"
								style="secondary"
								onclick={() => {
									handleUploadButton();
								}} />
						</div>
					</div>
				</div>
			{/if}
			{#if status.status === 'error'}
				<div
					class="error"
					transition:slide|local={{ duration: 150 }}>
					{status.message}
				</div>
			{/if}
		{/if}
	</div>
{/snippet}

<style lang="scss">
	@use 'src/styles/global.scss' as *;

	.modal-container {
		width: 100%;
		max-width: 500px;
		.success {
			@include flex(column, center, center);
			@include ui-text(var(--text), $p14, 400);
			height: 100%;
			width: 100%;
			padding: $p8;
			box-sizing: border-box;
			gap: $p16;
			text-align: center;
		}
		.dropzone {
			@include flex(column, center, center);
			height: 100%;
			width: 100%;
			padding: $p4 0 0 0;
			box-sizing: border-box;
			.dropzone-content {
				@include flex(column, center, center);
				padding: $p32 $p16;
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				border-radius: $p8;
				border: 2px dashed var(--border-color);
				.dropzone-content-text {
					@include flex(column, center, center);
					p {
						@include ui-text(var(--text-secondary), $p14, 400);
						display: block;
						margin: $p4 0;
						&:nth-child(2) {
							color: var(--text-tertiary);
							margin-bottom: $p8;
						}
					}
				}
				&.dropZoneHover {
					background-color: var(--bg-secondary);
				}
			}
		}
		.error {
			@include ui-text(var(--red), $p14, 400);
			text-align: center;
			width: 100%;
			padding: $p12 $p8 $p4 $p8;
			box-sizing: border-box;
		}
		code {
			@include ui-text(var(--text-secondary), $p12, 400);
			background-color: var(--bg-tertiary);
			padding: $p2 $p4;
			border-radius: $p6;
		}
		.message {

			@include ui-text(var(--text), $p14, 500);
			width: 100%;
			text-align: center;
			padding: $p16;
			box-sizing: border-box;
		}
	}
</style>