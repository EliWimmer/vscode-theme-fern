import fs from 'fs/promises'
import { fileIcons } from '../lib/defaults/fileIcons.js'
import { folderIcons } from '../lib/defaults/folderIcons.js'

async function buildIconSet() {
  try {
    // Base icon definitions
    const iconDefinitions = {
      _file: {
        iconPath: '../file-icons/_file.svg'
      },
      _folder: {
        iconPath: '../file-icons/_folder.svg'
      },
      _folder_open: {
        iconPath: '../file-icons/_folder_open.svg'
      }
    }

    // Process file icons
    for (const [name, _] of Object.entries(fileIcons)) {
      iconDefinitions[name] = {
        iconPath: `../file-icons/${name}.svg`
      }
    }

    // Process folder icons
    for (const [name, _] of Object.entries(folderIcons)) {
      iconDefinitions[`folder_${name}`] = {
        iconPath: `../file-icons/folder_${name}.svg`
      }
      iconDefinitions[`folder_${name}_open`] = {
        iconPath: `../file-icons/folder_${name}_open.svg`
      }
    }

    // Create the icon theme structure
    const iconSet = {
      iconDefinitions,
      file: '_file',
      folder: '_folder',
      folderExpanded: '_folder_open',
      folderNames: {},
      fileExtensions: {},
      fileNames: {},
      languageIds: {},
      light: {},
      highContrast: {}
    }

    // Add file associations
    for (const [name, config] of Object.entries(fileIcons)) {
      if (config.fileExtensions) {
        for (const ext of config.fileExtensions) {
          iconSet.fileExtensions[ext] = name
        }
      }
      if (config.fileNames) {
        for (const fileName of config.fileNames) {
          iconSet.fileNames[fileName] = name
        }
      }
      if (config.languageIds) {
        for (const langId of config.languageIds) {
          iconSet.languageIds[langId] = name
        }
      }
    }

    // Add folder associations
    for (const [name, config] of Object.entries(folderIcons)) {
      if (config.folderNames) {
        for (const folderName of config.folderNames) {
          iconSet.folderNames[folderName] = `folder_${name}`
        }
      }
    }

    // Write the generated JSON to a file
    await fs.writeFile(
      'themes/file-icons.json',
      JSON.stringify(iconSet, null, 2)
    )

    console.log('Icon set generated successfully!')
  } catch (error) {
    console.error('Error generating icon set:', error)
  }
}

buildIconSet()
