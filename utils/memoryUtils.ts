import { TFile, MarkdownView } from 'obsidian'
import MyPlugin from '../main'
import { fetchMemoriesFromAPI } from './fetchMemories'

export const getAIMemoriesContent = async (
	plugin: MyPlugin,
	range: string
): Promise<string> => {
	if (range === 'none') {
		return ''
	}

	const aiMemoriesPath = 'AI-memories.md'
	const aiMemoriesFile = plugin.app.vault.getAbstractFileByPath(aiMemoriesPath)

	if (aiMemoriesFile instanceof TFile) {
		const content = await plugin.app.vault.read(aiMemoriesFile)

		return await plugin.getFilteredMemories(range)
	}
	return ''
}

export const updateMemories = async (
	plugin: MyPlugin,
	inputContent: string,
	date = '',
	updateFile = false,
	range = 'all'
): Promise<string> => {
	const memoriesContent = await getAIMemoriesContent(plugin, range)
	const updatedMemories = await fetchMemoriesFromAPI(
		plugin,
		inputContent,
		date,
		() => Promise.resolve(memoriesContent)
	)

	if (updateFile) {
		const aiMemoriesPath = 'AI-memories.md'
		const memoryFile = plugin.app.vault.getAbstractFileByPath(aiMemoriesPath)
		if (memoryFile instanceof TFile) {
			const updatedContent = `${updatedMemories}\n\n${memoriesContent}`
			await plugin.app.vault.modify(memoryFile, updatedContent)
			await openAIMemoriesNote(plugin)
		} else {
			console.log('Error: Unable to access memory file')
		}
	}

	return updatedMemories
}

export const openAIMemoriesNote = async (plugin: MyPlugin): Promise<void> => {
	const notePath = 'AI-memories.md'
	const memoryFile = plugin.app.vault.getAbstractFileByPath(notePath)

	if (memoryFile instanceof TFile) {
		const leaf = plugin.app.workspace.getLeaf(true)
		await leaf.openFile(memoryFile)
	}
}

export const saveMemoriesToNote = async (plugin: MyPlugin): Promise<void> => {
	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
	if (!view) return

	const currentNoteFile = view.file
	if (currentNoteFile instanceof TFile) {
		const currentNoteContent = await plugin.app.vault.read(currentNoteFile)
		const dateMatch = currentNoteFile.name.match(/(\d{4}-\d{2}-\d{2})/)
		const noteDate = dateMatch ? dateMatch[1] : ''

		await updateMemories(plugin, currentNoteContent, noteDate, true)
	} else {
		console.log('Error: Unable to access current note file')
	}
}

export const fetchMemories = async (
	plugin: MyPlugin,
	userInput: string
): Promise<string> => {
	return await updateMemories(plugin, userInput)
}
